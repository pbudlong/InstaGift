import LandingPage from '../LandingPage';

export default function LandingPageExample() {
  return (
    <LandingPage 
      onCreateGift={() => console.log('Create gift clicked')}
    />
  );
}
