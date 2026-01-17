# BELItangPEDIA

Marketplace lokal untuk masyarakat Belitang dan sekitarnya.

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Features

- 🛒 **Multi-Vendor Marketplace** - Multiple sellers can list and sell products
- 🚚 **Local Delivery** - Same-day and instant delivery for local area
- 💵 **COD Payment** - Cash on Delivery payment option
- 🏪 **Store Pages** - Dedicated pages for each seller
- ⚡ **Flash Sales** - Time-limited discount events
- 🔍 **Search & Filter** - Find products by category, price, location
- 📱 **Mobile Responsive** - Works great on all devices

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: CSS Modules with CSS Variables
- **State Management**: Zustand
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout process
│   ├── products/          # Product pages
│   └── seller/            # Seller dashboard
├── components/            
│   ├── layout/            # Header, Footer, MobileNav
│   └── ui/                # Reusable UI components
├── lib/                   # Utilities and helpers
├── store/                 # Zustand stores
├── styles/                # Global CSS
└── types/                 # TypeScript types
```

## License

MIT
