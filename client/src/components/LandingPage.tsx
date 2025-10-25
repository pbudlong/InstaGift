import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Link as LinkIcon, Smartphone, Gift, CreditCard, Zap } from 'lucide-react';
import heroImage from '@assets/generated_images/Gift_card_in_wallet_hero_734c4c48.png';
import Logo from './Logo';

interface LandingPageProps {
  onCreateGift: () => void;
}

export default function LandingPage({ onCreateGift }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Logo in upper left */}
        <div className="absolute top-6 left-6 z-20">
          <Logo variant="light" />
        </div>
        
        {/* Background image with dark overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-medium text-white">Powered by Stripe & AI</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-display leading-tight">
            Turn Any Local Business<br />Into a Gift Card
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Real Stripe money delivered instantly to your recipient's mobile wallet
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-chart-3 hover:bg-chart-3/90 text-white border-0"
              onClick={onCreateGift}
              data-testid="button-create-gift"
            >
              <Gift className="w-5 h-5 mr-2" />
              Create Your First Gift
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-6 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span>Real Stripe Cards</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>60 Second Setup</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              <span>Instant Delivery</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-display">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create personalized gift cards in three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover-elevate transition-all">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <LinkIcon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">1. Paste Business URL</h3>
                <p className="text-muted-foreground">
                  Enter any local business website URL and let our AI analyze their branding
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-elevate transition-all">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">2. AI Creates Branded Card</h3>
                <p className="text-muted-foreground">
                  Beautiful gift card generated instantly with brand colors and personalization
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-elevate transition-all">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Smartphone className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">3. Instant Apple/Google Pay</h3>
                <p className="text-muted-foreground">
                  Real Stripe card delivered instantly to their mobile wallet
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary to-chart-2">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-display">
            Ready to Create Your First Gift?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join the future of personalized gifting. It takes less than 60 seconds.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 bg-white text-primary hover:bg-white/90"
            onClick={onCreateGift}
            data-testid="button-cta-create"
          >
            <Gift className="w-5 h-5 mr-2" />
            Get Started Now
          </Button>
        </div>
      </section>
    </div>
  );
}
