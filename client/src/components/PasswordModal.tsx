import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface PasswordModalProps {
  open: boolean;
  onSuccess: () => void;
  onClose?: () => void;
}

export default function PasswordModal({ open, onSuccess, onClose }: PasswordModalProps) {
  const [password, setPassword] = useState('');
  const [showEmailRequest, setShowEmailRequest] = useState(false);
  const [contactTab, setContactTab] = useState<'email' | 'phone'>('phone');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { checkPassword } = useAuth();

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length !== 4) {
      toast({
        title: "Invalid Password",
        description: "Password must be exactly 4 characters",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const isValid = await checkPassword(password);
      if (isValid) {
        onSuccess();
      } else {
        toast({
          title: "Incorrect Password",
          description: "Please try again or request access",
          variant: "destructive",
          duration: 5000,
        });
        setPassword('');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify password. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let payload;
      if (contactTab === 'email') {
        payload = { email: email.trim() };
      } else {
        // Auto-prepend +1 for US numbers if not already included
        let normalizedPhone = phone.trim().replace(/[\s\-\(\)]/g, ''); // Remove spaces, dashes, parens
        if (!normalizedPhone.startsWith('+')) {
          normalizedPhone = '+1' + normalizedPhone;
        }
        payload = { phone: normalizedPhone };
      }

      const response = await fetch('/api/request-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send request');
      }

      toast({
        title: "Request Submitted!",
        description: "Will send access details once you are approved",
        duration: 5000,
      });
      setEmail('');
      setPhone('');
      setShowEmailRequest(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Please try again or contact support";
      toast({
        title: "Request Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000, // Auto-dismiss after 4 seconds
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && onClose) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">Enter Password</DialogTitle>
          <DialogDescription>
            This demo is password protected. Enter your 4-character password to continue.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="text"
              maxLength={4}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="4 characters"
              autoFocus
              data-testid="input-password"
              className="text-center text-2xl tracking-widest"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            data-testid="button-submit-password"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Verifying...' : 'Continue'}
          </Button>
        </form>

        <div className="border-t pt-4">
          <button
            type="button"
            onClick={() => setShowEmailRequest(!showEmailRequest)}
            className="flex items-center justify-between w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            data-testid="button-toggle-email"
          >
            <span>Need a password?</span>
            {showEmailRequest ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {showEmailRequest && (
            <div className="mt-4">
              <Tabs value={contactTab} onValueChange={(v) => setContactTab(v as 'email' | 'phone')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="phone" data-testid="tab-phone">Phone Number</TabsTrigger>
                  <TabsTrigger value="email" data-testid="tab-email">Email</TabsTrigger>
                </TabsList>
                
                <TabsContent value="phone">
                  <form onSubmit={handleContactSubmit} className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm">Your Phone Number (US)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="555-123-4567"
                        required
                        data-testid="input-phone"
                      />
                    </div>
                    <Button
                      type="submit"
                      variant="outline"
                      className="w-full"
                      disabled={isSubmitting}
                      data-testid="button-request-access-phone"
                    >
                      {isSubmitting ? 'Submitting...' : 'Request Access'}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="email">
                  <form onSubmit={handleContactSubmit} className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm">Your Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com"
                        required
                        data-testid="input-email"
                      />
                    </div>
                    <Button
                      type="submit"
                      variant="outline"
                      className="w-full"
                      disabled={isSubmitting}
                      data-testid="button-request-access"
                    >
                      {isSubmitting ? 'Submitting...' : 'Request Access'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
