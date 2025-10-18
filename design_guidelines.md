# InstaGift Design Guidelines

## Design Approach

**Reference-Based Approach**: Drawing inspiration from premium gift and payment experiences (Stripe's checkout flows, Apple Pay's elegance, Airbnb's trust-building design) combined with the warmth and joy of gifting platforms. The design should feel trustworthy (handling real money), delightful (it's about giving), and effortless (60-second flow).

## Core Design Principles

1. **Premium Simplicity**: Clean, uncluttered interfaces that feel high-end and trustworthy
2. **Joyful Progression**: Each step should feel rewarding and build anticipation
3. **Mobile-First Excellence**: Gift redemption happens on phones - optimize for mobile viewing
4. **Instant Clarity**: Users should immediately understand what they're looking at and what to do next

## Color Palette

**Light Mode:**
- Primary: 250 70% 55% (Vibrant purple - trust, premium, gifting)
- Secondary: 280 65% 60% (Deep purple for depth)
- Accent: 340 75% 60% (Warm pink for celebration moments - use sparingly for CTAs and success states)
- Neutral Dark: 240 10% 15%
- Neutral Mid: 240 5% 50%
- Neutral Light: 240 10% 97%
- Success: 150 60% 50%
- Background: White

**Dark Mode:**
- Primary: 250 65% 60%
- Secondary: 280 60% 65%
- Accent: 340 70% 65%
- Neutral Dark: 240 8% 95%
- Neutral Mid: 240 5% 60%
- Neutral Light: 240 12% 12%
- Background: 240 15% 8%

## Typography

**Font Families:**
- Primary: 'Inter' (Google Fonts) - Clean, modern, excellent readability
- Display: 'Cal Sans' or 'Outfit' (Google Fonts) - For hero headlines and card titles
- Accent: 'Dancing Script' (Google Fonts) - For personal messages on gift cards

**Scale:**
- Hero Display: text-6xl md:text-7xl font-bold
- Page Headline: text-4xl md:text-5xl font-bold
- Section Heading: text-2xl md:text-3xl font-semibold
- Card Title: text-xl font-semibold
- Body: text-base leading-relaxed
- Small/Meta: text-sm
- Tiny/Labels: text-xs

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Component padding: p-6 md:p-8
- Section padding: py-16 md:py-24
- Card spacing: space-y-4 or space-y-6
- Container max-width: max-w-6xl

**Grid System:**
- Single column for forms and focused flows
- 2-column for gift card preview + customization (desktop)
- Stack to single column on mobile

## Component Library

### Landing Page
- **Hero Section** (80vh minimum):
  - Large hero image showing a beautifully designed gift card on a phone screen with wallet app visible
  - Centered headline: "Turn Any Local Business Into a Gift Card in 60 Seconds"
  - Subheadline explaining the magic (AI + Stripe + Instant Delivery)
  - Large primary CTA button: "Create Your First Gift"
  - Trust indicators below CTA: "Powered by Stripe • Real Cards • Instant Delivery"
  
- **How It Works** (3-column on desktop):
  - Step 1: Icon (link emoji) + "Paste Business URL"
  - Step 2: Icon (sparkles) + "AI Creates Branded Card"
  - Step 3: Icon (phone/wallet) + "Instant Apple/Google Pay"
  - Each step in rounded card with subtle shadow

- **Demo Preview Section**:
  - Split layout: GIF/video demo on left, bullet points on right
  - Shows the car wash example flow
  - Emphasizes speed and personalization

### Gift Creation Flow

- **URL Input Screen**:
  - Clean, centered layout with generous whitespace
  - Large input field with placeholder: "https://sparkleautospa.com"
  - "Analyze with AI" button (accent color, slightly pulsing animation while thinking)
  - Loading state: Animated sparkles + "Reading the business vibe..."

- **Gift Card Customization**:
  - Split view: Live preview (60% width) + Controls (40% width)
  - Live preview shows card updating in real-time as they customize
  - Card design: Rounded-xl, gradient background (AI-generated colors), business name prominent, amount display, personal message in script font
  - Controls: Clean form with amount selector (pill buttons for presets), text inputs with floating labels
  - Sticky "Purchase & Send" CTA at bottom

