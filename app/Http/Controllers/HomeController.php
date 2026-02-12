<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Display the homepage with featured products.
     */
    public function index(): Response
    {
        $featuredProducts = Product::query()
            ->with(['category', 'primaryImage', 'images'])
            ->featured()
            ->available()
            ->latest()
            ->take(6)
            ->get();

        return Inertia::render('Home', [
            'featuredProducts' => $featuredProducts,
        ]);
    }
}
