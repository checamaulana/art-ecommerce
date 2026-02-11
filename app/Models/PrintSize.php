<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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

    /**
     * Get the product that owns the print size.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the formatted price in IDR.
     */
    public function getPriceFormattedAttribute(): string
    {
        return 'Rp ' . number_format($this->price, 0, ',', '.');
    }

    /**
     * Get the formatted dimensions.
     */
    public function getDimensionsFormattedAttribute(): string
    {
        return "{$this->width} x {$this->height} cm";
    }
}
