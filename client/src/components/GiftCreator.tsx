import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Loader2, ArrowLeft } from 'lucide-react';
import GiftCard from './GiftCard';
import Logo from './Logo';
import type { BusinessAnalysis } from '@shared/schema';

interface GiftCreatorProps {
  onBack: () => void;
  onCheckout: (giftData: any) => void;
}

export default function GiftCreator({ onBack, onCheckout }: GiftCreatorProps) {
  const [url, setUrl] = useState('https://sparkleautospa.com');
  const [analyzing, setAnalyzing] = useState(false);
  const [businessData, setBusinessData] = useState<BusinessAnalysis | null>(null);
  
  // Gift customization
  const [amount, setAmount] = useState<number | null>(75);
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('Happy Birthday! Get the X5 detailed before lunch 🚗');
  const [recipientName, setRecipientName] = useState('Jake Smith');
  const [recipientEmail, setRecipientEmail] = useState('jake@example.com');
  const [recipientPhone, setRecipientPhone] = useState('+1 (555) 123-4567');

  const presetAmounts = [50, 75, 100];

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze business');
      }
      
      const data = await response.json();
      setBusinessData(data);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze business. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handlePurchase = () => {
    const finalAmount = amount || parseInt(customAmount);
    onCheckout({
      ...businessData,
      amount: finalAmount,
      message,
      recipientName,
      recipientEmail,
      recipientPhone
    });
  };

  const isReadyToPurchase = businessData && (amount || customAmount) && recipientName && recipientEmail;

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <Logo />
          <Button 
            variant="ghost" 
            onClick={onBack}
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analyze Business</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="url">Business Website URL</Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://sparkleautospa.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    data-testid="input-business-url"
                  />
                </div>
                <Button 
                  onClick={handleAnalyze}
                  disabled={!url || analyzing}
                  className="w-full"
                  data-testid="button-analyze"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Analyze with AI
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {businessData && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Gift Amount</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      {presetAmounts.map((preset) => (
                        <Button
                          key={preset}
                          variant={amount === preset ? 'default' : 'outline'}
                          onClick={() => {
                            setAmount(preset);
                            setCustomAmount('');
                          }}
                          data-testid={`button-amount-${preset}`}
                        >
                          ${preset}
                        </Button>
                      ))}
                    </div>
                    <div>
                      <Label htmlFor="custom-amount">Custom Amount</Label>
                      <Input
                        id="custom-amount"
                        type="number"
                        placeholder="75"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          setAmount(null);
                        }}
                        data-testid="input-custom-amount"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Personalization</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="message">Personal Message (Optional)</Label>
                      <Textarea
                        id="message"
                        placeholder="Happy Birthday! Get the X5 detailed before lunch 🚗"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                        data-testid="input-message"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recipient Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="recipient-name">Recipient Name</Label>
                      <Input
                        id="recipient-name"
                        placeholder="Jake Smith"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        data-testid="input-recipient-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="recipient-email">Email</Label>
                      <Input
                        id="recipient-email"
                        type="email"
                        placeholder="jake@example.com"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        data-testid="input-recipient-email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="recipient-phone">Phone Number</Label>
                      <Input
                        id="recipient-phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={recipientPhone}
                        onChange={(e) => setRecipientPhone(e.target.value)}
                        data-testid="input-recipient-phone"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Button
                  onClick={handlePurchase}
                  disabled={!isReadyToPurchase}
                  size="lg"
                  className="w-full"
                  data-testid="button-purchase"
                >
                  Purchase & Finish Setting Up Gift Card
                </Button>
              </>
            )}
          </div>

          {/* Right Column - Preview */}
          <div className="lg:sticky lg:top-6 h-fit">
            <Card>
              <CardHeader>
                <CardTitle>Gift Card Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {businessData ? (
                  <GiftCard
                    businessName={businessData.businessName}
                    amount={amount || parseInt(customAmount) || 0}
                    emoji={businessData.emoji}
                    brandColors={businessData.brandColors}
                    message={message}
                    recipientName={recipientName}
                  />
                ) : (
                  <div className="aspect-[1.6/1] rounded-2xl bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Analyze a business to see your gift card
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
