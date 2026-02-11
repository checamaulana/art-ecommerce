# Technology Stack Document
## E-Commerce Lukisan / Art Gallery Online Catalog

**Version:** 1.1  
**Last Updated:** 2026-02-09  
**Architecture:** Laravel + Inertia.js + React (Monolith)

---

## 1. Stack Overview

| Layer | Technology | Version |
|-------|------------|---------|
| **Framework** | Laravel | 11.x |
| **Frontend Adapter** | Inertia.js | 2.x |
| **Frontend** | React + TypeScript | 18.x |
| **Build Tool** | Vite | 5.x |
| **Styling** | Tailwind CSS | 3.x |
| **UI Components** | shadcn/ui | Latest |
| **Database** | MySQL | 8.x |
| **Runtime** | Bun | Latest |
| **Testing** | Pest PHP | Latest |
| **Auth** | Laravel Built-in | - |

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER                                 │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LARAVEL APPLICATION                          │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    routes/web.php                           ││
│  │              (All routes defined here)                      ││
│  └─────────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    Controllers                              ││
│  │         Return Inertia::render('PageName', $data)           ││
│  └─────────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    Inertia.js                               ││
│  │         (Bridges Laravel & React)                           ││
│  └─────────────────────────────────────────────────────────────┘│
│                          │                                      │
│                          ▼                                      │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │               React Pages (resources/js/pages)              ││
│  │              Rendered with shared layout                    ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                       MySQL DATABASE                            │
└─────────────────────────────────────────────────────────────────┘
```

**Key Concept:** Tidak ada REST API terpisah. Laravel mengirim data langsung ke React melalui Inertia.js.

---

## 3. Project Structure

```
E-commerce-Art-platform/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Controller.php
│   │   │   ├── HomeController.php
│   │   │   ├── CatalogController.php
│   │   │   ├── ProductController.php
│   │   │   ├── WishlistController.php
│   │   │   ├── ProfileController.php
│   │   │   └── Admin/
│   │   │       ├── DashboardController.php
│   │   │       ├── ProductController.php
│   │   │       ├── CategoryController.php
│   │   │       └── UserController.php
│   │   ├── Middleware/
│   │   │   ├── HandleInertiaRequests.php
│   │   │   └── EnsureIsAdmin.php
│   │   └── Requests/
│   │       ├── StoreProductRequest.php
│   │       ├── UpdateProductRequest.php
│   │       └── StoreCategoryRequest.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Product.php
│   │   ├── Category.php
│   │   ├── Image.php
│   │   ├── PrintSize.php
│   │   └── Wishlist.php
│   ├── Services/
│   │   └── ImageService.php
│   └── Providers/
│       └── AppServiceProvider.php
├── database/
│   ├── migrations/
│   ├── seeders/
│   └── factories/
├── resources/
│   ├── css/
│   │   └── app.css
│   ├── js/
│   │   ├── app.tsx                    # React entry point
│   │   ├── ssr.tsx                    # SSR entry point
│   │   ├── components/
│   │   │   ├── ui/                    # shadcn/ui components
│   │   │   ├── common/                # Shared components
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── ProductCard.tsx
│   │   │   │   ├── ProductGrid.tsx
│   │   │   │   ├── WhatsAppButton.tsx
│   │   │   │   └── PriceDisplay.tsx
│   │   │   └── admin/                 # Admin components
│   │   ├── layouts/
│   │   │   ├── MainLayout.tsx
│   │   │   ├── AdminLayout.tsx
│   │   │   └── GuestLayout.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Catalog/
│   │   │   │   ├── Index.tsx
│   │   │   │   └── Show.tsx
│   │   │   ├── Auth/
│   │   │   │   ├── Login.tsx
│   │   │   │   └── Register.tsx
│   │   │   ├── Profile/
│   │   │   │   └── Edit.tsx
│   │   │   ├── Wishlist/
│   │   │   │   └── Index.tsx
│   │   │   ├── Admin/
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── Products/
│   │   │   │   │   ├── Index.tsx
│   │   │   │   │   ├── Create.tsx
│   │   │   │   │   └── Edit.tsx
│   │   │   │   ├── Categories/
│   │   │   │   └── Users/
│   │   │   └── Static/
│   │   │       ├── Contact.tsx
│   │   │       ├── Faq.tsx
│   │   │       ├── Terms.tsx
│   │   │       └── Privacy.tsx
│   │   ├── hooks/
│   │   │   ├── use-locale.ts
│   │   │   └── use-wishlist.ts
│   │   ├── lib/
│   │   │   ├── utils.ts
│   │   │   └── i18n.ts
│   │   ├── types/
│   │   │   └── index.d.ts
│   │   └── locales/
│   │       ├── id.json
│   │       └── en.json
│   └── views/
│       └── app.blade.php              # Inertia entry point
├── routes/
│   ├── web.php                        # All routes here
│   └── console.php
├── tests/
│   ├── Feature/
│   └── Unit/
├── .env
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js
```

---

## 4. Core Packages

### 4.1 Backend (Laravel)
| Package | Purpose |
|---------|---------|
| `inertiajs/inertia-laravel` | Inertia.js server adapter |
| `tightenco/ziggy` | Laravel routes in JavaScript |
| `intervention/image` | Image processing |
| `pestphp/pest` | Testing framework |

### 4.2 Frontend (React)
| Package | Purpose |
|---------|---------|
| `@inertiajs/react` | Inertia.js React adapter |
| `react` | UI Library |
| `react-dom` | DOM rendering |
| `tailwindcss` | Utility-first CSS |
| `@radix-ui/*` | Headless UI (via shadcn) |
| `lucide-react` | Icons |
| `react-hook-form` | Form handling |
| `zod` | Schema validation |
| `i18next` | Internationalization |
| `react-i18next` | React i18n bindings |
| `embla-carousel-react` | Image carousel |
| `sonner` | Toast notifications |

---

## 5. Inertia.js Key Concepts

### 5.1 Rendering Pages (Controller)

```php
// app/Http/Controllers/CatalogController.php
use Inertia\Inertia;

class CatalogController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::with(['category', 'images'])
            ->when($request->type, fn($q, $type) => $q->where('product_type', $type))
            ->when($request->category, fn($q, $cat) => $q->where('category_id', $cat))
            ->paginate(12);

        return Inertia::render('Catalog/Index', [
            'products' => $products,
            'categories' => Category::all(),
            'filters' => $request->only(['type', 'category', 'sort']),
        ]);
    }

    public function show(Product $product)
    {
        return Inertia::render('Catalog/Show', [
            'product' => $product->load(['category', 'images', 'printSizes']),
        ]);
    }
}
```

### 5.2 Receiving Props (React Page)

```tsx
// resources/js/pages/Catalog/Index.tsx
import { Head } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';

interface Props {
  products: PaginatedData<Product>;
  categories: Category[];
  filters: {
    type?: string;
    category?: string;
    sort?: string;
  };
}

export default function CatalogIndex({ products, categories, filters }: Props) {
  return (
    <MainLayout>
      <Head title="Catalog" />
      {/* Page content */}
    </MainLayout>
  );
}
```

### 5.3 Navigation (Inertia Links)

```tsx
import { Link, router } from '@inertiajs/react';

