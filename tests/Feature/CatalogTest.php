<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CatalogTest extends TestCase
{
    use RefreshDatabase;

    public function test_catalog_displays_products()
    {
        Product::factory()->count(10)->create();

        $response = $this->get(route('catalog.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Catalog/Index')
            ->has('products.data', 10)
        );
    }

    public function test_catalog_filters_by_category()
    {
        $category1 = Category::factory()->create(['name' => 'Paintings']);
        $category2 = Category::factory()->create(['name' => 'Sculptures']);

        Product::factory()->count(3)->create(['category_id' => $category1->id]);
        Product::factory()->count(2)->create(['category_id' => $category2->id]);

        $response = $this->get(route('catalog.index', ['category' => $category1->id]));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Catalog/Index')
            ->has('products.data', 3)
            ->where('filters.category', (string) $category1->id)
        );
    }

    public function test_catalog_filters_by_type()
    {
        Product::factory()->count(2)->create(['product_type' => 'original']);
        Product::factory()->count(3)->create(['product_type' => 'print']);

        $response = $this->get(route('catalog.index', ['type' => 'original']));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->has('products.data', 2)
            ->where('filters.type', 'original')
        );
    }

    public function test_catalog_filters_by_status()
    {
        Product::factory()->count(2)->create(['status' => 'available']);
        Product::factory()->count(3)->create(['status' => 'sold']);

        $response = $this->get(route('catalog.index', ['status' => 'available']));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->has('products.data', 2)
            ->where('filters.status', 'available')
        );
    }

    public function test_catalog_displays_product_detail()
    {
        $product = Product::factory()->create();

        $response = $this->get(route('catalog.show', $product));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Catalog/Show')
            ->where('product.id', $product->id)
            ->has('relatedProducts')
        );
    }
}
