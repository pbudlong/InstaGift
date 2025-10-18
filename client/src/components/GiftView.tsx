import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, CreditCard, Copy, Check } from 'lucide-react';
import GiftCard from './GiftCard';
import Logo from './Logo';
import confetti from 'canvas-confetti';
import { useToast } from '@/hooks/use-toast';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface GiftViewProps {
  gift: {
    id: string;
    businessName: string;
    amount: number;
    emoji: string;
    brandColors: string[];
    message?: string;
    recipientName: string;
    cardNumber?: string;
    cardExpiry?: string;
    cardCvv?: string;
  };
}

export default function GiftView({ gift }: GiftViewProps) {
  const [isAdded, setIsAdded] = useState(false);
  const [device, setDevice] = useState<'ios' | 'android' | 'desktop'>('desktop');
  const [showCardDetails, setShowCardDetails] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const userAgent = navigator.userAgent;
    if (/iPhone|iPad|iPod/.test(userAgent)) {
      setDevice('ios');
    } else if (/Android/.test(userAgent)) {
      setDevice('android');
    }
  }, []);

  const handleAddToWallet = () => {
    setIsAdded(true);
    
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#ec4899', '#3b82f6']
    });

    toast({
      title: "Added to Wallet! 🎉",
      description: "Your gift card is now in your mobile wallet",
    });
  };

  const copyCardDetail = (detail: string, name: string) => {
    navigator.clipboard.writeText(detail);
    toast({
      title: "Copied!",
      description: `${name} copied to clipboard`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Logo />
        </div>
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 font-display">
            A Gift For You! 🎁
          </h1>
          <p className="text-xl text-muted-foreground">
            Someone special sent you a gift
          </p>
        </div>

        <div className="mb-8">
          <GiftCard
            businessName={gift.businessName}
            amount={gift.amount}
            emoji={gift.emoji}
            brandColors={gift.brandColors}
            message={gift.message}
            recipientName={gift.recipientName}
            size="large"
          />
        </div>

        <Card className="mb-6">
          <CardContent className="p-8">
            {!isAdded ? (
              <div className="text-center space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold mb-2">
                    Add to Your Wallet
                  </h3>
                  <p className="text-muted-foreground">
                    Tap the button below to add this gift card to your mobile wallet
                  </p>
                </div>

                <Button
                  size="lg"
                  className="w-full sm:w-auto px-12"
                  onClick={handleAddToWallet}
                  data-testid="button-add-wallet"
                >
                  <Smartphone className="w-5 h-5 mr-2" />
                  {device === 'ios' ? 'Add to Apple Pay' : device === 'android' ? 'Add to Google Pay' : 'Add to Wallet'}
                </Button>

                <p className="text-xs text-muted-foreground">
                  Powered by Stripe • Secure & Instant
                </p>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">
                    Added to Wallet! ✓
                  </h3>
                  <p className="text-muted-foreground">
                    Your gift card is now available in your {device === 'ios' ? 'Apple' : device === 'android' ? 'Google' : 'mobile'} wallet
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Collapsible open={showCardDetails} onOpenChange={setShowCardDetails}>
          <Card>
            <CollapsibleTrigger className="w-full" data-testid="button-toggle-card-details">
              <CardHeader className="cursor-pointer hover-elevate">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Card Details
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {showCardDetails ? 'Hide' : 'Show'}
                  </span>
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Card Number</div>
                      <div className="font-mono font-semibold" data-testid="text-card-number">
                        {gift.cardNumber || '4242 4242 4242 4242'}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyCardDetail(gift.cardNumber || '4242424242424242', 'Card number')}
                      data-testid="button-copy-card-number"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Expiry</div>
                        <div className="font-mono font-semibold" data-testid="text-card-expiry">
                          {gift.cardExpiry || '12/28'}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyCardDetail(gift.cardExpiry || '12/28', 'Expiry date')}
                        data-testid="button-copy-expiry"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">CVV</div>
                        <div className="font-mono font-semibold" data-testid="text-card-cvv">
                          {gift.cardCvv || '123'}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyCardDetail(gift.cardCvv || '123', 'CVV')}
                        data-testid="button-copy-cvv"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </div>
    </div>
  );
}
