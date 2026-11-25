import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CATALOG } from '@/data/services';
import { useBookingStore } from '../store/bookingStore';
import { BookingSummaryBar } from './BookingSummaryBar';

function renderBar(onContinue = vi.fn()) {
  const client = new QueryClient();
  render(
    <QueryClientProvider client={client}>
      <BookingSummaryBar onContinue={onContinue} />
    </QueryClientProvider>,
  );
  return onContinue;
}

const total = () => screen.getByTestId('summary-total').textContent;
const pkg = (id: string) => CATALOG.packages.find((p) => p.id === id)!;
const addOn = (id: string) => CATALOG.addOns.find((a) => a.id === id)!;
const multiplier = (id: string) => CATALOG.vehicles.find((v) => v.id === id)!.priceMultiplier;

describe('BookingSummaryBar', () => {
  beforeEach(() =>
    useBookingStore.setState({
      vehicle: 'sedan',
      packageId: 'executive-full-detail',
      addonIds: [],
      isRecurring: false,
    }),
  );

  it('shows round(base × multiplier) + add-ons and updates live', () => {
    const onContinue = renderBar();
    const base = pkg('executive-full-detail').basePrice;
    expect(total()).toBe(`$${Math.round(base * multiplier('sedan'))}`);

    act(() => {
      useBookingStore.getState().setVehicle('exotic');
      useBookingStore.getState().toggleAddon('headlight-restoration');
    });
    const expected = Math.round(base * multiplier('exotic')) + addOn('headlight-restoration').price;
    expect(total()).toBe(`$${expected}`);
    expect(screen.getByTestId('summary-details')).toHaveTextContent(
      `${pkg('executive-full-detail').name} • EXOTIC • 1 Add-ons`,
    );

    act(() => useBookingStore.getState().toggleAddon('headlight-restoration'));
    expect(total()).toBe(`$${Math.round(base * multiplier('exotic'))}`);
    expect(onContinue).not.toHaveBeenCalled();
  });

  it('offers Weekly / Bi-Weekly / Monthly for maintenance packages only', async () => {
    const user = userEvent.setup();
    useBookingStore.setState({ packageId: 'maintenance-clean' });
    const onContinue = renderBar();

    await user.click(screen.getByRole('button', { name: 'Monthly' }));
    expect(useBookingStore.getState()).toMatchObject({
      isRecurring: true,
      recurringFrequency: 'monthly',
    });
    expect(screen.getByRole('button', { name: 'Monthly' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('switch', { name: 'Reoccurring Cleanings' })).toBeChecked();

    await user.click(screen.getByRole('button', { name: /schedule appointment/i }));
    expect(onContinue).toHaveBeenCalledOnce();

    act(() => useBookingStore.getState().selectPackage('executive-full-detail'));
    expect(screen.queryByRole('switch')).toBeNull();
  });
});
