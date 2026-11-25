import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SERVICE_AREA_ERROR } from '@/config/site';
import { useProfileStore } from '@/features/profile/store/profileStore';
import { EMPTY_CUSTOMER, useBookingStore } from '../store/bookingStore';
import { BookingForm } from './BookingForm';

function renderForm(onValid = vi.fn()) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={client}>
      <BookingForm onBack={vi.fn()} onValid={onValid} />
    </QueryClientProvider>,
  );
  return onValid;
}

describe('BookingForm', () => {
  beforeEach(() => {
    useBookingStore.setState({ customer: EMPTY_CUSTOMER });
    useProfileStore.setState({ profile: null });
  });

  it('shows a red service-area error on ZIP blur and blocks Continue', async () => {
    const user = userEvent.setup();
    const onValid = renderForm();
    const zip = screen.getByLabelText('ZIP Code *');
    expect(zip).toHaveValue(''); // no default ZIP
    await user.type(zip, '90001');
    await user.tab();
    expect(screen.getByText(SERVICE_AREA_ERROR)).toHaveClass('text-rose-400');
    await user.click(screen.getByRole('button', { name: /proceed to payment/i }));
    expect(onValid).not.toHaveBeenCalled();
  });

  it('fills the city from a valid ZIP', async () => {
    const user = userEvent.setup();
    renderForm();
    await user.type(screen.getByLabelText('ZIP Code *'), '94507');
    expect(screen.getByLabelText('City *')).toHaveValue('Alamo');
  });

  it('pre-fills from the saved profile with an Edit option', async () => {
    useProfileStore.setState({
      profile: {
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        phone: '(925) 555-0100',
        streetAddress: '7000 Village Pkwy',
        city: 'Dublin',
        state: 'CA',
        zipCode: '94568',
      },
    });
    const user = userEvent.setup();
    renderForm();
    expect(
      await screen.findByText('Using your saved profile', {}, { timeout: 2000 }),
    ).toBeVisible();
    expect(screen.queryByLabelText('Full Name *')).toBeNull();

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    expect(screen.getByLabelText('Full Name *')).toHaveValue('Jane Doe');
    expect(screen.getByLabelText('Street Address (Mobile Location) *')).toHaveValue(
      '7000 Village Pkwy',
    );
    expect(screen.getByLabelText('ZIP Code *')).toHaveValue('94568');
  });
});
