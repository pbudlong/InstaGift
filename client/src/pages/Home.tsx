import LandingPage from '@/components/LandingPage';
import { useLocation } from 'wouter';

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <LandingPage 
      onCreateGift={() => setLocation('/create')}
    />
  );
}
