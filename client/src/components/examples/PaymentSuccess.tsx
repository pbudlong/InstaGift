import PaymentSuccess from '../PaymentSuccess';

export default function PaymentSuccessExample() {
  return (
    <PaymentSuccess 
      giftId="gift_abc123"
      giftUrl="https://instagift.app/gift/abc123"
      onHome={() => console.log('Home clicked')}
    />
  );
}
