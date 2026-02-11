# Implementation Plan
## E-Commerce Lukisan / Art Gallery Online Catalog

**Version:** 1.1  
**Last Updated:** 2026-02-09  
**Architecture:** Laravel + Inertia.js + React (Monolith)

---

## 1. Project Status

### Already Setup ✅
- Laravel 11 project initialized
- Inertia.js configured
- React + TypeScript setup
- Vite configured
- Pest testing framework
- Basic file structure

### To Be Implemented 🔲
- Database migrations
- Models & relationships
- Controllers (Inertia)
- React pages & components
- Authentication customization
- Admin panel
- i18n (multi-language)

---

## 2. Phase Overview

| Phase | Duration | Status |
|-------|----------|--------|
| Phase 1: Database & Models | 2-3 days | 🔲 |
| Phase 2: Authentication | 1-2 days | 🔲 |
| Phase 3: Public Pages | 4-5 days | 🔲 |
| Phase 4: Admin Panel | 4-5 days | 🔲 |
| Phase 5: Polish & Testing | 2-3 days | 🔲 |
| **Total** | **13-18 days** | |

---

## 3. Phase 1: Database & Models (2-3 days)

### 3.1 Create Migrations

```bash
# Run these commands in your project root
php artisan make:migration add_fields_to_users_table
php artisan make:migration create_categories_table
php artisan make:migration create_products_table
php artisan make:migration create_images_table
php artisan make:migration create_print_sizes_table
php artisan make:migration create_wishlists_table
```

**Checklist:**
- [ ] `add_fields_to_users_table` - Add whatsapp, address, role
- [ ] `create_categories_table` - name, slug
- [ ] `create_products_table` - All product fields with soft deletes
- [ ] `create_images_table` - url, is_primary, order
- [ ] `create_print_sizes_table` - size_name, dimensions, price
- [ ] `create_wishlists_table` - user_id, product_id (unique)

### 3.2 Create Models

```bash
php artisan make:model Category
php artisan make:model Product
php artisan make:model Image
php artisan make:model PrintSize
php artisan make:model Wishlist
```

**Checklist:**
- [ ] Update `User.php` - Add fillable, relationships, isAdmin()
- [ ] Create `Category.php` - Relationships, auto slug
- [ ] Create `Product.php` - Relationships, scopes, accessors
- [ ] Create `Image.php` - Relationships
- [ ] Create `PrintSize.php` - Relationships, accessors
- [ ] Create `Wishlist.php` - Relationships

### 3.3 Create Seeders

```bash
php artisan make:seeder AdminSeeder
php artisan make:seeder CategorySeeder
```

**Checklist:**
- [ ] `AdminSeeder` - Create admin user
- [ ] `CategorySeeder` - Create initial categories
- [ ] Update `DatabaseSeeder` - Call seeders

### 3.4 Run Migrations

```bash
php artisan migrate:fresh --seed
```

### 3.5 Deliverables
- [ ] All migrations created and run
- [ ] All models with relationships
- [ ] Admin user seeded (admin@artgallery.com / password)
- [ ] Categories seeded

---

## 4. Phase 2: Authentication (1-2 days)

### 4.1 Customize User Registration

Update registration to include optional fields:

```php
// app/Http/Controllers/Auth/RegisteredUserController.php
// Add whatsapp and address to validation & creation
```

**Checklist:**
- [ ] Update RegisteredUserController
- [ ] Update register form (React)
- [ ] Add whatsapp & address fields

### 4.2 Create Admin Middleware

```bash
php artisan make:middleware EnsureIsAdmin
```

**Checklist:**
- [ ] Create middleware
- [ ] Register in `bootstrap/app.php`
- [ ] Alias as 'admin'

### 4.3 Update HandleInertiaRequests

Add shared data:
- [ ] auth.user
- [ ] locale.current, locale.available
- [ ] currency
- [ ] flash.success, flash.error
- [ ] config.whatsappNumber

### 4.4 Update Auth Pages (React)

- [ ] Update `pages/Auth/Login.tsx` - Style with shadcn
- [ ] Update `pages/Auth/Register.tsx` - Add new fields

### 4.5 Deliverables
- [ ] Registration with whatsapp & address
- [ ] Admin middleware working
- [ ] Shared props configured
- [ ] Auth pages styled

