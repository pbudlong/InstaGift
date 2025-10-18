import { useState } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft } from 'lucide-react';
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
  const elementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
    },
    defaultValues: {
      billingDetails: {
        name: 'Demo User',
        address: {
          line1: '123 Main St',
          city: 'San Francisco',
          state: 'CA',
          postal_code: '94111',
          country: 'US',
        },
      },
    },
    fields: {
      billingDetails: {
        email: 'never',
        phone: 'never',
      },
    },
    wallets: {
      applePay: 'never',
      googlePay: 'never',
    },
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

        <Card className="mb-4 bg-muted/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Test Card:</strong> 4242 4242 4242 4242 • Any future expiry • Any CVC • Any zip
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Complete Your Purchase</CardTitle>
            <p className="text-muted-foreground">
              You're creating a ${amount} gift card for {businessName}
            </p>
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
