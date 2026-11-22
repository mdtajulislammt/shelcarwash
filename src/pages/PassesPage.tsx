import { useNavigate } from 'react-router-dom';
import { MyPasses } from '@/features/account/components/MyPasses';

export function PassesPage() {
  const navigate = useNavigate();
  return <MyPasses onBook={() => navigate('/book')} />;
}
