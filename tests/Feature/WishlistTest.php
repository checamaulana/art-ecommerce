<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class WishlistTest extends TestCase
{
    use RefreshDatabase;

    public function test_wishlist_page_is_protected()
    {
        $response = $this->get(route('wishlist.index'));
        $response->assertRedirect(route('login'));
    }

    public function test_user_can_view_wishlist()
    {
        $user = User::factory()->create();
        $products = Product::factory()->count(3)->create();
        $user->wishlistProducts()->attach($products);

        $response = $this->actingAs($user)->get(route('wishlist.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Wishlist/Index')
            ->has('wishlistProducts', 3)
        );
    }

    public function test_user_can_add_to_wishlist()
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();

        $response = $this->actingAs($user)
            ->from('/catalog')
            ->post(route('wishlist.store', $product));

        $response->assertRedirect('/catalog');
        $this->assertDatabaseHas('wishlists', [
            'user_id' => $user->id,
            'product_id' => $product->id,
        ]);
    }

    public function test_user_can_remove_from_wishlist()
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();
        $user->wishlistProducts()->attach($product);

        $response = $this->actingAs($user)
            ->from('/wishlist')
            ->delete(route('wishlist.destroy', $product));

        $response->assertRedirect('/wishlist');
        $this->assertDatabaseMissing('wishlists', [
            'user_id' => $user->id,
            'product_id' => $product->id,
        ]);
    }

    public function test_guest_cannot_add_to_wishlist()
    {
        $product = Product::factory()->create();

        $response = $this->post(route('wishlist.store', $product));

        $response->assertRedirect(route('login'));
    }
}
