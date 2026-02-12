import AdminLayout from '@/layouts/AdminLayout';
import StatsCard from '@/components/admin/StatsCard';
import { Package, ShoppingCart, Users, Tags } from 'lucide-react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface DashboardProps {
    stats: {
        totalProducts: number;
        totalSold: number;
        totalUsers: number;
        totalCategories: number;
    };
}

export default function Dashboard({ stats }: DashboardProps) {
    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Overview of your art gallery</p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Total Products"
                        value={stats.totalProducts}
                        icon={Package}
                        description="All products in catalog"
                    />
                    <StatsCard
                        title="Sold Items"
                        value={stats.totalSold}
                        icon={ShoppingCart}
                        description="Products marked as sold"
                    />
                    <StatsCard
                        title="Registered Users"
                        value={stats.totalUsers}
                        icon={Users}
                        description="User accounts"
                    />
                    <StatsCard
                        title="Categories"
                        value={stats.totalCategories}
                        icon={Tags}
                        description="Product categories"
                    />
                </div>

                {/* Quick Actions */}
                <div className="rounded-lg border bg-card p-6">
                    <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                    <div className="flex flex-wrap gap-4">
                        <Link href={route('admin.products.create')}>
                            <Button>Add New Product</Button>
                        </Link>
                        <Link href={route('admin.products.index')}>
                            <Button variant="outline">Manage Products</Button>
                        </Link>
                        <Link href={route('admin.categories.index')}>
                            <Button variant="outline">Manage Categories</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
