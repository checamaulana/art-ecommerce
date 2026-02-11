# Frontend Guidelines Document
## E-Commerce Lukisan / Art Gallery Online Catalog

**Version:** 1.1  
**Last Updated:** 2026-02-09  
**Architecture:** Laravel + Inertia.js + React + TypeScript

---

## 1. Design System

### 1.1 Color Palette

```css
/* resources/css/app.css - CSS Variables */
:root {
  /* Base - Clean Gallery Feel */
  --background: 0 0% 100%;           /* #FFFFFF - Pure white */
  --foreground: 0 0% 3.9%;           /* #0A0A0A - Near black */
  
  /* Muted */
  --muted: 0 0% 96.1%;               /* #F5F5F5 - Light gray */
  --muted-foreground: 0 0% 45.1%;    /* #737373 - Medium gray */
  
  /* Card */
  --card: 0 0% 100%;
  --card-foreground: 0 0% 3.9%;
  
  /* Border & Input */
  --border: 0 0% 89.8%;              /* #E5E5E5 */
  --input: 0 0% 89.8%;
  --ring: 0 0% 3.9%;
  
  /* Primary - Accent */
  --primary: 0 0% 9%;                /* Dark */
  --primary-foreground: 0 0% 98%;
  
  /* Secondary */
  --secondary: 0 0% 96.1%;
  --secondary-foreground: 0 0% 9%;
  
  /* Status Colors */
  --success: 142 76% 36%;            /* Green - Available */
  --destructive: 0 84% 60%;          /* Red - Sold */
  --warning: 38 92% 50%;             /* Orange */
  
  /* Radius */
  --radius: 0.5rem;
}
```

### 1.2 Typography

```css
/* Font Stack */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Import in app.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
```

**Font Sizes (Tailwind Classes):**
| Class | Size | Use Case |
|-------|------|----------|
| `text-xs` | 12px | Captions, labels |
| `text-sm` | 14px | Body small, buttons |
| `text-base` | 16px | Body text |
| `text-lg` | 18px | Body large |
| `text-xl` | 20px | Subheadings |
| `text-2xl` | 24px | Section titles |
| `text-3xl` | 30px | Page titles |
| `text-4xl` | 36px | Hero text |

### 1.3 Spacing

Use Tailwind's default spacing scale (4px increments):
- `p-4` = 16px
- `m-6` = 24px
- `gap-8` = 32px

---

## 2. Project Structure

```
resources/js/
├── app.tsx                      # Entry point
├── ssr.tsx                      # SSR entry
├── components/
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── select.tsx
│   │   ├── toast.tsx
│   │   └── ...
│   ├── common/                  # Shared components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ImageGallery.tsx
│   │   ├── WhatsAppButton.tsx
│   │   ├── PriceDisplay.tsx
│   │   ├── FilterPanel.tsx
│   │   ├── SortDropdown.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── Pagination.tsx
│   │   └── LanguageSwitch.tsx
│   └── admin/                   # Admin-specific components
│       ├── Sidebar.tsx
│       ├── Header.tsx
│       ├── StatsCard.tsx
│       └── ImageUpload.tsx
├── layouts/
│   ├── MainLayout.tsx           # Public layout
│   ├── AdminLayout.tsx          # Admin layout
│   └── GuestLayout.tsx          # Auth pages layout
├── pages/
│   ├── Home.tsx
│   ├── Catalog/
│   │   ├── Index.tsx
│   │   └── Show.tsx
│   ├── Auth/
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── Profile/
│   │   └── Edit.tsx
│   ├── Wishlist/
│   │   └── Index.tsx
│   ├── Admin/
│   │   ├── Dashboard.tsx
│   │   ├── Products/
│   │   │   ├── Index.tsx
│   │   │   ├── Create.tsx
│   │   │   └── Edit.tsx
│   │   ├── Categories/
│   │   │   └── Index.tsx
│   │   └── Users/
│   │       └── Index.tsx
│   └── Static/
│       ├── Contact.tsx
│       ├── Faq.tsx
│       ├── Terms.tsx
│       └── Privacy.tsx
├── hooks/
│   ├── use-locale.ts
│   ├── use-wishlist.ts
│   └── use-toast.ts
├── lib/
│   ├── utils.ts                 # cn() helper
│   └── i18n.ts                  # i18n config
├── types/
│   └── index.d.ts               # TypeScript types
└── locales/
    ├── id.json
    └── en.json
```

