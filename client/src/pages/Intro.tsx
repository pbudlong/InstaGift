import { Button } from '@/components/ui/button';
import { ArrowRight, SkipForward, Link, Sparkles, CreditCard, Smartphone, ArrowDown } from 'lucide-react';
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

          <div className="space-y-8 text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            <ul className="space-y-4 text-left">
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span>Generic Amazon cards feel impersonal</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span>Local businesses don't sell gift cards</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span>I spent hours manually creating one gift card for a friend</span>
              </li>
            </ul>
            
            <p className="text-foreground font-semibold">
              InstaGift makes this as easy as buying a Starbucks card - but for <span className="text-primary">ANY</span> local business.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 py-4">
              <div className="flex flex-col items-center gap-2 max-w-[140px]">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Link className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-center leading-tight">Paste a URL</p>
              </div>

              <ArrowRight className="w-6 h-6 text-primary shrink-0" />

              <div className="flex flex-col items-center gap-2 max-w-[140px]">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-center leading-tight">AI creates a beautiful branded card</p>
              </div>

              <ArrowRight className="w-6 h-6 text-primary shrink-0" />

              <div className="flex flex-col items-center gap-2 max-w-[140px]">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-center leading-tight">Real money loads via Stripe</p>
              </div>

              <ArrowRight className="w-6 h-6 text-primary shrink-0" />

              <div className="flex flex-col items-center gap-2 max-w-[140px]">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-center leading-tight">Goes straight to their phone's wallet</p>
              </div>
            </div>

            <div className="pt-6 text-base text-muted-foreground">
              <p>
                Built in 4 hours on <strong className="text-foreground">Replit</strong> • Powered by <strong className="text-foreground">Stripe Issuing</strong> and <strong className="text-foreground">OpenAI</strong> • <span className="text-primary font-semibold">Ready (almost) to ship!</span>
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
