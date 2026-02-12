<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard with statistics.
     */
    public function index(): Response
    {
        $stats = [
            'totalProducts' => Product::count(),
            'totalSold' => Product::where('status', 'sold')->count(),
            'totalUsers' => User::where('role', 'user')->count(),
            'totalCategories' => Category::count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
        ]);
    }
}
