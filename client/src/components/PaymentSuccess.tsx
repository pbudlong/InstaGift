import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Copy, Home, MessageSquare, Eye, Share2, Send, Loader2, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import type { Gift } from '@shared/schema';
import GiftView from './GiftView';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PaymentSuccessProps {
  giftId: string;
  giftUrl: string;
  recipientPhone?: string;
  onHome: () => void;
}

export default function PaymentSuccess({ giftId, giftUrl, recipientPhone, onHome }: PaymentSuccessProps) {
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState(recipientPhone || '');
  const [isSending, setIsSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const { data: gift } = useQuery<Gift>({
    queryKey: ['/api/gifts', giftId],
    enabled: showPreview,
  });

  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#a855f7', '#ec4899', '#3b82f6']
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#a855f7', '#ec4899', '#3b82f6']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(giftUrl);
    toast({
      title: "Link copied!",
      description: "Gift link has been copied to clipboard",
    });
  };

  const handleSendSMS = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber) {
      toast({
        title: "Phone number required",
        description: "Please enter a phone number to send the gift",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    
    try {
      const response = await fetch('/api/send-gift-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phoneNumber,
          giftId,
          giftUrl 
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send SMS');
      }

      toast({
        title: "Gift sent! 🎉",
        description: `Your gift has been sent to ${phoneNumber}`,
      });
      
      setPhoneNumber('');
    } catch (error) {
      console.error('SMS error:', error);
      toast({
        title: "Failed to send",
        description: "There was an error sending the SMS. Please try sharing the link instead.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full">
        <CardContent className="p-8 md:p-12 space-y-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="w-20 h-20 text-green-500" />
            </div>
            
            <div>
              <h1 className="text-4xl font-bold mb-3 font-display" data-testid="text-success-title">
                Gift Created! 🎉
              </h1>
              <p className="text-lg text-muted-foreground">
                Your personalized gift card is ready to send
              </p>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowPreview(true)}
                data-testid="button-preview-gift"
              >
                <Eye className="w-4 h-4 mr-2" />
                Quick Preview
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.open(`/gift/${giftId}`, '_blank')}
                data-testid="button-open-recipient-view"
              >
                Open Recipient View
              </Button>
            </div>
          </div>

          <Tabs defaultValue="sms" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sms" data-testid="tab-sms">
                <MessageSquare className="w-4 h-4 mr-2" />
                Send via Text
              </TabsTrigger>
              <TabsTrigger value="link" data-testid="tab-link">
                <Share2 className="w-4 h-4 mr-2" />
                Share Link
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sms" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Send Gift via Text Message</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    We'll send a beautiful message with the gift card link
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSendSMS} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Recipient's Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1-555-0123"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        data-testid="input-phone-number"
                      />
                      <p className="text-xs text-muted-foreground">
                        Include country code (e.g., +1 for US)
                      </p>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={isSending || !phoneNumber}
                      data-testid="button-send-sms"
                    >
                      {isSending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Gift via Text
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="link" className="space-y-4 pt-4">
              <div className="space-y-6">
                <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                  <div className="flex justify-center">
                    <div className="bg-white p-4 rounded-lg">
                      <QRCodeSVG 
                        value={giftUrl} 
                        size={180}
                        level="H"
                        data-testid="qr-code"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Scan with phone camera to open gift
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Shareable Link</Label>
                  <div className="flex gap-2">
                    <Input
                      value={giftUrl}
                      readOnly
                      className="font-mono text-sm"
                      data-testid="input-gift-url"
                    />
                    <Button 
                      variant="outline"
                      onClick={copyToClipboard}
                      data-testid="button-copy-link"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4 border-t">
            <Button 
              size="lg"
              onClick={onHome}
              data-testid="button-create-another"
            >
              Create Another Gift
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={onHome}
              data-testid="button-home"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gift Card Preview</DialogTitle>
          </DialogHeader>
          {gift && (
            <GiftView 
              gift={{
                id: gift.id,
                businessName: gift.businessName,
                amount: gift.amount,
                emoji: gift.emoji || '🎁',
                brandColors: gift.brandColors || ['#a855f7', '#ec4899'],
                message: gift.message || undefined,
                recipientName: gift.recipientName,
                cardNumber: gift.cardNumber || undefined,
                cardExpiry: gift.cardExpiry || undefined,
                cardCvv: gift.cardCvv || undefined,
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
