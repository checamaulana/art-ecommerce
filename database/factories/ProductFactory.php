<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $artTitles = [
            'Sunset Over Mountains',
            'Ocean Waves',
            'Abstract Dreams',
            'City Lights',
            'Forest Path',
            'Desert Dunes',
            'Rainy Streets',
            'Starry Night',
            'Autumn Colors',
            'Winter Wonderland',
        ];

        $mediums = ['Oil on Canvas', 'Acrylic', 'Watercolor', 'Digital Art', 'Mixed Media'];

        return [
            'category_id' => Category::factory(),
            'title' => fake()->randomElement($artTitles).' '.fake()->numberBetween(1, 100),
            'description' => fake()->paragraph(3),
            'product_type' => 'original',
            'price' => fake()->numberBetween(500_000, 5_000_000),
            'price_usd' => fake()->numberBetween(50, 500),
            'width' => fake()->numberBetween(30, 150),
            'height' => fake()->numberBetween(30, 150),
            'medium' => fake()->randomElement($mediums),
            'year_created' => fake()->year(),
            'status' => 'available',
            'is_featured' => false,
        ];
    }

    /**
     * Indicate that the product is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }

    /**
     * Indicate that the product is sold.
     */
    public function sold(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'sold',
        ]);
    }

    /**
     * Indicate that the product is a print.
     */
    public function print(): static
    {
        return $this->state(fn (array $attributes) => [
            'product_type' => 'print',
        ]);
    }

    /**
     * Indicate that the product is digital.
     */
    public function digital(): static
    {
        return $this->state(fn (array $attributes) => [
            'product_type' => 'digital',
            'price' => fake()->numberBetween(50_000, 500_000),
            'price_usd' => fake()->numberBetween(5, 50),
        ]);
    }
}
