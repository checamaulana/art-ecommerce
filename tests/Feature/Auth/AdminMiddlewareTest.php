<?php

use App\Models\User;

test('admin can access admin routes', function () {
    $admin = User::factory()->admin()->create();

    // Create a test route for admin
    Route::middleware(['auth', 'admin'])->get('/admin/test', function () {
        return response()->json(['success' => true]);
    });

    $response = $this->actingAs($admin)->get('/admin/test');

    $response->assertOk();
    $response->assertJson(['success' => true]);
});

test('regular user cannot access admin routes', function () {
    $user = User::factory()->create();

    // Create a test route for admin
    Route::middleware(['auth', 'admin'])->get('/admin/test', function () {
        return response()->json(['success' => true]);
    });

    $response = $this->actingAs($user)->get('/admin/test');

    $response->assertForbidden();
});

test('guest cannot access admin routes', function () {
    // Create a test route for admin
    Route::middleware(['auth', 'admin'])->get('/admin/test', function () {
        return response()->json(['success' => true]);
    });

    $response = $this->get('/admin/test');

    $response->assertRedirect(route('login'));
});
