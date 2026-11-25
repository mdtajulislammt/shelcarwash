import { useNavigate } from 'react-router-dom';
import { MyBookings } from '@/features/bookings/components/MyBookings';
import { ProfileSection } from '@/features/profile/components/ProfileSection';

export function MyBookingsPage() {
  const navigate = useNavigate();
  return (
    <>
      <div className="pt-6">
        <ProfileSection />
      </div>
      <MyBookings onStartNewBooking={() => navigate('/book')} />
    </>
  );
}
