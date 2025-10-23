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
  const [email, setEmail] = useState('');
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
        });
        setPassword('');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/request-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send request');
      }

      toast({
        title: "Request Submitted!",
        description: "We'll send you access details shortly",
      });
      setEmail('');
      setShowEmailRequest(false);
    } catch (error) {
      toast({
        title: "Request Failed",
        description: "Please try again or contact support",
        variant: "destructive",
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
            <form onSubmit={handleEmailSubmit} className="mt-4 space-y-3">
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
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
