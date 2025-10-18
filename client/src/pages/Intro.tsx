import { Button } from '@/components/ui/button';
import { ArrowRight, SkipForward } from 'lucide-react';
import { useLocation } from 'wouter';
import Logo from '@/components/Logo';

export default function Intro() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-4xl w-full space-y-12 text-center">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        <div className="space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold font-display leading-tight">
            Last-minute gifting sucks.
          </h1>

          <div className="space-y-6 text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            <p>
              Generic Amazon cards feel impersonal. Local businesses don't sell gift cards. 
              I spent hours manually creating one gift card for a friend.
            </p>
            
            <p className="text-foreground font-semibold">
              InstaGift makes this as easy as buying a Starbucks card - but for <span className="text-primary">ANY</span> local business.
            </p>
            
            <p>
              Paste a URL, AI creates a beautiful branded card, real money loads via Stripe, 
              and it goes straight to their phone's wallet.
            </p>

            <div className="pt-4 space-y-3 text-lg">
              <p className="text-muted-foreground">
                Built in 4 hours on <strong className="text-foreground">Replit</strong>
              </p>
              <p className="text-muted-foreground">
                Powered by <strong className="text-foreground">Stripe Issuing</strong> and <strong className="text-foreground">OpenAI</strong>
              </p>
              <p className="text-primary font-semibold text-xl">
                Ready (almost) to ship!
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 space-y-4">
          <Button 
            size="lg" 
            className="text-lg px-8 py-6"
            onClick={() => setLocation('/demo-guide')}
            data-testid="button-next"
          >
            See How It Works
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <div>
            <Button 
              variant="ghost"
              onClick={() => setLocation('/home')}
              data-testid="button-skip"
            >
              <SkipForward className="w-4 h-4 mr-2" />
              Skip to Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
