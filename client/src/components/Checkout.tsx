import { useState } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Logo from './Logo';

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CheckoutFormProps {
  onSuccess: () => void;
  amount: number;
}

function CheckoutForm({ onSuccess, amount }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'Payment failed');
        setIsProcessing(false);
      } else {
        onSuccess();
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {errorMessage && (
        <div className="text-sm text-destructive" data-testid="text-error">
          {errorMessage}
        </div>
      )}

      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full"
        size="lg"
        data-testid="button-complete-payment"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay $${amount}`
        )}
      </Button>
    </form>
  );
}

interface CheckoutProps {
  clientSecret: string;
  amount: number;
  businessName: string;
  onSuccess: () => void;
  onBack: () => void;
}

export default function Checkout({ clientSecret, amount, businessName, onSuccess, onBack }: CheckoutProps) {
  const { toast } = useToast();
  
  const elementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
    },
    defaultValues: {
      billingDetails: {
        name: 'Demo User',
        email: 'demo@example.com',
        phone: '+1 (555) 555-5555',
        address: {
          line1: '123 Main St',
          city: 'San Francisco',
          state: 'CA',
          postal_code: '94111',
          country: 'US',
        },
      },
    },
  };

  const handleUseTestCard = () => {
    navigator.clipboard.writeText('4242424242424242');
    toast({
      title: "Test card copied!",
      description: "Paste 4242 4242 4242 4242 into the card field. Other fields are pre-filled.",
    });
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-2xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <Logo />
          <Button 
            variant="ghost" 
            onClick={onBack}
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Complete Your Purchase</CardTitle>
            <p className="text-muted-foreground">
              You're creating a ${amount} gift card for {businessName}
            </p>
            <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-semibold mb-2 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Demo Test Card
                  </p>
                  <div className="text-sm space-y-1 text-muted-foreground font-mono">
                    <p>Card: 4242 4242 4242 4242</p>
                    <p>Exp: 12/28 • CVV: 123 • ZIP: 94111</p>
                  </div>
                </div>
                <Button 
                  onClick={handleUseTestCard}
                  size="sm"
                  data-testid="button-use-test-card"
                >
                  Copy Card Number
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Elements stripe={stripePromise} options={elementsOptions}>
              <CheckoutForm onSuccess={onSuccess} amount={amount} />
            </Elements>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
