import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, CheckCircle2, AlertCircle } from 'lucide-react';
import { useLocation } from 'wouter';
import Logo from '@/components/Logo';

export default function Tech() {
  const [, setLocation] = useLocation();

  const realFeatures = [
    "Stripe Payment Processing - Real payment intents and checkout flow",
    "OpenAI GPT-4o-mini - Live AI business analysis from URLs",
    "Anthropic Claude (backup) - Fallback AI if OpenAI fails",
    "React + TypeScript - Type-safe frontend with hooks",
    "Express + Node.js - RESTful API backend",
    "Replit Deployment - One-click hosting and environment management"
  ];

  const simulatedFeatures = [
    {
      feature: "Stripe Issuing Virtual Cards",
      reason: "Requires account approval (not instant). Demo shows realistic BIN 4571 cards with proper formatting"
    },
    {
      feature: "SMS Delivery (Twilio)",
      reason: "Not integrated for hackathon timeline. Logs to console with success message"
    },
    {
      feature: "Apple Pay / Google Pay Provisioning",
      reason: "Requires production app + certificates. Shows realistic wallet card UI with confetti"
    },
    {
      feature: "Database Persistence",
      reason: "In-memory storage for hackathon demo. Production would use PostgreSQL + Drizzle ORM"
    }
  ];

  const techStack = [
    { category: "Frontend", tech: "React, TypeScript, Vite, TailwindCSS, shadcn/ui, Wouter routing" },
    { category: "Backend", tech: "Express.js, Node.js, Zod validation" },
    { category: "AI", tech: "OpenAI GPT-4o-mini, Anthropic Claude Sonnet" },
    { category: "Payments", tech: "Stripe Payment Intents, Stripe Elements" },
    { category: "Hosting", tech: "Replit (deployment, secrets, environment)" },
    { category: "Future", tech: "Stripe Issuing, Twilio SMS, Neon PostgreSQL, Apple/Google Pay APIs" }
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="flex items-center justify-between">
          <Logo />
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/')}
            data-testid="button-home"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold font-display">
            Technical Implementation
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built in 4 hours on Replit for the Stripe + Replit Hackathon
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                What's Real & Working
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {realFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                What's Simulated (& Why)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {simulatedFeatures.map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                      <div className="space-y-1">
                        <p className="font-medium">{item.feature}</p>
                        <p className="text-sm text-muted-foreground">{item.reason}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Complete Tech Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {techStack.map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="text-sm font-semibold text-primary">{item.category}</div>
                    <div className="text-sm text-muted-foreground">{item.tech}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6 space-y-3">
              <h3 className="font-semibold text-lg">Production Roadmap</h3>
              <p className="text-sm text-muted-foreground">
                To make this production-ready, we'd need:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Complete Stripe Issuing onboarding for real virtual cards</li>
                <li>• Integrate Twilio for actual SMS delivery</li>
                <li>• Implement Apple/Google Pay SDK for true wallet provisioning</li>
                <li>• Add PostgreSQL database for gift card persistence</li>
                <li>• Build user authentication for gift card management</li>
                <li>• Add webhook handling for payment and card events</li>
                <li>• Implement proper PCI compliance for card data storage</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