---

## 3. Inertia.js Integration

### 3.1 Entry Point (app.tsx)

```tsx
import './bootstrap';
import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

createInertiaApp({
  title: (title) => `${title} - Art Gallery`,
  resolve: (name) =>
    resolvePageComponent(
      `./pages/${name}.tsx`,
      import.meta.glob('./pages/**/*.tsx')
    ),
  setup({ el, App, props }) {
    if (import.meta.env.SSR) {
      hydrateRoot(el, <App {...props} />);
    } else {
      createRoot(el).render(<App {...props} />);
    }
  },
  progress: {
    color: '#0a0a0a',
    showSpinner: true,
  },
});
```

### 3.2 TypeScript Types (types/index.d.ts)

```typescript
import { PageProps as InertiaPageProps } from '@inertiajs/core';

export interface User {
  id: number;
  name: string;
  email: string;
  whatsapp?: string;
  address?: string;
  role: 'user' | 'admin';
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  products_count?: number;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  description: string;
  product_type: 'original' | 'print' | 'digital';
  price: number;
  price_usd?: number;
  price_formatted: string;
  width: number;
  height: number;
  dimensions_formatted: string;
  medium: string;
  year_created: number;
  status: 'available' | 'sold';
  is_featured: boolean;
  category: Category;
  images: Image[];
  thumbnail: string;
  print_sizes?: PrintSize[];
}

export interface Image {
  id: number;
  url: string;
  is_primary: boolean;
}

export interface PrintSize {
  id: number;
  size_name: string;
  width: number;
  height: number;
  price: number;
  price_usd?: number;
  price_formatted: string;
  dimensions_formatted: string;
}

export interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
}

// Shared props from HandleInertiaRequests
export interface SharedProps {
  auth: {
    user: User | null;
  };
  locale: {
    current: 'id' | 'en';
    available: string[];
  };
  currency: 'IDR' | 'USD';
  flash: {
    success?: string;
    error?: string;
  };
  config: {
    whatsappNumber: string;
  };
}

declare module '@inertiajs/core' {
  interface PageProps extends SharedProps {}
}
```

---

## 4. Layouts

### 4.1 MainLayout.tsx

```tsx
import { PropsWithChildren } from 'react';
import { Head, usePage } from '@inertiajs/react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { Toaster } from '@/components/ui/sonner';

interface Props extends PropsWithChildren {
  title?: string;
}

export default function MainLayout({ title, children }: Props) {
  const { flash } = usePage().props;

  // Show toast on flash messages
  useEffect(() => {
    if (flash.success) {
      toast.success(flash.success);
    }
    if (flash.error) {
      toast.error(flash.error);
    }
  }, [flash]);

  return (
    <>
      {title && <Head title={title} />}
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1">
          {children}
        </main>
        
        <Footer />
      </div>
      
      <Toaster position="top-right" />
    </>
  );
}
```

### 4.2 AdminLayout.tsx

```tsx
import { PropsWithChildren } from 'react';
import { Head, usePage } from '@inertiajs/react';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import { Toaster } from '@/components/ui/sonner';

interface Props extends PropsWithChildren {
  title?: string;
}

export default function AdminLayout({ title, children }: Props) {
  return (
    <>
      {title && <Head title={`${title} - Admin`} />}
      
      <div className="min-h-screen flex">
        {/* Sidebar - Fixed */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 ml-64">
          <Header />
          
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
      
      <Toaster position="top-right" />
    </>
  );
}
```

---

## 5. Common Components

### 5.1 ProductCard.tsx

