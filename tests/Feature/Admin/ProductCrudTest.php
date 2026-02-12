<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;

beforeEach(function () {
    Storage::fake('public');
    $this->admin = User::factory()->admin()->create();
});

test('admin can view products index', function () {
    $category = Category::factory()->create();
    Product::factory()->count(5)->for($category)->create();

    actingAs($this->admin)
        ->get(route('admin.products.index'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Admin/Products/Index')
            ->has('products.data', 5)
        );
});

test('admin can search products', function () {
    Product::factory()->create(['title' => 'Sunset Painting']);
    Product::factory()->create(['title' => 'Mountain View']);

    actingAs($this->admin)
        ->get(route('admin.products.index', ['search' => 'Sunset']))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.title', 'Sunset Painting')
        );
});

test('admin can view create product page', function () {
    Category::factory()->count(3)->create();

    actingAs($this->admin)
        ->get(route('admin.products.create'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Admin/Products/Create')
            ->has('categories', 3)
        );
});

test('admin can create product with images', function () {
    $category = Category::factory()->create();
    $image = UploadedFile::fake()->image('artwork.jpg');

    actingAs($this->admin)
        ->post(route('admin.products.store'), [
            'category_id' => $category->id,
            'title' => 'New Artwork',
            'description' => 'Beautiful painting',
            'product_type' => 'original',
            'price' => 1000000,
            'width' => 60,
            'height' => 80,
            'medium' => 'Oil on Canvas',
            'year_created' => 2024,
            'status' => 'available',
            'is_featured' => true,
            'images' => [$image],
        ])
        ->assertRedirect(route('admin.products.index'));

    assertDatabaseHas('products', [
        'title' => 'New Artwork',
        'is_featured' => true,
    ]);

    assertDatabaseHas('images', [
        'is_primary' => true,
    ]);
})->skip(fn () => ! extension_loaded('gd'), 'GD extension is not installed.');

test('admin can create print product with print sizes', function () {
    $category = Category::factory()->create();

    actingAs($this->admin)
        ->post(route('admin.products.store'), [
            'category_id' => $category->id,
            'title' => 'Print Artwork',
            'description' => 'Available as print',
            'product_type' => 'print',
            'price' => 500000,
            'width' => 40,
            'height' => 60,
            'medium' => 'Digital Print',
            'year_created' => 2024,
            'print_sizes' => [
                [
                    'size_name' => 'A4',
                    'width' => 21,
                    'height' => 29,
                    'price' => 100000,
                ],
                [
                    'size_name' => 'A3',
                    'width' => 29,
                    'height' => 42,
                    'price' => 200000,
                ],
            ],
        ])
        ->assertRedirect(route('admin.products.index'));

    $product = Product::where('title', 'Print Artwork')->first();
    expect($product->printSizes)->toHaveCount(2);
});

test('admin can view edit product page', function () {
    $product = Product::factory()->create();
    Category::factory()->count(3)->create();

    actingAs($this->admin)
        ->get(route('admin.products.edit', $product))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Admin/Products/Edit')
            ->where('product.id', $product->id)
        );
});

test('admin can update product', function () {
    $product = Product::factory()->create(['title' => 'Old Title']);

    $response = actingAs($this->admin)
        ->put(route('admin.products.update', $product), [
            'category_id' => $product->category_id,
            'title' => 'Updated Title',
            'description' => $product->description,
            'product_type' => $product->product_type,
            'price' => $product->price,
            'width' => $product->width,
            'height' => $product->height,
            'medium' => $product->medium,
            'year_created' => $product->year_created,
            'status' => 'sold',
        ]);

    $product->refresh();

    $response->assertRedirect(route('admin.products.edit', $product));

    assertDatabaseHas('products', [
        'id' => $product->id,
        'title' => 'Updated Title',
        'slug' => 'updated-title',
        'status' => 'sold',
    ]);
});

test('admin can delete product', function () {
    $product = Product::factory()->create();

    actingAs($this->admin)
        ->delete(route('admin.products.destroy', $product))
        ->assertRedirect(route('admin.products.index'));

    assertDatabaseMissing('products', [
        'id' => $product->id,
    ]);
});

test('admin can delete product image', function () {
    $product = Product::factory()->create();
    $image = $product->images()->create([
        'url' => '/storage/test.jpg',
        'is_primary' => false,
        'order' => 1,
    ]);

    actingAs($this->admin)
        ->delete(route('admin.products.images.destroy', [$product, $image]))
        ->assertRedirect();

    assertDatabaseMissing('images', ['id' => $image->id]);
});

test('product validation requires title', function () {
    $category = Category::factory()->create();

    actingAs($this->admin)
        ->post(route('admin.products.store'), [
            'category_id' => $category->id,
            'description' => 'Test',
            'product_type' => 'original',
            'price' => 1000000,
            'width' => 60,
            'height' => 80,
            'medium' => 'Oil',
            'year_created' => 2024,
        ])
        ->assertSessionHasErrors('title');
});

test('non-admin cannot access product management', function () {
    $user = User::factory()->create();

    actingAs($user)
        ->get(route('admin.products.index'))
        ->assertForbidden();
});
