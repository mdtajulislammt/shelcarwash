import { useNavigate } from 'react-router-dom';
import { ServiceSelector } from '@/features/booking/components/ServiceSelector';
import { Hero } from '@/features/marketing/components/Hero';

export function HomePage() {
  const navigate = useNavigate();
  const goToBooking = () => navigate('/book');

  return (
    <div className="space-y-12">
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <Hero
          onStartBooking={goToBooking}
          onExploreServices={() =>
            document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' })
          }
        />
      </div>
      <ServiceSelector onContinue={goToBooking} />
    </div>
  );
}
