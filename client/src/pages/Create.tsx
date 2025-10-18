import { useState } from 'react';
import GiftCreator from '@/components/GiftCreator';
import Checkout from '@/components/Checkout';
import PaymentSuccess from '@/components/PaymentSuccess';
import { useLocation } from 'wouter';

type Stage = 'create' | 'checkout' | 'success';

interface GiftData {
  businessName: string;
  businessType: string;
  brandColors: string[];
  emoji: string;
  amount: number;
  message?: string;
  recipientName: string;
  recipientEmail: string;
  recipientPhone?: string;
}

export default function Create() {
  const [, setLocation] = useLocation();
  const [stage, setStage] = useState<Stage>('create');
  const [giftData, setGiftData] = useState<GiftData | null>(null);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [giftId, setGiftId] = useState<string>('');

  const handleCheckout = async (data: GiftData) => {
    setGiftData(data);
    
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: data.amount })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }
      
      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
      setStage('checkout');
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    }
  };

  const handlePaymentSuccess = async () => {
    if (!giftData) return;
    
    try {
      const response = await fetch('/api/create-gift', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(giftData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create gift');
      }
      
      const gift = await response.json();
      setGiftId(gift.id);
      setStage('success');
    } catch (error) {
      console.error('Gift creation error:', error);
      alert('Payment succeeded but gift creation failed. Please contact support.');
    }
  };

  if (stage === 'success' && giftId) {
    return (
      <PaymentSuccess 
        giftId={giftId}
        giftUrl={`${window.location.origin}/gift/${giftId}`}
        recipientPhone={giftData?.recipientPhone}
        onHome={() => {
          setStage('create');
          setGiftData(null);
          setGiftId('');
          setLocation('/');
        }}
      />
    );
  }

  if (stage === 'checkout' && giftData && clientSecret) {
    return (
      <Checkout 
        clientSecret={clientSecret}
        amount={giftData.amount}
        businessName={giftData.businessName}
        onSuccess={handlePaymentSuccess}
        onBack={() => setStage('create')}
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
