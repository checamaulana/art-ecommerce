# Backend Structure Document
## E-Commerce Lukisan / Art Gallery Online Catalog

**Version:** 1.1  
**Last Updated:** 2026-02-09  
**Architecture:** Laravel + Inertia.js + React (Monolith)

---

## 1. Database Schema

### 1.1 Entity Relationship Diagram

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│    users     │     │    products      │     │  categories  │
├──────────────┤     ├──────────────────┤     ├──────────────┤
│ id           │     │ id               │     │ id           │
│ name         │     │ category_id (FK) │────▶│ name         │
│ email        │     │ title            │     │ slug         │
│ password     │     │ slug             │     │ created_at   │
│ whatsapp     │     │ description      │     │ updated_at   │
│ address      │     │ product_type     │     └──────────────┘
│ role         │     │ price            │
│ created_at   │     │ price_usd        │     ┌──────────────┐
│ updated_at   │     │ width            │     │   images     │
└──────────────┘     │ height           │     ├──────────────┤
       │             │ medium           │     │ id           │
       │             │ year_created     │◀────│ product_id   │
       │             │ status           │     │ url          │
       │             │ is_featured      │     │ is_primary   │
       │             │ created_at       │     │ order        │
       │             │ updated_at       │     │ created_at   │
       │             │ deleted_at       │     └──────────────┘
       │             └──────────────────┘
       │                    │                 ┌──────────────┐
       │                    │                 │ print_sizes  │
       │                    │                 ├──────────────┤
       │                    └────────────────▶│ id           │
       │                                      │ product_id   │
       │             ┌──────────────┐         │ size_name    │
       │             │  wishlists   │         │ width        │
       │             ├──────────────┤         │ height       │
       └────────────▶│ id           │         │ price        │
                     │ user_id (FK) │         │ price_usd    │
                     │ product_id   │         │ created_at   │
                     │ created_at   │         └──────────────┘
                     └──────────────┘
