<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WishlistController extends Controller
{
    /**
     * Display the user's wishlist.
     */
    public function index(Request $request): Response
    {
        $wishlistProducts = $request->user()
            ->wishlistProducts()
            ->with(['category', 'primaryImage', 'images'])
            ->latest('wishlists.created_at')
            ->get();

        return Inertia::render('Wishlist/Index', [
            'wishlistProducts' => $wishlistProducts,
        ]);
    }

    /**
     * Add a product to the wishlist (or remove if already exists).
     */
    public function store(Request $request, Product $product): RedirectResponse
    {
        $user = $request->user();

        // Toggle wishlist (attach if not exists, detach if exists)
        if ($user->wishlistProducts()->where('product_id', $product->id)->exists()) {
            $user->wishlistProducts()->detach($product->id);

            return back()->with('success', 'Product removed from wishlist.');
        }

        $user->wishlistProducts()->attach($product->id);

        return back()->with('success', 'Product added to wishlist.');
    }

    /**
     * Remove a product from the wishlist.
     */
    public function destroy(Request $request, Product $product): RedirectResponse
    {
        $request->user()->wishlistProducts()->detach($product->id);

        return back()->with('success', 'Product removed from wishlist.');
    }
}
