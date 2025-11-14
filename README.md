# 🎨 Maire Atelier - Frontend Storefront

Next.js 15 storefront with TypeScript and TailwindCSS for fashion eCommerce brand.

---

## 📋 Technologies

- **Next.js 15** - React Framework (App Router)
- **React 19** - UI Library
- **TypeScript** - Type Safety
- **TailwindCSS 4** - Styling
- **TanStack Query (React Query)** - Data Fetching & Caching
- **next-intl** - Internationalization (BG/EN)
- **Axios** - HTTP Client
- **Lucide React** - Icons
- **Docker** - Containerization (Node 20 Alpine)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ (or Docker)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Configure API URL
echo "NEXT_PUBLIC_API_URL=http://localhost/api" > .env.local

# Start development server
npm run dev
```

**Frontend**: http://localhost:3000

### With Docker

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (shop)/             # Shop routes group
│   │   │   ├── page.tsx        # Homepage
│   │   │   ├── products/       # Products pages
│   │   │   ├── categories/     # Categories pages
│   │   │   ├── collections/    # Collections pages
│   │   │   ├── cart/           # Shopping cart
│   │   │   ├── checkout/       # Checkout flow
│   │   │   ├── account/        # User account
│   │   │   ├── login/          # Authentication
│   │   │   └── ...
│   │   ├── api/                # API routes (proxy)
│   │   └── layout.tsx          # Root layout
│   ├── components/             # React components
│   │   ├── auth/               # Authentication components
│   │   ├── checkout/           # Checkout components
│   │   ├── home/               # Homepage components
│   │   ├── layout/             # Layout components
│   │   │   ├── header/         # Header & navigation
│   │   │   └── footer/         # Footer
│   │   ├── products/           # Product components
│   │   ├── shop/               # Shop components
│   │   └── ui/                 # UI components
│   ├── context/                # React context
│   ├── hooks/                  # Custom React hooks
│   │   ├── useCart.ts          # Cart management
│   │   ├── useProducts.ts      # Products fetching
│   │   ├── useOrders.ts        # Orders management
│   │   └── useWishlist.ts      # Wishlist management
│   ├── lib/                    # Utilities & helpers
│   │   ├── api/                # API client functions
│   │   │   ├── client.ts       # Axios instance
│   │   │   ├── products.ts     # Products API
│   │   │   ├── cart.ts         # Cart API
│   │   │   ├── categories.ts   # Categories API
│   │   │   ├── collections.ts # Collections API
│   │   │   ├── orders.ts       # Orders API
│   │   │   └── wishlist.ts     # Wishlist API
│   │   ├── auth.ts             # Authentication helpers
│   │   ├── cartToken.ts        # Cart token management
│   │   └── utils/              # Utility functions
│   ├── locales/                # Translation files
│   │   ├── bg.ts               # Bulgarian translations
│   │   └── en.ts               # English translations
│   ├── types/                  # TypeScript types
│   │   ├── index.ts            # Main types
│   │   ├── cart.ts             # Cart types
│   │   ├── collection.ts       # Collection types
│   │   ├── order.ts            # Order types
│   │   └── navigation.ts       # Navigation types
│   └── providers/              # React providers
│       └── QueryProvider.tsx   # React Query provider
├── messages/                   # next-intl messages
│   ├── bg.json                 # Bulgarian messages
│   └── en.json                 # English messages
├── public/                     # Static assets
└── next.config.ts              # Next.js configuration
```

---

## 🔧 Configuration

### Environment Variables

Create `.env.local` file:

```env
# API URL
NEXT_PUBLIC_API_URL=http://localhost/api

# (Production)
# NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

### Next.js Configuration

Configuration is located in `next.config.ts`:

- **Standalone output** for Docker optimization
- **Image domains** for image optimization
- **Remote patterns** for external images

---

## 🌐 Internationalization

The project supports **Bulgarian (BG)** and **English (EN)**.

### Adding New Translations

1. Add key to `messages/bg.json` and `messages/en.json`
2. Use in components:

```tsx
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('common');
  return <h1>{t('welcome')}</h1>;
}
```

### Switching Language

Use `LanguageSwitcher` component in the header.

---

## 📡 API Integration

### API Client

All API requests are made through `src/lib/api/client.ts` (Axios instance).

### Examples

```typescript
// Fetch products
import { getProducts } from '@/lib/api/products';
const products = await getProducts({ page: 1, perPage: 12 });

