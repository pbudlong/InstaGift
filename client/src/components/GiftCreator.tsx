import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Loader2, ArrowLeft, Maximize2, X } from 'lucide-react';
import GiftCard from './GiftCard';
import Logo from './Logo';
import type { BusinessAnalysis } from '@shared/schema';

interface GiftCreatorProps {
  onBack: () => void;
  onCheckout: (giftData: any) => void;
}

export default function GiftCreator({ onBack, onCheckout }: GiftCreatorProps) {
  const [url, setUrl] = useState('https://towercarwash.com');
  const [analyzing, setAnalyzing] = useState(false);
  const [businessData, setBusinessData] = useState<BusinessAnalysis | null>(null);
  const [fullscreenPreview, setFullscreenPreview] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Gift customization
  const [amount, setAmount] = useState<number | null>(75);
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('Happy Birthday! Get the X5 detailed before lunch 🚗');
  const [recipientName, setRecipientName] = useState('Jake Smith');
  const [recipientEmail, setRecipientEmail] = useState('jake@example.com');
  const [recipientPhone, setRecipientPhone] = useState('+1 (555) 123-4567');

  const presetAmounts = [50, 75, 100];

  // Cleanup progress interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setProgress(0);
    
    // Animate progress bar over 10 seconds
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          return 95;
        }
        return prev + 5;
      });
    }, 500);
    
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
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setProgress(100);
      setTimeout(() => setBusinessData(data), 300);
    } catch (error) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      console.error('Analysis error:', error);
      alert('Failed to analyze business. Please try again.');
    } finally {
      setTimeout(() => {
        setAnalyzing(false);
        setProgress(0);
      }, 300);
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
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
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
          <div className="bg-muted/50 rounded-lg p-3 border-l-4 border-primary">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Demo Note:</strong> All fields are prefilled for demo purposes but can be changed to create your own gift card
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate Gift Card</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="url">Business Website URL</Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://towercarwash.com"
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
                      Create Gift Card with AI
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Mobile Preview - shows right after analyze button */}
            <div className="lg:hidden">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Gift Card Preview</CardTitle>
                    {businessData && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setFullscreenPreview(true)}
                        data-testid="button-expand-preview"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {analyzing ? (
                    <div className="aspect-[1.6/1] rounded-2xl bg-muted flex flex-col items-center justify-center p-6 space-y-4">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      <div className="w-full max-w-xs space-y-2">
                        <p className="text-sm text-center text-muted-foreground">
                          Analyzing business...
                        </p>
                        <Progress value={progress} className="w-full" />
                      </div>
                    </div>
                  ) : businessData ? (
                    <GiftCard
                      businessName={businessData.businessName}
                      amount={amount || parseInt(customAmount) || 0}
                      emoji={businessData.emoji}
                      brandColors={businessData.brandColors}
                      vibe={businessData.vibe}
                      message={message}
                      recipientName={recipientName}
                    />
                  ) : (
                    <div className="aspect-[1.6/1] rounded-2xl bg-muted flex items-center justify-center px-4">
                      <p className="text-sm text-center text-muted-foreground">
                        Gift card generated after scanning business website
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

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

          {/* Right Column - Preview (Desktop only) */}
          <div className="hidden lg:block lg:sticky lg:top-6 h-fit">
            <Card>
              <CardHeader>
                <CardTitle>Gift Card Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {analyzing ? (
                  <div className="aspect-[1.6/1] rounded-2xl bg-muted flex flex-col items-center justify-center p-6 space-y-4">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <div className="w-full max-w-xs space-y-2">
                      <p className="text-sm text-center text-muted-foreground">
                        Analyzing business...
                      </p>
                      <Progress value={progress} className="w-full" />
                    </div>
                  </div>
                ) : businessData ? (
                  <GiftCard
                    businessName={businessData.businessName}
                    amount={amount || parseInt(customAmount) || 0}
                    emoji={businessData.emoji}
                    brandColors={businessData.brandColors}
                    vibe={businessData.vibe}
                    message={message}
                    recipientName={recipientName}
                  />
                ) : (
                  <div className="aspect-[1.6/1] rounded-2xl bg-muted flex items-center justify-center px-4">
                    <p className="text-center text-muted-foreground">
                      Gift card generated after scanning business website
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Fullscreen Preview Modal (Mobile only) */}
      {fullscreenPreview && businessData && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-4 lg:hidden">
          <div className="w-full flex justify-between items-center mb-4">
            <div className="text-sm text-muted-foreground">
              Rotate your device to landscape for best viewing
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setFullscreenPreview(false)}
              data-testid="button-close-preview"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="w-full max-w-4xl">
            <GiftCard
              businessName={businessData.businessName}
              amount={amount || parseInt(customAmount) || 0}
              emoji={businessData.emoji}
              brandColors={businessData.brandColors}
              vibe={businessData.vibe}
              message={message}
              recipientName={recipientName}
              size="large"
            />
          </div>
        </div>
      )}
    </div>
  );
}