---

## 5. Phase 3: Public Pages (4-5 days)

### 5.1 Create Controllers

```bash
php artisan make:controller HomeController
php artisan make:controller CatalogController
php artisan make:controller WishlistController
php artisan make:controller ProfileController
```

### 5.2 Define Routes (routes/web.php)

```php
// Public
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/catalog', [CatalogController::class, 'index'])->name('catalog.index');
Route::get('/catalog/{product:slug}', [CatalogController::class, 'show'])->name('catalog.show');

// Static pages
Route::inertia('/contact', 'Static/Contact')->name('contact');
Route::inertia('/faq', 'Static/Faq')->name('faq');
Route::inertia('/terms', 'Static/Terms')->name('terms');
Route::inertia('/privacy', 'Static/Privacy')->name('privacy');

// Protected
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    
    Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist.index');
    Route::post('/wishlist/{product}', [WishlistController::class, 'store'])->name('wishlist.store');
    Route::delete('/wishlist/{product}', [WishlistController::class, 'destroy'])->name('wishlist.destroy');
});
```

### 5.3 Create Layouts (React)

**Checklist:**
- [ ] `layouts/MainLayout.tsx` - Navbar, Footer, Toaster
- [ ] `layouts/GuestLayout.tsx` - For auth pages

### 5.4 Create Common Components

**Checklist:**
- [ ] `components/common/Navbar.tsx`
- [ ] `components/common/Footer.tsx`
- [ ] `components/common/ProductCard.tsx`
- [ ] `components/common/ProductGrid.tsx`
- [ ] `components/common/ImageGallery.tsx`
- [ ] `components/common/WhatsAppButton.tsx`
- [ ] `components/common/PriceDisplay.tsx`
- [ ] `components/common/FilterPanel.tsx`
- [ ] `components/common/SortDropdown.tsx`
- [ ] `components/common/StatusBadge.tsx`
- [ ] `components/common/Pagination.tsx`
- [ ] `components/common/LanguageSwitch.tsx`

### 5.5 Create Pages

**Checklist:**
- [ ] `pages/Home.tsx` - Hero, featured products
- [ ] `pages/Catalog/Index.tsx` - Grid, filters, sort, pagination
- [ ] `pages/Catalog/Show.tsx` - Gallery, info, WhatsApp, wishlist
- [ ] `pages/Wishlist/Index.tsx` - User's wishlist
- [ ] `pages/Profile/Edit.tsx` - Edit profile form
- [ ] `pages/Static/Contact.tsx`
- [ ] `pages/Static/Faq.tsx`
- [ ] `pages/Static/Terms.tsx`
- [ ] `pages/Static/Privacy.tsx`

### 5.6 Setup i18n

**Checklist:**
- [ ] Install i18next packages
- [ ] Create `lib/i18n.ts`
- [ ] Create `locales/id.json`
- [ ] Create `locales/en.json`
- [ ] Integrate with app

### 5.7 Deliverables
- [ ] Homepage working
- [ ] Catalog with filters & sort
- [ ] Product detail with WhatsApp
- [ ] Wishlist working
- [ ] Profile edit working
- [ ] i18n working (ID/EN)
- [ ] Responsive design

---

## 6. Phase 4: Admin Panel (4-5 days)

### 6.1 Create Admin Controllers

```bash
php artisan make:controller Admin/DashboardController
php artisan make:controller Admin/ProductController
php artisan make:controller Admin/CategoryController
php artisan make:controller Admin/UserController
```

### 6.2 Create Form Requests

```bash
php artisan make:request StoreProductRequest
php artisan make:request UpdateProductRequest
php artisan make:request StoreCategoryRequest
php artisan make:request UpdateCategoryRequest
```

### 6.3 Define Admin Routes

```php
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    
    Route::resource('products', ProductController::class);
    Route::post('/products/{product}/images', [ProductController::class, 'uploadImages'])
        ->name('products.images.store');
    Route::delete('/products/{product}/images/{image}', [ProductController::class, 'deleteImage'])
        ->name('products.images.destroy');
    
    Route::resource('categories', CategoryController::class)->except(['show']);
    
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/users/{user}', [UserController::class, 'show'])->name('users.show');
});
```

