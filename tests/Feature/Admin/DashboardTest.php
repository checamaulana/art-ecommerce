<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;

test('dashboard displays stats for admin user', function () {
    $admin = User::factory()->admin()->create();
    $categories = Category::factory()->count(3)->create();
    Product::factory()->for($categories->first())->count(10)->create();
    Product::factory()->for($categories->last())->sold()->count(5)->create();
    User::factory()->count(8)->create(); // Regular users

    actingAs($admin)
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Admin/Dashboard')
            ->where('stats.totalProducts', 15)
            ->where('stats.totalSold', 5)
            ->where('stats.totalUsers', 8)
            ->where('stats.totalCategories', 3)
        );
});

test('dashboard is protected from non-admin users', function () {
    $user = User::factory()->create();

    actingAs($user)
        ->get(route('admin.dashboard'))
        ->assertForbidden();
});

test('dashboard redirects unauthenticated users', function () {
    get(route('admin.dashboard'))
        ->assertRedirect(route('login'));
});