```tsx
import { Link } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: Props) {
  return (
    <Card className={cn('group overflow-hidden', className)}>
      <Link href={`/catalog/${product.slug}`}>
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="object-cover w-full h-full transition-transform group-hover:scale-105"
          />
          
          {/* Status Badge */}
          {product.status === 'sold' && (
            <Badge 
              variant="destructive" 
              className="absolute top-2 right-2"
            >
              SOLD
            </Badge>
          )}
          
          {/* Type Badge */}
          <Badge 
            variant="secondary" 
            className="absolute top-2 left-2 capitalize"
          >
            {product.product_type}
          </Badge>
        </div>

        {/* Content */}
        <CardContent className="p-4">
          <h3 className="font-medium truncate">{product.title}</h3>
          <p className="text-muted-foreground text-sm">
            {product.category.name}
          </p>
          <p className="font-semibold mt-2">
            {product.price_formatted}
          </p>
        </CardContent>
      </Link>
    </Card>
  );
}
```

### 5.2 WhatsAppButton.tsx

```tsx
import { usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import type { Product } from '@/types';

interface Props {
  product: Product;
  selectedSize?: string;
  className?: string;
}

export default function WhatsAppButton({ product, selectedSize, className }: Props) {
  const { config, locale } = usePage().props;
  
  const generateMessage = () => {
    const baseUrl = window.location.origin;
    const productUrl = `${baseUrl}/catalog/${product.slug}`;
    
    if (locale.current === 'id') {
      let message = `Halo, saya tertarik dengan lukisan "${product.title}"`;
      if (selectedSize) {
        message += ` (ukuran ${selectedSize})`;
      }
      message += `\n\nLink: ${productUrl}`;
      return message;
    } else {
      let message = `Hello, I'm interested in the painting "${product.title}"`;
      if (selectedSize) {
        message += ` (size ${selectedSize})`;
      }
      message += `\n\nLink: ${productUrl}`;
      return message;
    }
  };

  const handleClick = () => {
    const message = encodeURIComponent(generateMessage());
    const waUrl = `https://wa.me/${config.whatsappNumber}?text=${message}`;
    window.open(waUrl, '_blank');
  };

  return (
    <Button
      onClick={handleClick}
      className={cn('gap-2', className)}
      size="lg"
    >
      <MessageCircle className="w-5 h-5" />
      Chat via WhatsApp
    </Button>
  );
}
```

### 5.3 ImageGallery.tsx

```tsx
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Image } from '@/types';

interface Props {
  images: Image[];
}

export default function ImageGallery({ images }: Props) {
  const [selectedImage, setSelectedImage] = useState(
    images.find((img) => img.is_primary)?.url || images[0]?.url
  );

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square overflow-hidden rounded-lg bg-muted">
        <img
          src={selectedImage}
          alt="Product"
          className="object-contain w-full h-full"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(image.url)}
              className={cn(
                'w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors',
                selectedImage === image.url
                  ? 'border-primary'
                  : 'border-transparent hover:border-muted-foreground'
              )}
            >
              <img
                src={image.url}
                alt="Thumbnail"
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 5.4 FilterPanel.tsx

```tsx
import { router } from '@inertiajs/react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Category } from '@/types';

interface Props {
  categories: Category[];
  filters: {
    type?: string;
    category?: string;
    status?: string;
    price_min?: string;
    price_max?: string;
  };
}

export default function FilterPanel({ categories, filters }: Props) {
  const updateFilter = (key: string, value: string | null) => {
    router.get('/catalog', {
      ...filters,
      [key]: value || undefined,
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const clearFilters = () => {
    router.get('/catalog', {}, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Product Type */}
      <div className="space-y-2">
        <Label>Type</Label>
        <Select
          value={filters.type || 'all'}
          onValueChange={(v) => updateFilter('type', v === 'all' ? null : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="original">Original</SelectItem>
            <SelectItem value="print">Print</SelectItem>
            <SelectItem value="digital">Digital</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          value={filters.category || 'all'}
          onValueChange={(v) => updateFilter('category', v === 'all' ? null : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={String(cat.id)}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label>Status</Label>
        <Select
          value={filters.status || 'all'}
          onValueChange={(v) => updateFilter('status', v === 'all' ? null : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="sold">Sold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      <Button variant="outline" onClick={clearFilters} className="w-full">
        Clear Filters
      </Button>
    </div>
  );
}
```

---

## 6. Forms with Inertia

### 6.1 Using useForm Hook

