import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import GiftView from '@/components/GiftView';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import type { Gift } from '@shared/schema';

export default function Gift() {
  const params = useParams();
  const giftId = params.id;

  const { data: gift, isLoading, error } = useQuery<Gift>({
    queryKey: ['/api/gifts', giftId],
    enabled: !!giftId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !gift) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Gift Not Found</h2>
            <p className="text-muted-foreground">
              This gift card doesn't exist or may have been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const giftViewData = {
    id: gift.id,
    businessName: gift.businessName,
    amount: gift.amount,
    emoji: gift.emoji || '🎁',
    brandColors: gift.brandColors || ['#a855f7', '#ec4899'],
    vibe: gift.vibe || undefined,
    message: gift.message || undefined,
    recipientName: gift.recipientName,
    cardNumber: gift.cardNumber || undefined,
    cardExpiry: gift.cardExpiry || undefined,
    cardCvv: gift.cardCvv || undefined,
  };

  return <GiftView gift={giftViewData} />;
}
