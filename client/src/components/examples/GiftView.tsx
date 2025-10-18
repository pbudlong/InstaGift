import GiftView from '../GiftView';

export default function GiftViewExample() {
  const mockGift = {
    id: 'gift_123',
    businessName: 'Sparkle Auto Spa',
    amount: 75,
    emoji: '🚗',
    brandColors: ['#3b82f6', '#1d4ed8'],
    message: 'Happy Birthday! Get the X5 detailed before lunch',
    recipientName: 'Jake',
    cardNumber: '4242 4242 4242 4242',
    cardExpiry: '12/28',
    cardCvv: '123'
  };

  return <GiftView gift={mockGift} />;
}
