import GiftCreator from '../GiftCreator';

export default function GiftCreatorExample() {
  return (
    <GiftCreator 
      onBack={() => console.log('Back clicked')}
      onCheckout={(data) => console.log('Checkout:', data)}
    />
  );
}
