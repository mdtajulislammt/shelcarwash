import { useNavigate } from 'react-router-dom';
import { MyAccount } from '@/features/account/components/MyAccount';

export function AccountPage() {
  const navigate = useNavigate();
  return <MyAccount onBook={() => navigate('/book')} />;
}