### 6.4 Create Admin Layout

**Checklist:**
- [ ] `layouts/AdminLayout.tsx`
- [ ] `components/admin/Sidebar.tsx`
- [ ] `components/admin/Header.tsx`
- [ ] `components/admin/StatsCard.tsx`

### 6.5 Create Admin Pages

**Checklist:**
- [ ] `pages/Admin/Dashboard.tsx` - Stats, quick actions
- [ ] `pages/Admin/Products/Index.tsx` - Table, search, actions
- [ ] `pages/Admin/Products/Create.tsx` - Full form with images
- [ ] `pages/Admin/Products/Edit.tsx` - Edit form
- [ ] `pages/Admin/Categories/Index.tsx` - CRUD with modal
- [ ] `pages/Admin/Users/Index.tsx` - Read-only list

### 6.6 Image Upload Component

**Checklist:**
- [ ] `components/admin/ImageUpload.tsx` - Drag & drop
- [ ] Image preview
- [ ] Primary image selection
- [ ] Delete image

### 6.7 Print Size Management

**Checklist:**
- [ ] Dynamic add/remove sizes in product form
- [ ] Size name, dimensions, price per size

### 6.8 Deliverables
- [ ] Admin dashboard with stats
- [ ] Product CRUD complete
- [ ] Image upload working
- [ ] Print sizes management
- [ ] Category CRUD complete
- [ ] User list (read-only)
- [ ] All forms validated
- [ ] Responsive admin layout

---

## 7. Phase 5: Polish & Testing (2-3 days)

### 7.1 Testing

```bash
# Run all tests
php artisan test

# Or with Pest
./vendor/bin/pest
```

**Checklist:**
- [ ] Test auth flows
- [ ] Test public pages load
- [ ] Test catalog filtering
- [ ] Test wishlist add/remove
- [ ] Test admin CRUD
- [ ] Test image upload

### 7.2 Cross-Browser Testing

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

### 7.3 Responsive Testing

- [ ] Mobile (320px - 767px)
- [ ] Tablet (768px - 1023px)
- [ ] Desktop (1024px+)

### 7.4 Performance

- [ ] Optimize images (lazy loading)
- [ ] Code splitting (Vite)
- [ ] Query optimization (eager loading)

### 7.5 SEO

- [ ] Meta tags per page
- [ ] Open Graph tags
- [ ] Proper heading hierarchy

### 7.6 Final Polish

- [ ] Loading states
- [ ] Error states
- [ ] Empty states
- [ ] Toast notifications
- [ ] Form validation feedback

### 7.7 Deliverables
- [ ] All tests passing
- [ ] Responsive on all devices
- [ ] Performance acceptable
- [ ] SEO configured

---

## 8. Commands Reference

### 8.1 Development

```bash
# Start both servers
bun run dev              # Vite (terminal 1)
php artisan serve        # Laravel (terminal 2)

# Or with concurrently
bun run dev & php artisan serve
```

### 8.2 Database

```bash
php artisan migrate                    # Run migrations
php artisan migrate:fresh --seed       # Reset & seed
php artisan db:seed                    # Run seeders
php artisan tinker                     # REPL
```

### 8.3 Artisan Make

```bash
php artisan make:controller Name
php artisan make:model Name -m         # With migration
php artisan make:request Name
php artisan make:middleware Name
php artisan make:seeder Name
```

### 8.4 Testing

```bash
php artisan test                       # Run tests
./vendor/bin/pest                      # Run with Pest
./vendor/bin/pest --filter=TestName    # Filter tests
```

### 8.5 Production

```bash
bun run build                          # Build frontend
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan storage:link
```

---

## 9. File Creation Checklist

### Migrations
- [ ] `database/migrations/xxxx_add_fields_to_users_table.php`
- [ ] `database/migrations/xxxx_create_categories_table.php`
- [ ] `database/migrations/xxxx_create_products_table.php`
- [ ] `database/migrations/xxxx_create_images_table.php`
- [ ] `database/migrations/xxxx_create_print_sizes_table.php`
- [ ] `database/migrations/xxxx_create_wishlists_table.php`

