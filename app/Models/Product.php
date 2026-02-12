<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

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

    // ─── Relationships ───────────────────────────────────────

    /**
     * Get the category that owns the product.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the images for the product.
     */
    public function images(): HasMany
    {
        return $this->hasMany(Image::class)->orderBy('order');
    }

    /**
     * Get the primary image for the product.
     */
    public function primaryImage(): HasOne
    {
        return $this->hasOne(Image::class)->where('is_primary', true);
    }

    /**
     * Get the print sizes for the product.
     */
    public function printSizes(): HasMany
    {
        return $this->hasMany(PrintSize::class);
    }

    /**
     * Get the users who wishlisted this product.
     */
    public function wishlistedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'wishlists');
    }

    // ─── Accessors ───────────────────────────────────────────

    /**
     * Get the formatted price in IDR.
     */
    public function getPriceFormattedAttribute(): string
    {
        return 'Rp '.number_format($this->price, 0, ',', '.');
    }

    /**
     * Get the formatted dimensions.
     */
    public function getDimensionsFormattedAttribute(): string
    {
        return "{$this->width} x {$this->height} cm";
    }

    /**
     * Get the thumbnail URL.
     */
    public function getThumbnailAttribute(): ?string
    {
        return $this->primaryImage?->url ?? $this->images->first()?->url;
    }

    // ─── Scopes ──────────────────────────────────────────────

    /**
     * Scope to only available products.
     */
    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }

    /**
     * Scope to only featured products.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope to filter by product type.
     */
    public function scopeOfType($query, $type)
    {
        return $query->when($type, fn ($q) => $q->where('product_type', $type));
    }

    // ─── Boot ────────────────────────────────────────────────

    /**
     * Auto-generate slug when creating a product.
     */
    protected static function booted(): void
    {
        static::creating(function (Product $product): void {
            $product->slug = static::generateUniqueSlug($product->title);
        });

        static::updating(function (Product $product): void {
            if ($product->isDirty('title')) {
                $product->slug = static::generateUniqueSlug($product->title, $product->id);
            }
        });
    }

    /**
     * Generate a unique slug based on title.
     */
    private static function generateUniqueSlug(string $title, ?int $ignoreProductId = null): string
    {
        $baseSlug = Str::slug($title);
        $baseSlug = $baseSlug !== '' ? $baseSlug : 'product';
        $slug = $baseSlug;
        $counter = 2;

        while (
            static::query()
                ->withTrashed()
                ->when($ignoreProductId !== null, fn ($query) => $query->whereKeyNot($ignoreProductId))
                ->where('slug', $slug)
                ->exists()
        ) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
