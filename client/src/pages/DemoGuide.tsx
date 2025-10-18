import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, ArrowLeft, Sparkles, CreditCard, Smartphone, Gift } from 'lucide-react';
import { useLocation } from 'wouter';
import Logo from '@/components/Logo';

export default function DemoGuide() {
  const [, setLocation] = useLocation();

  const steps = [
    {
      icon: Sparkles,
      title: "AI Business Analysis",
      description: "Paste any local business URL and watch AI extract branding, colors, and vibe in seconds"
    },
    {
      icon: Gift,
      title: "Customize Gift Card",
      description: "Choose amount, add personal message, enter recipient details"
    },
    {
      icon: CreditCard,
      title: "Real Payment Processing",
      description: "Stripe handles secure payment - test card works instantly"
    },
    {
      icon: Smartphone,
      title: "Digital Wallet Delivery",
      description: "Gift appears in recipient's Apple/Google Pay with confetti celebration"
    }
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/intro')}
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Logo />
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold font-display">
            Demo Walkthrough
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            This demo is prefilled with a complete scenario for fast presentation
          </p>
        </div>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6 space-y-3">
            <h3 className="font-semibold text-lg">Pre-filled Demo Scenario</h3>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Business:</span>{' '}
                <span className="font-medium">Sparkle Auto Spa</span>
              </div>
              <div>
                <span className="text-muted-foreground">Amount:</span>{' '}
                <span className="font-medium">$75</span>
              </div>
              <div>
                <span className="text-muted-foreground">Recipient:</span>{' '}
                <span className="font-medium">Jake Smith</span>
              </div>
              <div>
                <span className="text-muted-foreground">Message:</span>{' '}
                <span className="font-medium">"Happy Birthday! Get the X5 detailed before lunch 🚗"</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground pt-2">
              All fields are editable - feel free to customize or use as-is for fastest demo
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {steps.map((step, index) => (
            <Card key={index}>
              <CardContent className="p-6 space-y-3">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-primary">Step {index + 1}</span>
                    </div>
                    <h3 className="font-semibold text-lg">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center pt-8">
          <Button 
            size="lg" 
            className="text-lg px-8 py-6"
            onClick={() => setLocation('/')}
            data-testid="button-start-demo"
          >
            Start Demo
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
