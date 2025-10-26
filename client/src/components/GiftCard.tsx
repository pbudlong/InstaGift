interface GiftCardProps {
  businessName: string;
  amount: number;
  emoji?: string;
  brandColors?: string[];
  vibe?: string;
  message?: string;
  recipientName?: string;
  size?: 'default' | 'large';
}

export default function GiftCard({ 
  businessName, 
  amount, 
  emoji = '🎁',
  brandColors = ['#6366f1', '#8b5cf6'],
  vibe,
  message,
  recipientName,
  size = 'default'
}: GiftCardProps) {
  const gradient = `linear-gradient(135deg, ${brandColors[0]} 0%, ${brandColors[1] || brandColors[0]} 100%)`;
  
  return (
    <div 
      className={`relative overflow-hidden rounded-2xl shadow-2xl ${
        size === 'large' ? 'aspect-[1.6/1] w-full max-w-2xl' : 'aspect-[1.6/1] w-full'
      }`}
      style={{ background: gradient }}
      data-testid="gift-card"
    >
      {/* Subtle pattern overlay - use semi-transparent black dots that work on any background */}
      <div className="absolute inset-0 opacity-[0.08]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0, 0, 0, 0.5) 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }} />
      </div>
      
      <div className="relative h-full p-3 sm:p-4 md:p-6 flex flex-col justify-between text-white">
        {/* Top section */}
        <div className="flex items-start justify-between gap-2">
          <div className="text-5xl sm:text-7xl md:text-8xl leading-none" data-testid="gift-emoji">{emoji}</div>
          {recipientName && (
            <div className="text-right">
              <div className="text-[10px] sm:text-xs md:text-sm opacity-90 leading-tight">Gift Card for</div>
              <div className="text-xs sm:text-sm md:text-base font-semibold uppercase leading-tight" data-testid="text-recipient-name">{recipientName}</div>
            </div>
          )}
        </div>
        
        {/* Middle section - Business name */}
        <div className="max-w-[85%]">
          <h3 className="text-2xl sm:text-3xl md:text-5xl font-bold font-display leading-tight" data-testid="text-business-name">
            {businessName}
          </h3>
          {vibe && (
            <p className="text-xs sm:text-sm md:text-lg mt-0.5 sm:mt-1 opacity-90 font-light italic line-clamp-2" data-testid="text-vibe">
              {vibe}
            </p>
          )}
        </div>
        
        {/* Bottom section */}
        <div className="flex items-end justify-between gap-2">
          {message && (
            <div className="flex-1 flex items-end mr-2">
              <p className="text-sm sm:text-base md:text-xl font-script italic opacity-95 line-clamp-2" data-testid="text-message">
                "{message}"
              </p>
            </div>
          )}
          <div className="text-right flex items-end shrink-0">
            <div className="text-3xl sm:text-5xl md:text-7xl font-bold leading-none" data-testid="text-amount">
              ${amount}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
