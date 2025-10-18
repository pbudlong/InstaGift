import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Copy, Home } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { useToast } from '@/hooks/use-toast';

interface PaymentSuccessProps {
  giftId: string;
  giftUrl: string;
  onHome: () => void;
}

export default function PaymentSuccess({ giftId, giftUrl, onHome }: PaymentSuccessProps) {
  const { toast } = useToast();

  useEffect(() => {
    // Trigger confetti on mount
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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full">
        <CardContent className="p-12 text-center space-y-8">
          <div className="flex justify-center">
            <CheckCircle2 className="w-20 h-20 text-green-500" />
          </div>
          
          <div>
            <h1 className="text-4xl font-bold mb-3 font-display" data-testid="text-success-title">
              Gift Created! 🎉
            </h1>
            <p className="text-lg text-muted-foreground">
              Your personalized gift card has been created and is ready to share
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-8 space-y-4">
            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-lg">
                <QRCodeSVG 
                  value={giftUrl} 
                  size={200}
                  level="H"
                  data-testid="qr-code"
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Scan with phone camera to open gift
            </p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Shareable Link</Label>
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

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
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
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

function Input({ value, readOnly, className, 'data-testid': testId }: any) {
  return (
    <input 
      type="text" 
      value={value} 
      readOnly={readOnly} 
      className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors ${className}`}
      data-testid={testId}
    />
  );
}
