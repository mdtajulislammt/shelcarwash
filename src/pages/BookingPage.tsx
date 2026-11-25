import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookingForm } from '@/features/booking/components/BookingForm';
import { CheckoutModal } from '@/features/booking/components/checkout/CheckoutModal';
import { useBookingStore } from '@/features/booking/store/bookingStore';

export function BookingPage() {
  const navigate = useNavigate();
  const resetAfterBooking = useBookingStore((s) => s.resetAfterBooking);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <>
      <BookingForm onBack={() => navigate('/')} onValid={() => setCheckoutOpen(true)} />
      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onDone={() => {
          setCheckoutOpen(false);
          resetAfterBooking();
          navigate('/bookings');
        }}
      />
    </>
  );
}
