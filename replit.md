# InstaGift

## Overview

InstaGift is a web application that enables users to create personalized digital gift cards for any local business in seconds. The platform uses AI to analyze business websites and generate branded gift cards, processes real payments through Stripe, and delivers virtual cards that can be added to Apple Pay and Google Pay wallets. Built as a hackathon project combining Stripe's payment infrastructure with AI-powered business analysis.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React with TypeScript using Vite as the build tool and development server
- Single-page application (SPA) with client-side routing via Wouter
- Mobile-first responsive design optimized for gift redemption on smartphones

**UI Component System**
- Radix UI primitives for accessible, unstyled components
- shadcn/ui component library with custom theming (New York style)
- Tailwind CSS for utility-first styling with custom design tokens
- Component aliases configured for clean imports (@/components, @/lib, @/hooks)

**Design System**
- Premium, minimalist aesthetic inspired by Stripe, Apple Pay, and Airbnb
- Custom color palette with vibrant purple primary (#a855f7), deep purple secondary, and warm pink accents
- Support for light and dark modes with HSL-based color tokens
- Typography using Inter (primary), Outfit (display), and Dancing Script (accent) from Google Fonts
- Mobile-first breakpoints with careful attention to touch targets and viewport optimization

**State Management**
- TanStack Query (React Query) for server state management and caching
- Local component state with React hooks for UI interactions
- Custom toast notifications for user feedback

**Authentication System**
- Password-protected access for public viewing
- Default 4-character password: "iGft" (for initial demo access)
- Admin approval system with unique password generation per user
- localStorage-based session with 24-hour inactivity expiration
- Session timestamp updates on user interactions (click, keypress, scroll)
- Access request flow: users submit email → admin approves → unique password sent
- Database-backed password validation (checks both default and approved passwords)

**Routing & Navigation**
- `/` - Landing page: Centered logo, click-anywhere to trigger password modal
- `/intro` - Intro page: Problem/solution landing with "See How It Works" CTA (protected)
- `/home` - Home page: Main gift creation CTA and hero section (protected)
- `/create` - Gift creator flow (protected)
- `/gift/:id` - Gift redemption view for recipients (public)
- `/tech` - Technical implementation overview (public)
- `/requests` - Admin page for approving access requests and viewing unique passwords (public)

**Key User Flows**
1. **Public Access Flow**:
   - Landing (/) → Password Modal → Intro → Home → Gift Creation → Payment Success → Tech Stack
2. **Hackathon Presentation Flow** (for judges):
   - Enter password "demo" once → Access valid for 24 hours → Full demo experience
3. **Gift Creation Flow**:
   - Home page with hero section and CTA
   - Gift creation: URL input → AI analysis → customization → checkout
   - Payment processing via Stripe Elements (test card: 4242 4242 4242 4242)
4. **Payment Success Page**:
   - Preview gift card link (shows card design only)
   - SMS sending tab (simulated, no actual Twilio)
   - Link sharing tab with QR code
   - "View Full Recipient Experience" CTA appears after SMS/link actions
   - "View Tech Stack" button links to `/tech` page
5. **Gift Redemption View** (recipient experience):
   - Branded gift card display
   - Real Stripe Issuing card details (PAN, expiry, CVV)
   - "Add to Apple Pay/Google Pay" button (simulated provisioning with confetti)

### Backend Architecture

**Server Framework**
- Express.js running on Node.js with TypeScript
- Custom Vite middleware integration for development HMR
- ESM module system throughout the codebase

**API Design**
- RESTful endpoints under `/api` prefix
- JSON request/response format
- Request logging middleware with duration tracking
- Error handling middleware with standardized error responses

**Core API Endpoints**
- `POST /api/analyze-business` - AI-powered business analysis from URL
- `POST /api/create-payment-intent` - Stripe payment initialization
- `POST /api/create-gift` - Gift card creation with Stripe Issuing virtual card
- `GET /api/gifts/:id` - Gift card retrieval
- `POST /api/send-gift-sms` - Simulated SMS sending (demo mode, logs only)
- `POST /api/request-access` - Submit access request (saves to DB, sends admin notification)
- `GET /api/access-requests` - List all access requests (for admin page)
- `POST /api/approve-access` - Approve request, generate unique password, send email
- `POST /api/check-password` - Validate password (checks default "iGft" + approved passwords)

**Data Storage**
- PostgreSQL database via Neon serverless driver
- Drizzle ORM for type-safe database queries
- Schema validation with Zod
- UUID-based identifiers for users, gifts, and access requests
- Tables: users, gifts, access_requests
- Access requests track: email, approved status, unique password, creation timestamp

**Business Logic**
- AI business analysis generates: business name, type, brand colors, emoji, vibe, and description
- Gift card generation with customizable amounts and personalized messages
- **Real Stripe Issuing integration**: Creates actual virtual cards with PAN, expiry, CVV
  - Creates cardholder for recipient (name, email, phone)
  - Issues virtual card with spending limit matching gift amount
  - Retrieves full card details via Stripe API (expand parameter)
  - **Note**: Demo implementation stores card details in memory (not production-safe per PCI DSS)

### External Dependencies

**Payment Processing & Issuing**
- Stripe API for payment intents and checkout flows
- Stripe Elements (React) for secure payment form rendering
- Stripe.js for client-side tokenization
- **Stripe Issuing API** for real virtual card creation:
  - Creates cardholders via `/v1/issuing/cardholders`
  - Issues virtual cards via `/v1/issuing/cards`
  - Retrieves card details with `expand: ['number', 'cvc']`
  - Spending limits configured per gift amount
- Environment variables: `STRIPE_SECRET_KEY` (server), `VITE_STRIPE_PUBLIC_KEY` (client)
- Test environment uses: `TESTING_STRIPE_SECRET_KEY`, `TESTING_VITE_STRIPE_PUBLIC_KEY`

**AI Services**
- Anthropic Claude API for intelligent business website analysis
- Environment variable: `ANTHROPIC_API_KEY`
- Structured JSON output parsing from AI responses for business metadata extraction

**Frontend Libraries**
- QR code generation (qrcode.react) for shareable gift links
- Canvas confetti for celebration animations on successful payments
- Form validation with React Hook Form and Zod resolvers

**Database (Active)**
- Drizzle ORM with PostgreSQL dialect configured
- Neon Database serverless driver for connection pooling
- Schema defined for users, gifts, and access_requests tables with proper typing
- Migration directory configured at `./migrations`
- Connection via `DATABASE_URL` environment variable
- Push schema changes via `npm run db:push`

**Gmail Integration (Active)**
- Google Gmail API for sending emails via pete@hundy.com
- OAuth2 authentication managed by Replit connectors
- Access request notifications sent to pete@hundy.com with link to /requests
- Approval emails sent to users with their unique 4-letter password
- Cute gift-related passwords: wrap, bows, card, joy!, love, give, gift, peek, cute, kiss, etc.

**Development Tools**
- Replit-specific plugins for runtime error overlay and dev banner
- TypeScript with strict mode enabled
- Path aliases for clean imports across client, server, and shared code

**Hosting & Deployment**
- Designed for Replit deployment
- Production build creates bundled server and optimized client assets
- Static file serving in production mode
- Environment-based configuration (NODE_ENV)

## Demo Configuration

**Hackathon Demo Scenario**
- Business: Sparkle Auto Spa (car wash)
- Gift amount: $75
- Recipient: Jake Smith
- Message: "Happy Birthday! Get the X5 detailed before lunch 🚗"
- All form placeholders pre-filled with demo values

**Demo Limitations (Hackathon MVP)**
- SMS sending is simulated (no Twilio integration, just logs and success messages)
- Wallet provisioning is simulated (confetti + success message, no actual Apple/Google Pay API)
- Card details stored in memory (not PCI-compliant for production; would require Stripe ephemeral keys)
- No authentication or user accounts (open demo)