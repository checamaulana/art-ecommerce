<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Category;
use App\Models\Image;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Product::query()
            ->with(['category', 'primaryImage', 'images']);

        // Search
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%'.$request->search.'%')
                    ->orWhere('description', 'like', '%'.$request->search.'%');
            });
        }

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

        // Sort
        $query->latest();

        $products = $query->paginate(15)->withQueryString();

        $categories = Category::orderBy('name')->get();

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => [
                'search' => $request->search,
                'category' => $request->category,
                'type' => $request->type,
                'status' => $request->status,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $categories = Category::orderBy('name')->get();

        return Inertia::render('Admin/Products/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request): RedirectResponse
    {
        $data = $request->validated();

        // Create product
        $product = Product::create([
            'category_id' => $data['category_id'],
            'title' => $data['title'],
            'description' => $data['description'],
            'product_type' => $data['product_type'],
            'price' => $data['price'],
            'price_usd' => $data['price_usd'] ?? null,
            'width' => $data['width'],
            'height' => $data['height'],
            'medium' => $data['medium'],
            'year_created' => $data['year_created'],
            'status' => $data['status'] ?? 'available',
            'is_featured' => $data['is_featured'] ?? false,
        ]);

        // Handle image uploads
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $file) {
                $path = $file->store('products', 'public');
                $product->images()->create([
                    'url' => Storage::url($path),
                    'is_primary' => $index === 0,
                    'order' => $index,
                ]);
            }
        }

        // Handle print sizes for print type
        if ($product->product_type === 'print' && isset($data['print_sizes'])) {
            foreach ($data['print_sizes'] as $size) {
                $product->printSizes()->create([
                    'size_name' => $size['size_name'],
                    'width' => $size['width'],
                    'height' => $size['height'],
                    'price' => $size['price'],
                    'price_usd' => $size['price_usd'] ?? null,
                ]);
            }
        }

        return redirect()->route('admin.products.index')
            ->with('success', 'Product created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product): Response
    {
        $product->load(['category', 'images', 'printSizes']);
        $categories = Category::orderBy('name')->get();

        return Inertia::render('Admin/Products/Edit', [
            'product' => $product,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $data = $request->validated();

        $product->update([
            'category_id' => $data['category_id'],
            'title' => $data['title'],
            'description' => $data['description'],
            'product_type' => $data['product_type'],
            'price' => $data['price'],
            'price_usd' => $data['price_usd'] ?? null,
            'width' => $data['width'],
            'height' => $data['height'],
            'medium' => $data['medium'],
            'year_created' => $data['year_created'],
            'status' => $data['status'] ?? 'available',
            'is_featured' => $data['is_featured'] ?? false,
        ]);

        // Handle new image uploads
        if ($request->hasFile('images')) {
            $existingCount = $product->images()->count();
            foreach ($request->file('images') as $index => $file) {
                $path = $file->store('products', 'public');
                $product->images()->create([
                    'url' => Storage::url($path),
                    'is_primary' => $existingCount === 0 && $index === 0,
                    'order' => $existingCount + $index,
                ]);
            }
        }

        // Sync print sizes
        if (isset($data['print_sizes'])) {
            $product->printSizes()->delete();
            foreach ($data['print_sizes'] as $size) {
                $product->printSizes()->create([
                    'size_name' => $size['size_name'],
                    'width' => $size['width'],
                    'height' => $size['height'],
                    'price' => $size['price'],
                    'price_usd' => $size['price_usd'] ?? null,
                ]);
            }
        }

        return redirect()->route('admin.products.edit', $product)
            ->with('success', 'Product updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product): RedirectResponse
    {
        $product->load('images');

        foreach ($product->images as $image) {
            $path = str_replace('/storage/', '', $image->url);
            if (Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
            }
        }

        $product->forceDelete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Product deleted successfully.');
    }

    /**
     * Upload additional images for a product.
     */
    public function uploadImages(Request $request, Product $product): RedirectResponse
    {
        $request->validate([
            'images' => ['required', 'array'],
            'images.*' => ['required', 'image', 'max:5120'], // Max 5MB
        ]);

        $existingCount = $product->images()->count();

        foreach ($request->file('images') as $index => $file) {
            $path = $file->store('products', 'public');
            $product->images()->create([
                'url' => Storage::url($path),
                'is_primary' => $existingCount === 0 && $index === 0,
                'order' => $existingCount + $index,
            ]);
        }

        return back()->with('success', 'Images uploaded successfully.');
    }

    /**
     * Delete a specific image.
     */
    public function deleteImage(Product $product, Image $image): RedirectResponse
    {
        if ($image->product_id !== $product->id) {
            abort(403, 'Unauthorized action.');
        }

        // Delete file from storage
        $path = str_replace('/storage/', '', $image->url);
        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }

        $image->delete();

        // If this was the primary image, set another as primary
        if ($image->is_primary && $product->images()->count() > 0) {
            $product->images()->first()->update(['is_primary' => true]);
        }

        return back()->with('success', 'Image deleted successfully.');
    }
}
