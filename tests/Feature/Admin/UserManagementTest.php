<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->admin = User::factory()->admin()->create();
});

test('admin can view users index', function () {
    User::factory()->count(10)->create();

    actingAs($this->admin)
        ->get(route('admin.users.index'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Admin/Users/Index')
            ->has('users.data', 10)
        );
});

test('admin can search users', function () {
    User::factory()->create(['name' => 'John Doe']);
    User::factory()->create(['name' => 'Jane Smith']);

    actingAs($this->admin)
        ->get(route('admin.users.index', ['search' => 'John']))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->has('users.data', 1)
            ->where('users.data.0.name', 'John Doe')
        );
});

test('admin can view user details', function () {
    $user = User::factory()->create();

    actingAs($this->admin)
        ->get(route('admin.users.show', $user))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Admin/Users/Show')
            ->where('user.id', $user->id)
        );
});

test('users index only shows non-admin users', function () {
    User::factory()->admin()->count(3)->create();
    User::factory()->count(5)->create(); // Regular users

    actingAs($this->admin)
        ->get(route('admin.users.index'))
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->has('users.data', 5)
        );
});

test('non-admin cannot access user management', function () {
    $user = User::factory()->create();

    actingAs($user)
        ->get(route('admin.users.index'))
        ->assertForbidden();
});
