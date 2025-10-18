import { Gift } from 'lucide-react';
import { Link } from 'wouter';

interface LogoProps {
  variant?: 'light' | 'dark';
}

export default function Logo({ variant = 'dark' }: LogoProps) {
  const textColor = variant === 'light' ? 'text-white' : 'text-foreground';
  
  return (
    <Link href="/" className="flex items-center gap-2 hover-elevate rounded-lg px-3 py-2 transition-all cursor-pointer" data-testid="link-logo">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
        <Gift className="w-5 h-5 text-white" />
      </div>
      <span className={`text-xl font-bold font-display ${textColor}`}>
        InstaGift
      </span>
    </Link>
  );
}
