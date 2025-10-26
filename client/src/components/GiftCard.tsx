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
      
      <div className="relative h-full p-6 md:p-8 flex flex-col justify-between text-white">
        {/* Top section */}
        <div className="flex items-start justify-between">
          <div className="text-8xl md:text-9xl" data-testid="gift-emoji">{emoji}</div>
          {recipientName && (
            <div className="text-right">
              <div className="text-base md:text-lg opacity-90">Gift Card for</div>
              <div className="text-lg md:text-xl font-semibold uppercase" data-testid="text-recipient-name">{recipientName}</div>
            </div>
          )}
        </div>
        
        {/* Middle section - Business name */}
        <div className="max-w-[85%]">
          <h3 className="text-4xl md:text-6xl font-bold font-display" data-testid="text-business-name">
            {businessName}
          </h3>
          {vibe && (
            <p className="text-base md:text-xl mt-2 opacity-90 font-light italic line-clamp-2" data-testid="text-vibe">
              {vibe}
            </p>
          )}
        </div>
        
        {/* Bottom section */}
        <div className="flex items-end justify-between">
          {message && (
            <div className="flex-1 mr-4 flex items-end">
              <p className="text-2xl md:text-3xl font-script italic opacity-95 line-clamp-3" data-testid="text-message">
                "{message}"
              </p>
            </div>
          )}
          <div className="text-right flex items-end">
            <div className="text-6xl md:text-8xl font-bold" data-testid="text-amount">
              ${amount}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
