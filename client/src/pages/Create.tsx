import { useState } from 'react';
import GiftCreator from '@/components/GiftCreator';
import PaymentSuccess from '@/components/PaymentSuccess';
import { useLocation } from 'wouter';

export default function Create() {
  const [, setLocation] = useLocation();
  const [giftId, setGiftId] = useState<string | null>(null);

  const handleCheckout = (giftData: any) => {
    // In real app, this would call Stripe and create the gift
    // For now, simulate success
    const mockGiftId = 'gift_' + Math.random().toString(36).substr(2, 9);
    setGiftId(mockGiftId);
  };

  if (giftId) {
    return (
      <PaymentSuccess 
        giftId={giftId}
        giftUrl={`${window.location.origin}/gift/${giftId}`}
        onHome={() => {
          setGiftId(null);
          setLocation('/');
        }}
      />
    );
  }

  return (
    <GiftCreator 
      onBack={() => setLocation('/')}
      onCheckout={handleCheckout}
    />
  );
}