```

### 1.2 Migration Files

#### users (modify existing)
```php
// database/migrations/xxxx_add_fields_to_users_table.php
Schema::table('users', function (Blueprint $table) {
    $table->string('whatsapp', 20)->nullable()->after('email');
    $table->text('address')->nullable()->after('whatsapp');
    $table->enum('role', ['user', 'admin'])->default('user')->after('address');
});
```

#### categories
```php
// database/migrations/xxxx_create_categories_table.php
Schema::create('categories', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('slug')->unique();
    $table->timestamps();
});
```

#### products
```php
// database/migrations/xxxx_create_products_table.php
Schema::create('products', function (Blueprint $table) {
    $table->id();
    $table->foreignId('category_id')->constrained()->onDelete('restrict');
    $table->string('title');
    $table->string('slug')->unique();
    $table->text('description');
    $table->enum('product_type', ['original', 'print', 'digital']);
    $table->decimal('price', 15, 2);
    $table->decimal('price_usd', 10, 2)->nullable();
    $table->integer('width')->comment('in cm');
    $table->integer('height')->comment('in cm');
    $table->string('medium');
    $table->year('year_created');
    $table->enum('status', ['available', 'sold'])->default('available');
    $table->boolean('is_featured')->default(false);
    $table->timestamps();
    $table->softDeletes();
});
```

#### images
```php
// database/migrations/xxxx_create_images_table.php
Schema::create('images', function (Blueprint $table) {
    $table->id();
    $table->foreignId('product_id')->constrained()->onDelete('cascade');
    $table->string('url', 500);
    $table->boolean('is_primary')->default(false);
    $table->integer('order')->default(0);
    $table->timestamps();
});
```

#### print_sizes
```php
// database/migrations/xxxx_create_print_sizes_table.php
Schema::create('print_sizes', function (Blueprint $table) {
    $table->id();
    $table->foreignId('product_id')->constrained()->onDelete('cascade');
    $table->string('size_name', 50);
    $table->integer('width')->comment('in cm');
    $table->integer('height')->comment('in cm');
    $table->decimal('price', 15, 2);
    $table->decimal('price_usd', 10, 2)->nullable();
    $table->timestamps();
});
```

#### wishlists
```php
// database/migrations/xxxx_create_wishlists_table.php
Schema::create('wishlists', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->foreignId('product_id')->constrained()->onDelete('cascade');
    $table->timestamps();
    $table->unique(['user_id', 'product_id']);
});
```

---

## 2. Models

### 2.1 User Model
```php
// app/Models/User.php
class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'whatsapp',
        'address',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function wishlists(): HasMany
    {
        return $this->hasMany(Wishlist::class);
    }

    public function wishlistProducts(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'wishlists')
            ->withTimestamps();
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
}
```

### 2.2 Category Model
```php
// app/Models/Category.php
class Category extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug'];

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    protected static function booted(): void
    {
        static::creating(function (Category $category) {
            $category->slug = Str::slug($category->name);
        });
    }
}
```

### 2.3 Product Model
```php
// app/Models/Product.php
class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id',
        'title',
        'slug',
        'description',
        'product_type',
        'price',
        'price_usd',
        'width',
        'height',
        'medium',
        'year_created',
        'status',
        'is_featured',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'price_usd' => 'decimal:2',
        'is_featured' => 'boolean',
    ];

    protected $appends = [
        'price_formatted',
        'dimensions_formatted',
        'thumbnail',
    ];

    // Relationships
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(Image::class)->orderBy('order');
    }

    public function primaryImage(): HasOne
    {
        return $this->hasOne(Image::class)->where('is_primary', true);
    }

    public function printSizes(): HasMany
    {
        return $this->hasMany(PrintSize::class);
    }

    public function wishlistedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'wishlists');
    }

    // Accessors
    public function getPriceFormattedAttribute(): string
    {
        return 'Rp ' . number_format($this->price, 0, ',', '.');
    }

    public function getDimensionsFormattedAttribute(): string
    {
        return "{$this->width} x {$this->height} cm";
    }

    public function getThumbnailAttribute(): ?string
    {
        return $this->primaryImage?->url ?? $this->images->first()?->url;
    }

    // Scopes
    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeOfType($query, $type)
    {
        return $query->when($type, fn($q) => $q->where('product_type', $type));
    }

    // Auto slug
    protected static function booted(): void
    {
        static::creating(function (Product $product) {
            $product->slug = Str::slug($product->title);
        });
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
```

### 2.4 Image Model
```php
// app/Models/Image.php
class Image extends Model
{
    use HasFactory;

    protected $fillable = ['product_id', 'url', 'is_primary', 'order'];

    protected $casts = [
        'is_primary' => 'boolean',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
```

### 2.5 PrintSize Model
```php
// app/Models/PrintSize.php
class PrintSize extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'size_name',
        'width',
        'height',
        'price',
        'price_usd',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'price_usd' => 'decimal:2',
    ];

    protected $appends = ['price_formatted', 'dimensions_formatted'];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function getPriceFormattedAttribute(): string
    {
        return 'Rp ' . number_format($this->price, 0, ',', '.');
    }

    public function getDimensionsFormattedAttribute(): string
    {
        return "{$this->width} x {$this->height} cm";
    }
}
```

### 2.6 Wishlist Model
```php
// app/Models/Wishlist.php
class Wishlist extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'product_id'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
```

---

## 3. Controllers (Inertia)

### 3.1 HomeController
```php
// app/Http/Controllers/HomeController.php
class HomeController extends Controller
{
    public function index()
    {
        return Inertia::render('Home', [
            'featuredProducts' => Product::with(['category', 'images'])
                ->featured()
                ->available()
                ->take(8)
                ->get(),
            'categories' => Category::withCount('products')->get(),
        ]);
    }
}
```

### 3.2 CatalogController
```php
// app/Http/Controllers/CatalogController.php
class CatalogController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::with(['category', 'images'])
            ->when($request->type, fn($q, $type) => $q->where('product_type', $type))
            ->when($request->category, fn($q, $cat) => $q->where('category_id', $cat))
            ->when($request->status, fn($q, $status) => $q->where('status', $status))
            ->when($request->price_min, fn($q, $min) => $q->where('price', '>=', $min))
            ->when($request->price_max, fn($q, $max) => $q->where('price', '<=', $max))
            ->when($request->search, fn($q, $search) => $q->where('title', 'like', "%{$search}%"))
            ->when($request->sort, function ($q, $sort) {
                return match ($sort) {
                    'price_asc' => $q->orderBy('price', 'asc'),
                    'price_desc' => $q->orderBy('price', 'desc'),
                    'oldest' => $q->orderBy('created_at', 'asc'),
                    default => $q->orderBy('created_at', 'desc'),
                };
            }, fn($q) => $q->orderBy('created_at', 'desc'))
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Catalog/Index', [
            'products' => $products,
            'categories' => Category::all(),
            'filters' => $request->only(['type', 'category', 'status', 'price_min', 'price_max', 'sort', 'search']),
        ]);
    }

    public function show(Product $product)
    {
        $product->load(['category', 'images', 'printSizes']);
        
        $isWishlisted = auth()->check() 
            ? auth()->user()->wishlistProducts()->where('product_id', $product->id)->exists()
            : false;

        return Inertia::render('Catalog/Show', [
            'product' => $product,
            'isWishlisted' => $isWishlisted,
            'relatedProducts' => Product::with(['images'])
                ->where('category_id', $product->category_id)
                ->where('id', '!=', $product->id)
                ->take(4)
                ->get(),
        ]);
    }
}
```

### 3.3 WishlistController
```php
// app/Http/Controllers/WishlistController.php
class WishlistController extends Controller
{
    public function index()
    {
        return Inertia::render('Wishlist/Index', [
            'products' => auth()->user()
                ->wishlistProducts()
                ->with(['category', 'images'])
                ->get(),
        ]);
    }

