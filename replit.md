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

**Key User Flows**
1. Landing page with hero section and CTA
2. Gift creation flow: URL input → AI analysis → customization → checkout
3. Payment processing via Stripe Elements
4. Gift redemption view with wallet integration options

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
- `POST /api/gifts` - Gift card creation
- `GET /api/gifts/:id` - Gift card retrieval

**Data Storage**
- In-memory storage using Map data structures (MemStorage class)
- Schema validation with Zod
- UUID-based identifiers for users and gifts
- Designed for rapid prototyping; database-ready architecture (Drizzle ORM schema defined)

**Business Logic**
- AI business analysis generates: business name, type, brand colors, emoji, vibe, and description
- Gift card generation with customizable amounts and personalized messages
- Stripe card issuance integration prepared (virtual card numbers, expiry, CVV)

### External Dependencies

**Payment Processing**
- Stripe API for payment intents and checkout flows
- Stripe Elements (React) for secure payment form rendering
- Stripe.js for client-side tokenization
- Environment variables: `STRIPE_SECRET_KEY` (server), `VITE_STRIPE_PUBLIC_KEY` (client)
- Architecture supports future Stripe Issuing integration for virtual card generation

**AI Services**
- Anthropic Claude API for intelligent business website analysis
- Environment variable: `ANTHROPIC_API_KEY`
- Structured JSON output parsing from AI responses for business metadata extraction

**Frontend Libraries**
- QR code generation (qrcode.react) for shareable gift links
- Canvas confetti for celebration animations on successful payments
- Form validation with React Hook Form and Zod resolvers

**Database (Prepared, Not Active)**
- Drizzle ORM with PostgreSQL dialect configured
- Neon Database serverless driver ready for integration
- Schema defined for users and gifts tables with proper typing
- Migration directory configured at `./migrations`
- Connection via `DATABASE_URL` environment variable (not currently required)

**Development Tools**
- Replit-specific plugins for runtime error overlay and dev banner
- TypeScript with strict mode enabled
- Path aliases for clean imports across client, server, and shared code

**Hosting & Deployment**
- Designed for Replit deployment
- Production build creates bundled server and optimized client assets
- Static file serving in production mode
- Environment-based configuration (NODE_ENV)