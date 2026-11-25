import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TIME_SLOTS } from '@/config/site';
import { availabilityService } from '@/services';
import { useBookingStore } from '../store/bookingStore';
import { Scheduler } from './Scheduler';

function renderScheduler() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={client}>
      <Scheduler totalDuration={240} />
    </QueryClientProvider>,
  );
}

describe('Scheduler slot list', () => {
  beforeEach(() => useBookingStore.setState({ slotId: null }));

  it('lists the three 3-hour windows and never offers a booked slot', async () => {
    // 8–11 AM is already booked on the selected day.
    vi.spyOn(availabilityService, 'getAvailability').mockResolvedValue(
      TIME_SLOTS.map((s) => ({ ...s, available: s.id !== '08:00' })),
    );
    renderScheduler();

    const booked = await screen.findByRole('button', { name: /8:00–11:00 AM\s*Unavailable/ });
    expect(booked).toBeDisabled();
    const midday = screen.getByRole('button', { name: /11:00 AM–2:00 PM\s*Midday/ });
    const afternoon = screen.getByRole('button', { name: /2:00–5:00 PM\s*Afternoon/ });
    expect(midday).toBeEnabled();
    expect(afternoon).toBeEnabled();

    // The first open slot is pre-selected, never the booked one.
    await vi.waitFor(() => expect(useBookingStore.getState().slotId).toBe('11:00'));
    expect(midday).toHaveAttribute('aria-pressed', 'true');
    expect(booked).toHaveAttribute('aria-pressed', 'false');
  });
});
