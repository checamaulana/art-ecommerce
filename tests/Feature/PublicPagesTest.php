<?php

namespace Tests\Feature;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PublicPagesTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_page_is_accessible()
    {
        $featuredProducts = Product::factory()->count(3)->featured()->create();

        $response = $this->get(route('home'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Home')
            ->has('featuredProducts', 3)
        );
    }

    public function test_catalog_index_is_accessible()
    {
        Product::factory()->count(5)->create();

        $response = $this->get(route('catalog.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Catalog/Index')
            ->has('products.data', 5)
            ->has('categories')
            ->has('filters')
        );
    }

    public function test_static_pages_are_accessible()
    {
        $pages = [
            'contact' => 'Static/Contact',
            'faq' => 'Static/Faq',
            'terms' => 'Static/Terms',
            'privacy' => 'Static/Privacy',
        ];

        foreach ($pages as $route => $component) {
            $response = $this->get(route($route));

            $response->assertStatus(200);
            $response->assertInertia(fn (Assert $page) => $page
                ->component($component)
            );
        }
    }
}
