import { useNavigate } from 'react-router-dom';
import { MyBookings } from '@/features/bookings/components/MyBookings';

export function MyBookingsPage() {
  const navigate = useNavigate();
  return <MyBookings onStartNewBooking={() => navigate('/book')} />;
}