```tsx
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginForm() {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/login', {
      onFinish: () => reset('password'),
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={data.email}
          onChange={(e) => setData('email', e.target.value)}
          required
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={data.password}
          onChange={(e) => setData('password', e.target.value)}
          required
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password}</p>
        )}
      </div>

      {/* Submit */}
      <Button type="submit" disabled={processing} className="w-full">
        {processing ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
}
```

### 6.2 File Upload Form

```tsx
import { useForm } from '@inertiajs/react';
import { FormEvent, useRef } from 'react';

export default function ProductForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { data, setData, post, processing, errors, progress } = useForm({
    title: '',
    description: '',
    category_id: '',
    product_type: 'original',
    price: '',
    width: '',
    height: '',
    medium: '',
    year_created: '',
    images: [] as File[],
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setData('images', Array.from(e.target.files));
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    post('/admin/products', {
      forceFormData: true, // Required for file uploads
    });
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* Other fields... */}

      {/* Image Upload */}
      <div className="space-y-2">
        <Label>Images</Label>
        <Input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />
        {progress && (
          <progress value={progress.percentage} max="100">
            {progress.percentage}%
          </progress>
        )}
        {errors.images && (
          <p className="text-sm text-destructive">{errors.images}</p>
        )}
      </div>

      <Button type="submit" disabled={processing}>
        {processing ? 'Saving...' : 'Save Product'}
      </Button>
    </form>
  );
}
```

---

## 7. Internationalization (i18n)

### 7.1 Setup (lib/i18n.ts)

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import idTranslations from '@/locales/id.json';
import enTranslations from '@/locales/en.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      id: { translation: idTranslations },
      en: { translation: enTranslations },
    },
    lng: 'id',
    fallbackLng: 'id',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
```

### 7.2 Translation Files

```json
// locales/id.json
{
  "nav": {
    "home": "Beranda",
    "catalog": "Katalog",
    "contact": "Kontak",
    "login": "Masuk",
    "register": "Daftar",
    "logout": "Keluar"
  },
  "product": {
    "available": "Tersedia",
    "sold": "Terjual",
    "addToWishlist": "Tambah ke Wishlist",
    "chatWhatsApp": "Chat via WhatsApp"
  },
  "filter": {
    "allTypes": "Semua Tipe",
    "allCategories": "Semua Kategori",
    "clearFilters": "Hapus Filter"
  }
}
```

```json
// locales/en.json
{
  "nav": {
    "home": "Home",
    "catalog": "Catalog",
    "contact": "Contact",
    "login": "Login",
    "register": "Register",
    "logout": "Logout"
  },
  "product": {
    "available": "Available",
    "sold": "Sold",
    "addToWishlist": "Add to Wishlist",
    "chatWhatsApp": "Chat via WhatsApp"
  },
  "filter": {
    "allTypes": "All Types",
    "allCategories": "All Categories",
    "clearFilters": "Clear Filters"
  }
}
```

### 7.3 Usage

```tsx
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { t } = useTranslation();
  
  return (
    <nav>
      <Link href="/">{t('nav.home')}</Link>
      <Link href="/catalog">{t('nav.catalog')}</Link>
    </nav>
  );
}
```

---

## 8. Price Formatting

```typescript
// lib/utils.ts
export function formatPrice(
  amount: number,
  currency: 'IDR' | 'USD' = 'IDR'
): string {
  if (currency === 'IDR') {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
```

---

## 9. Accessibility

1. **Alt Text:** All images must have descriptive alt text
2. **Labels:** All form inputs must have associated labels
3. **Focus:** Visible focus indicators on interactive elements
4. **Keyboard:** All interactive elements keyboard accessible
5. **Contrast:** Minimum 4.5:1 contrast ratio
6. **ARIA:** Use ARIA labels where native semantics insufficient

```tsx
// Good example
<Button aria-label="Add to wishlist">
  <Heart className="w-5 h-5" />
</Button>

// Good example
<img src={product.thumbnail} alt={`Painting: ${product.title}`} />
```

---

## 10. Responsive Design

```tsx
// Grid responsive
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>

// Two column layout (product detail)
<div className="grid md:grid-cols-2 gap-8 lg:gap-12">
  <ImageGallery images={product.images} />
  <ProductInfo product={product} />
</div>

// Container
<div className="container mx-auto px-4 py-8 max-w-7xl">
  {children}
</div>
```
