import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, CreditCard, Copy, Check, Code } from 'lucide-react';
import GiftCard from './GiftCard';
import Logo from './Logo';
import confetti from 'canvas-confetti';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
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
    vibe?: string;
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
  const [, setLocation] = useLocation();

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
            vibe={gift.vibe}
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
              <div className="space-y-6">
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

                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-sm opacity-80">{device === 'ios' ? 'Apple Pay' : device === 'android' ? 'Google Pay' : 'Wallet'}</div>
                    <CreditCard className="w-6 h-6 opacity-60" />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs opacity-60 mb-1">CARD NUMBER</div>
                      <div className="font-mono text-lg tracking-wider">
                        {gift.cardNumber || '4571 •••• •••• 4242'}
                      </div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-xs opacity-60 mb-1">CARDHOLDER</div>
                        <div className="font-medium">{gift.recipientName}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs opacity-60 mb-1">EXPIRES</div>
                        <div className="font-mono">{gift.cardExpiry || '12/28'}</div>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-white/10">
                      <div className="text-sm opacity-80">Gift Balance</div>
                      <div className="text-3xl font-bold">${gift.amount}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-primary">
                  <p className="text-base text-muted-foreground">
                    <strong className="text-foreground">How it works:</strong> This is not an actual gift card at {gift.businessName}. 
                    You now have <strong className="text-foreground">${gift.amount} in your wallet</strong> that you can use to buy your gift at {gift.businessName} — 
                    or if you choose, use the money anywhere you want! After all, it's the thought that counts 😊
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <Button
            size="lg"
            variant="outline"
            onClick={() => setLocation('/tech')}
            data-testid="button-view-tech"
            className="px-8"
          >
            <Code className="w-5 h-5 mr-2" />
            View Tech Stack
          </Button>
        </div>

      </div>
    </div>
  );
}