    public function store(Product $product)
    {
        auth()->user()->wishlistProducts()->syncWithoutDetaching([$product->id]);
        
        return back()->with('success', 'Added to wishlist');
    }

    public function destroy(Product $product)
    {
        auth()->user()->wishlistProducts()->detach($product->id);
        
        return back()->with('success', 'Removed from wishlist');
    }
}
```

### 3.4 Admin ProductController
```php
// app/Http/Controllers/Admin/ProductController.php
class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::with(['category', 'images'])
            ->when($request->search, fn($q, $s) => $q->where('title', 'like', "%{$s}%"))
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Products/Create', [
            'categories' => Category::all(),
        ]);
    }

    public function store(StoreProductRequest $request)
    {
        $product = Product::create($request->validated());

        // Handle images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('products', 'public');
                $product->images()->create([
                    'url' => Storage::url($path),
                    'is_primary' => $index === 0,
                    'order' => $index,
                ]);
            }
        }

        // Handle print sizes
        if ($request->product_type === 'print' && $request->sizes) {
            foreach ($request->sizes as $size) {
                $product->printSizes()->create($size);
            }
        }

        return redirect()->route('admin.products.index')
            ->with('success', 'Product created successfully');
    }

    public function edit(Product $product)
    {
        return Inertia::render('Admin/Products/Edit', [
            'product' => $product->load(['images', 'printSizes']),
            'categories' => Category::all(),
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $product->update($request->validated());

        return redirect()->route('admin.products.index')
            ->with('success', 'Product updated successfully');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Product deleted successfully');
    }

    public function uploadImages(Request $request, Product $product)
    {
        $request->validate([
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $lastOrder = $product->images()->max('order') ?? -1;

        foreach ($request->file('images') as $index => $image) {
            $path = $image->store('products', 'public');
            $product->images()->create([
                'url' => Storage::url($path),
                'is_primary' => false,
                'order' => $lastOrder + $index + 1,
            ]);
        }

        return back()->with('success', 'Images uploaded successfully');
    }

    public function deleteImage(Product $product, Image $image)
    {
        // Delete file
        $path = str_replace('/storage/', '', $image->url);
        Storage::disk('public')->delete($path);
        
        $image->delete();

        return back()->with('success', 'Image deleted successfully');
    }
}
```

---

## 4. Form Requests

### 4.1 StoreProductRequest
```php
// app/Http/Requests/StoreProductRequest.php
class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'product_type' => 'required|in:original,print,digital',
            'price' => 'required|numeric|min:0',
            'price_usd' => 'nullable|numeric|min:0',
            'width' => 'required|integer|min:1',
            'height' => 'required|integer|min:1',
            'medium' => 'required|string|max:255',
            'year_created' => 'required|integer|min:1900|max:' . date('Y'),
            'status' => 'nullable|in:available,sold',
            'is_featured' => 'nullable|boolean',
            'images' => 'required|array|min:1',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:5120',
            'sizes' => 'nullable|array',
            'sizes.*.size_name' => 'required_with:sizes|string|max:50',
            'sizes.*.width' => 'required_with:sizes|integer|min:1',
            'sizes.*.height' => 'required_with:sizes|integer|min:1',
            'sizes.*.price' => 'required_with:sizes|numeric|min:0',
        ];
    }
}
```

---

## 5. Middleware

### 5.1 EnsureIsAdmin
```php
// app/Http/Middleware/EnsureIsAdmin.php
class EnsureIsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || !$request->user()->isAdmin()) {
            abort(403, 'Unauthorized. Admin access required.');
        }

        return $next($request);
    }
}
```

Register in `bootstrap/app.php`:
```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'admin' => \App\Http\Middleware\EnsureIsAdmin::class,
    ]);
})
```

---

## 6. HandleInertiaRequests (Shared Data)

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
            'currency' => session('currency', 'IDR'),
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
            ],
            'config' => [
                'whatsappNumber' => config('app.whatsapp_number'),
            ],
        ];
    }
}
```

---

## 7. Seeders

### 7.1 DatabaseSeeder
```php
// database/seeders/DatabaseSeeder.php
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            AdminSeeder::class,
            CategorySeeder::class,
            // ProductSeeder::class, // Optional: sample data
        ]);
    }
}
```

### 7.2 AdminSeeder
```php
// database/seeders/AdminSeeder.php
class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@artgallery.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);
    }
}
```

### 7.3 CategorySeeder
```php
// database/seeders/CategorySeeder.php
class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Abstract',
            'Nature',
            'Portrait',
            'Landscape',
            'Modern',
            'Traditional',
        ];

        foreach ($categories as $name) {
            Category::create([
                'name' => $name,
                'slug' => Str::slug($name),
            ]);
        }
    }
}
```

---

## 8. Config

Add to `config/app.php`:
```php
'whatsapp_number' => env('WHATSAPP_NUMBER', '6281234567890'),
```