### Gift Card Component

**Visual Treatment:**
- Aspect ratio: 1.6:1 (credit card proportions)
- Border radius: 2xl (very rounded corners)
- Background: Gradient generated from business brand colors (diagonal or radial)
- Shadow: Large, soft shadow for depth (shadow-2xl)
- Overlay pattern: Subtle dots or lines for texture
- Business icon/emoji: Large, top-left
- Amount: Very large, bold, center-right
- Personal message: Bottom, in script font, white/light color
- Recipient name: Top-right, elegant placement

**Micro-interactions:**
- Gentle scale on hover (scale-105 transition)
- Shimmer effect when first generated (success moment)

### Payment Success Screen

- Centered celebration layout
- Animated confetti (particles falling)
- Large checkmark icon (success color)
- "Gift Created! 🎉" headline
- QR code (large, high contrast, rounded corners)
- Shareable link in copy-able input field
- "Send Link" and "Create Another" CTAs

### Gift View Page (Recipient)

- **Hero Section**:
  - Full-width gift card display (larger than creation flow)
  - "A Gift For You!" headline above card
  - Personal message prominently displayed below card
  - From: [Sender Name] in elegant typography

- **Redemption Section**:
  - Device-detected CTA: "Add to Apple Pay" or "Add to Google Pay" (large, full-width button with wallet icon)
  - Success state after adding: Confetti animation + "Added to Wallet ✓" with green checkmark
  - Fallback details in expandable accordion: Card number (with copy button), Expiry, CVV

- **Trust Indicators**:
  - "Powered by Stripe" badge
  - Amount remaining indicator (if partially used)

## Images

**Hero Section Image:**
- Show a realistic mockup of the InstaGift gift card appearing in Apple Wallet on an iPhone
- Card should display a recognizable local business theme (car wash, bakery, coffee shop)
- Professional photography style with soft lighting
- Place as background with gradient overlay (dark gradient from bottom for text readability)

**Demo/Preview Section:**
- Animated GIF or video showing the 60-second flow
- Screen recording style showing URL paste → AI analysis → Card generation → Apple Pay add
- Alternatively: Static screenshot sequence (3-4 frames) showing key moments

**Gift View Page:**
- Optional background: Subtle confetti or celebration pattern (low opacity)
- Gift card itself is the star - no competing imagery

## Animations

**Use Sparingly:**
- Loading states: Gentle pulse on analyze button, spinning sparkles during AI analysis
- Success moments: Confetti particles (react-confetti library), scale-in effect for card reveal
- Wallet provisioning: Smooth slide-up animation mimicking actual Apple Pay add flow
- Hover states: Subtle scale (1.05) and shadow lift on cards
- Transitions: All state changes use 200-300ms ease-in-out

**Avoid:**
- Continuous animations on main content
- Parallax scrolling
- Heavy motion on page load

## Accessibility & Polish

- High contrast ratios (WCAG AA minimum)
- Focus states: Thick accent-colored ring (ring-2 ring-offset-2)
- Touch targets: Minimum 44px height on all buttons
- Loading states: Clear skeleton screens or spinners
- Error states: Red text with icons, inline validation
- Form inputs: Floating labels, clear error messages below fields
- Dark mode: Fully implemented across all screens with proper contrast

## Responsive Behavior

**Desktop (1024px+):**
- Split layouts for creation flow
- Generous spacing and margins
- Hover effects enabled

**Tablet (768px-1023px):**
- Stack layouts but maintain card preview visibility
- Reduce spacing slightly

**Mobile (< 768px):**
- Single column everything
- Full-width CTAs (sticky at bottom for forms)
- Larger tap targets
- Gift card scales to fit screen width with max-width constraint

## Technical Implementation Notes

- Use Tailwind's built-in color system for consistency
- Implement with CSS custom properties for easy theme switching
- Use transform and opacity for performance-optimized animations
- Ensure all interactive elements have proper focus and active states
- Test wallet provisioning flow on actual iOS/Android devices before demo