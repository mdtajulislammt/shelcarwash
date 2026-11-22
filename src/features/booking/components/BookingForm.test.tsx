import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SERVICE_AREA_ERROR } from '@/config/site';
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
  beforeEach(() => useBookingStore.setState({ customer: EMPTY_CUSTOMER }));

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
});
