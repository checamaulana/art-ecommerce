<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    /**
     * Display a listing of products with filters.
     */
    public function index(Request $request): Response
    {
        $query = Product::query()
            ->with(['category', 'primaryImage', 'images']);

        // Filter by category
        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }

        // Filter by product type
        if ($request->filled('type')) {
            $query->where('product_type', $request->type);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by price range
        if ($request->filled('price_min')) {
            $query->where('price', '>=', $request->price_min);
        }

        if ($request->filled('price_max')) {
            $query->where('price', '<=', $request->price_max);
        }

        // Sorting
        $sortBy = $request->get('sort', 'newest');
        match ($sortBy) {
            'price_low' => $query->orderBy('price', 'asc'),
            'price_high' => $query->orderBy('price', 'desc'),
            default => $query->latest(),
        };

        // Pagination
        $products = $query->paginate(12)->withQueryString();

        // Get all categories for filter
        $categories = Category::query()
            ->withCount('products')
            ->orderBy('name')
            ->get();

        return Inertia::render('Catalog/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => [
                'category' => $request->category,
                'type' => $request->type,
                'status' => $request->status,
                'price_min' => $request->price_min,
                'price_max' => $request->price_max,
                'sort' => $sortBy,
            ],
        ]);
    }

    /**
     * Display the specified product.
     */
    public function show(Product $product): Response
    {
        $product->load(['category', 'images', 'printSizes']);

        // Get related products (same category, different product)
        $relatedProducts = Product::query()
            ->with(['category', 'primaryImage'])
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->available()
            ->take(4)
            ->get();

        return Inertia::render('Catalog/Show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }
}
