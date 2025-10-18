import GiftCard from '../GiftCard';

export default function GiftCardExample() {
  return (
    <div className="p-8 bg-background">
      <GiftCard 
        businessName="Sparkle Auto Spa"
        amount={75}
        emoji="🚗"
        brandColors={['#3b82f6', '#1d4ed8']}
        message="Happy Birthday! Get the X5 detailed before lunch"
        recipientName="Jake"
      />
    </div>
  );
}
