<?php

use App\Models\User;

test('registration screen can be rendered', function () {
    $response = $this->get('/register');

    $response->assertOk();
});

test('new users can register', function () {
    $response = $this->post('/register', [
        'name' => 'Test User',
        'email' => 'testuser1@example.com',
        'password' => 'StrongPass123!',
        'password_confirmation' => 'StrongPass123!',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('home'));
});

test('new users can register with whatsapp and address', function () {
    $response = $this->post('/register', [
        'name' => 'Test User',
        'email' => 'testuser2@example.com',
        'password' => 'StrongPass123!',
        'password_confirmation' => 'StrongPass123!',
        'whatsapp' => '+6281234567890',
        'address' => '123 Test Street',
    ]);

    $this->assertAuthenticated();

    $user = User::where('email', 'testuser2@example.com')->first();
    expect($user->whatsapp)->toBe('+6281234567890');
    expect($user->address)->toBe('123 Test Street');
});

test('whatsapp and address are optional', function () {
    $response = $this->post('/register', [
        'name' => 'Test User',
        'email' => 'testuser3@example.com',
        'password' => 'StrongPass123!',
        'password_confirmation' => 'StrongPass123!',
    ]);

    $this->assertAuthenticated();

    $user = User::where('email', 'testuser3@example.com')->first();
    expect($user->whatsapp)->toBeNull();
    expect($user->address)->toBeNull();
    expect($user->role)->toBe('user');
});