### Models
- [ ] `app/Models/Category.php`
- [ ] `app/Models/Product.php`
- [ ] `app/Models/Image.php`
- [ ] `app/Models/PrintSize.php`
- [ ] `app/Models/Wishlist.php`

### Controllers
- [ ] `app/Http/Controllers/HomeController.php`
- [ ] `app/Http/Controllers/CatalogController.php`
- [ ] `app/Http/Controllers/WishlistController.php`
- [ ] `app/Http/Controllers/ProfileController.php`
- [ ] `app/Http/Controllers/Admin/DashboardController.php`
- [ ] `app/Http/Controllers/Admin/ProductController.php`
- [ ] `app/Http/Controllers/Admin/CategoryController.php`
- [ ] `app/Http/Controllers/Admin/UserController.php`

### Middleware
- [ ] `app/Http/Middleware/EnsureIsAdmin.php`

### Requests
- [ ] `app/Http/Requests/StoreProductRequest.php`
- [ ] `app/Http/Requests/UpdateProductRequest.php`
- [ ] `app/Http/Requests/StoreCategoryRequest.php`

### Seeders
- [ ] `database/seeders/AdminSeeder.php`
- [ ] `database/seeders/CategorySeeder.php`

### React Layouts
- [ ] `resources/js/layouts/MainLayout.tsx`
- [ ] `resources/js/layouts/AdminLayout.tsx`
- [ ] `resources/js/layouts/GuestLayout.tsx`

### React Common Components
- [ ] `resources/js/components/common/Navbar.tsx`
- [ ] `resources/js/components/common/Footer.tsx`
- [ ] `resources/js/components/common/ProductCard.tsx`
- [ ] `resources/js/components/common/ProductGrid.tsx`
- [ ] `resources/js/components/common/ImageGallery.tsx`
- [ ] `resources/js/components/common/WhatsAppButton.tsx`
- [ ] `resources/js/components/common/PriceDisplay.tsx`
- [ ] `resources/js/components/common/FilterPanel.tsx`
- [ ] `resources/js/components/common/StatusBadge.tsx`
- [ ] `resources/js/components/common/Pagination.tsx`
- [ ] `resources/js/components/common/LanguageSwitch.tsx`

### React Admin Components
- [ ] `resources/js/components/admin/Sidebar.tsx`
- [ ] `resources/js/components/admin/Header.tsx`
- [ ] `resources/js/components/admin/StatsCard.tsx`
- [ ] `resources/js/components/admin/ImageUpload.tsx`

### React Pages
- [ ] `resources/js/pages/Home.tsx`
- [ ] `resources/js/pages/Catalog/Index.tsx`
- [ ] `resources/js/pages/Catalog/Show.tsx`
- [ ] `resources/js/pages/Wishlist/Index.tsx`
- [ ] `resources/js/pages/Profile/Edit.tsx`
- [ ] `resources/js/pages/Static/Contact.tsx`
- [ ] `resources/js/pages/Static/Faq.tsx`
- [ ] `resources/js/pages/Static/Terms.tsx`
- [ ] `resources/js/pages/Static/Privacy.tsx`
- [ ] `resources/js/pages/Admin/Dashboard.tsx`
- [ ] `resources/js/pages/Admin/Products/Index.tsx`
- [ ] `resources/js/pages/Admin/Products/Create.tsx`
- [ ] `resources/js/pages/Admin/Products/Edit.tsx`
- [ ] `resources/js/pages/Admin/Categories/Index.tsx`
- [ ] `resources/js/pages/Admin/Users/Index.tsx`

### Utilities
- [ ] `resources/js/lib/i18n.ts`
- [ ] `resources/js/types/index.d.ts`
- [ ] `resources/js/locales/id.json`
- [ ] `resources/js/locales/en.json`

---

## 10. Definition of Done

### Per Task
- [ ] Code implemented
- [ ] Works as expected
- [ ] No console errors
- [ ] Responsive (if UI)
- [ ] Types correct (TypeScript)

### Per Phase
- [ ] All tasks complete
- [ ] No blocking bugs
- [ ] Tested manually

### Project Complete
- [ ] All features working
- [ ] Responsive on all devices
- [ ] Artist can manage products independently
- [ ] WhatsApp integration working
- [ ] i18n working