// Simple link
<Link href="/catalog">Catalog</Link>

// Link with preserve scroll
<Link href="/catalog?page=2" preserveScroll>Next Page</Link>

// Programmatic navigation
router.visit('/catalog', {
  data: { type: 'original' },
  preserveState: true,
});
```

### 5.4 Forms (Inertia useForm)

```tsx
import { useForm } from '@inertiajs/react';

export default function LoginForm() {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/login');
  };

  return (
    <form onSubmit={submit}>
      <input
        value={data.email}
        onChange={(e) => setData('email', e.target.value)}
      />
      {errors.email && <span>{errors.email}</span>}
      <button disabled={processing}>Login</button>
    </form>
  );
}
```

---

## 6. Shared Data (HandleInertiaRequests)

```php
// app/Http/Middleware/HandleInertiaRequests.php
class HandleInertiaRequests extends Middleware
{
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'locale' => [
                'current' => app()->getLocale(),
                'available' => ['id', 'en'],
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
            'whatsappNumber' => config('app.whatsapp_number'),
        ];
    }
}
```

**Akses di React:**
```tsx
import { usePage } from '@inertiajs/react';

const { auth, locale, flash, whatsappNumber } = usePage().props;
```

---

## 7. Routes Structure (routes/web.php)

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\UserController as AdminUserController;

// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/catalog', [CatalogController::class, 'index'])->name('catalog.index');
Route::get('/catalog/{product:slug}', [CatalogController::class, 'show'])->name('catalog.show');

// Static pages
Route::view('/contact', 'pages/contact')->name('contact');
Route::view('/faq', 'pages/faq')->name('faq');
Route::view('/terms', 'pages/terms')->name('terms');
Route::view('/privacy', 'pages/privacy')->name('privacy');

// Auth routes (provided by Laravel Breeze/Fortify)
require __DIR__.'/auth.php';

// Protected routes
Route::middleware('auth')->group(function () {
    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');

    // Wishlist
    Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist.index');
    Route::post('/wishlist/{product}', [WishlistController::class, 'store'])->name('wishlist.store');
    Route::delete('/wishlist/{product}', [WishlistController::class, 'destroy'])->name('wishlist.destroy');
});

// Admin routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    
    // Products
    Route::resource('products', AdminProductController::class);
    Route::post('/products/{product}/images', [AdminProductController::class, 'uploadImages'])->name('products.images.store');
    Route::delete('/products/{product}/images/{image}', [AdminProductController::class, 'deleteImage'])->name('products.images.destroy');
    
    // Categories
    Route::resource('categories', AdminCategoryController::class)->except(['show']);
    
    // Users (read-only)
    Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
    Route::get('/users/{user}', [AdminUserController::class, 'show'])->name('users.show');
});
```

---

## 8. TypeScript Types

```typescript
// resources/js/types/index.d.ts
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
}

export interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// Inertia shared props
export interface PageProps {
  auth: {
    user: User | null;
  };
  locale: {
    current: 'id' | 'en';
    available: string[];
  };
  flash: {
    success?: string;
    error?: string;
  };
  whatsappNumber: string;
}
```

---

## 9. Environment Variables

```env
APP_NAME="Art Gallery"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=art_gallery
DB_USERNAME=root
DB_PASSWORD=

# WhatsApp
WHATSAPP_NUMBER=6281234567890

# File storage
FILESYSTEM_DISK=public

# Inertia SSR (optional)
INERTIA_SSR_ENABLED=false
```

---

## 10. Development Commands

```bash
# Start development
bun run dev              # Vite dev server
php artisan serve        # Laravel server

# Or use concurrent
bun run dev & php artisan serve

# Database
php artisan migrate
php artisan migrate:fresh --seed
php artisan db:seed

# Testing
php artisan test
./vendor/bin/pest

# Build
bun run build

# Laravel utilities
php artisan make:controller ControllerName
php artisan make:model ModelName -m
php artisan make:request RequestName
php artisan route:list
```