// Add to cart
import { addToCart } from '@/lib/api/cart';
await addToCart(productId, quantity, variantId);

// Get cart
import { getCart } from '@/lib/api/cart';
const cart = await getCart();
```

### Custom Hooks

```typescript
// Use cart hook
import { useCart } from '@/hooks/useCart';
const { cart, addItem, removeItem, isLoading } = useCart();

// Use products hook
import { useProducts } from '@/hooks/useProducts';
const { products, isLoading, error } = useProducts({ page: 1 });
```

---

## 🎨 Styling

### TailwindCSS

The project uses **TailwindCSS 4** for styling.

```tsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h1 className="text-2xl font-bold text-gray-900">Hello</h1>
</div>
```

### Utility Functions

```typescript
import { cn } from '@/lib/utils/cn';

// Conditional classes
<div className={cn("base-class", condition && "conditional-class")} />
```

---

## 🛠️ Useful Commands

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Linting
npm run lint
```

### Docker

```bash
# Build image
docker build -t maire-frontend .

# Run container
docker run -p 3000:3000 maire-frontend

# With docker-compose
docker-compose up -d
docker-compose logs -f
docker-compose down
```

---

## 📱 Pages and Routes

### Public Pages

- `/` - Homepage
- `/products` - All products
- `/products/[slug]` - Product details
- `/categories` - All categories
- `/categories/[slug]` - Category details
- `/collections` - All collections
- `/collections/[slug]` - Collection details
- `/cart` - Shopping cart
- `/checkout` - Checkout
- `/about` - About us
- `/contact` - Contact
- `/faq` - Frequently asked questions
- `/shipping` - Shipping
- `/returns` - Returns
- `/size-guide` - Size guide
- `/terms` - Terms

### Authentication

- `/login` - Login
- `/register` - Register
- `/forgot-password` - Forgot password
- `/reset-password` - Reset password

### User Account (auth required)

- `/account` - Profile
- `/account/orders` - My orders
- `/account/orders/[id]` - Order details
- `/account/settings` - Settings
- `/wishlist` - Wishlist

---

## 🧪 Testing

```bash
# (If configured)
npm run test

# E2E tests (if configured)
npm run test:e2e
```

---

## 🚀 Production Build

### Build

```bash
npm run build
```

This creates an optimized production build in the `.next` directory.

### Docker Production

```bash
# Build production image
docker build -t maire-frontend:latest .

# Run
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.yourdomain.com \
  maire-frontend:latest
```

### Deployment

#### Vercel (Recommended)

1. Connect GitHub repository
2. Configure environment variables
3. Deploy automatically

#### Netlify

1. Connect repository
2. Build command: `npm run build`
3. Publish directory: `.next`

#### Custom Server

```bash
npm run build
npm start
```

---

## 🐛 Troubleshooting

### API Connection Issues

```bash
# Check API URL
echo $NEXT_PUBLIC_API_URL

# Check network
curl http://localhost/api/health
```

### Build Issues

```bash
# Clear cache
rm -rf .next
npm run build
```

### Docker Issues

```bash
# Rebuild image
docker-compose build --no-cache
docker-compose up -d
```

### Translation Issues

- Check if `messages/bg.json` and `messages/en.json` are properly formatted
- Check if keys exist in both files

---

## 📚 Additional Documentation

- **[structureReadme.md](./structureReadme.md)** - Detailed project structure
- **[../readme.md](../readme.md)** - Main project documentation
- **[../DEPLOYMENT.md](../DEPLOYMENT.md)** - Deployment guide

---

## 🔐 Security

- **Environment variables** for sensitive data
- **API authentication** via Laravel Sanctum
- **CSRF protection** for forms
- **XSS protection** via React escaping
- **Secure cookies** for authentication tokens

---

## 🎯 Best Practices

1. **Use TypeScript** for type safety
2. **Use React Query** for data fetching
3. **Use Server Components** where possible
4. **Optimize images** with Next.js Image component
5. **Use TailwindCSS** for styling
6. **Follow Next.js App Router** patterns
7. **Test locally** before commit

---

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test locally
4. Create Pull Request

---

## 📄 License

MIT License

---

## 👥 Author

Maire Atelier Development Team
