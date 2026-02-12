<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;

beforeEach(function () {
    $this->admin = User::factory()->admin()->create();
});

test('admin can view categories index', function () {
    Category::factory()->count(5)->create();

    actingAs($this->admin)
        ->get(route('admin.categories.index'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Admin/Categories/Index')
            ->has('categories', 5)
        );
});

test('admin can create category', function () {
    actingAs($this->admin)
        ->post(route('admin.categories.store'), [
            'name' => 'Portraits',
        ])
        ->assertRedirect();

    assertDatabaseHas('categories', [
        'name' => 'Portraits',
        'slug' => 'portraits',
    ]);
});

test('admin can update category', function () {
    $category = Category::factory()->create(['name' => 'Old Name']);

    actingAs($this->admin)
        ->put(route('admin.categories.update', $category), [
            'name' => 'New Name',
        ])
        ->assertRedirect();

    assertDatabaseHas('categories', [
        'id' => $category->id,
        'name' => 'New Name',
        'slug' => 'new-name',
    ]);
});

test('admin can delete empty category', function () {
    $category = Category::factory()->create();

    actingAs($this->admin)
        ->delete(route('admin.categories.destroy', $category))
        ->assertRedirect();

    assertDatabaseMissing('categories', ['id' => $category->id]);
});

test('admin cannot delete category with products', function () {
    $category = Category::factory()->create();
    Product::factory()->for($category)->create();

    actingAs($this->admin)
        ->delete(route('admin.categories.destroy', $category))
        ->assertRedirect()
        ->assertSessionHas('error');

    assertDatabaseHas('categories', ['id' => $category->id]);
});

test('category name must be unique', function () {
    Category::factory()->create(['name' => 'Landscapes']);

    actingAs($this->admin)
        ->post(route('admin.categories.store'), [
            'name' => 'Landscapes',
        ])
        ->assertSessionHasErrors('name');
});

test('category name is required', function () {
    actingAs($this->admin)
        ->post(route('admin.categories.store'), [])
        ->assertSessionHasErrors('name');
});

test('non-admin cannot access category management', function () {
    $user = User::factory()->create();

    actingAs($user)
        ->get(route('admin.categories.index'))
        ->assertForbidden();
});
