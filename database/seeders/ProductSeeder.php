<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Image;
use App\Models\PrintSize;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure categories exist (from CategorySeeder)
        if (Category::count() === 0) {
            $this->call(CategorySeeder::class);
        }

        $categories = Category::all();

        // Create 10 products with images
        foreach (range(1, 10) as $index) {
            $category = $categories->random();

            // Mix of product types
            $productType = match ($index % 3) {
                0 => 'print',
                1 => 'digital',
                default => 'original',
            };

            $product = Product::factory()
                ->for($category)
                ->create([
                    'product_type' => $productType,
                    'is_featured' => $index <= 3, // First 3 are featured
                    'status' => $index > 8 ? 'sold' : 'available', // Last 2 are sold
                ]);

            // Add images (1-3 images per product)
            $imageCount = rand(1, 3);
            foreach (range(1, $imageCount) as $imgIndex) {
                Image::create([
                    'product_id' => $product->id,
                    'url' => "https://picsum.photos/seed/{$product->id}-{$imgIndex}/800/800",
                    'is_primary' => $imgIndex === 1,
                    'order' => $imgIndex,
                ]);
            }

            // Add print sizes for print products
            if ($productType === 'print') {
                $sizes = [
                    ['name' => 'A4', 'width' => 21, 'height' => 30],
                    ['name' => 'A3', 'width' => 30, 'height' => 42],
                    ['name' => 'A2', 'width' => 42, 'height' => 60],
                ];

                foreach ($sizes as $sizeIndex => $size) {
                    PrintSize::create([
                        'product_id' => $product->id,
                        'size_name' => $size['name'],
                        'width' => $size['width'],
                        'height' => $size['height'],
                        'price' => 200_000 + ($sizeIndex * 150_000),
                        'price_usd' => 20 + ($sizeIndex * 15),
                    ]);
                }
            }
        }
    }
}
