import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Product, Category, PaginatedData } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface ProductsIndexProps {
    products: PaginatedData<Product>;
    categories: Category[];
    filters: {
        search?: string;
        category?: string;
        type?: string;
        status?: string;
    };
}

export default function ProductsIndex({ products, categories, filters }: ProductsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = () => {
        router.get(route('admin.products.index'), { search }, { preserveState: true });
    };

    const handleDelete = (productSlug: string) => {
        if (confirm('Are you sure you want to delete this product?')) {
            router.delete(route('admin.products.destroy', { product: productSlug }), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Manage Products" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                        <p className="text-muted-foreground">Manage your product catalog</p>
                    </div>
                    <Link href={route('admin.products.create')}>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Product
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex gap-4 flex-wrap">
                    <div className="flex-1 min-w-[200px]">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <Button onClick={handleSearch}>
                                <Search className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid gap-4">
                    {products.data.map((product) => (
                        <div
                            key={product.id}
                            className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                            <div className="w-full md:w-32 h-32 flex-shrink-0">
                                {product.thumbnail ? (
                                    <img
                                        src={product.thumbnail}
                                        alt={product.title}
                                        className="w-full h-full object-cover rounded"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-muted rounded flex items-center justify-center">
                                        No Image
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="font-semibold text-lg truncate">{product.title}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {product.description}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <Link href={route('admin.products.edit', { product: product.slug })}>
                                            <Button size="icon" variant="outline">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => handleDelete(product.slug)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    <Badge variant="secondary">{product.category?.name}</Badge>
                                    <Badge variant={product.status === 'available' ? 'default' : 'secondary'}>
                                        {product.status}
                                    </Badge>
                                    <Badge variant="outline">{product.product_type}</Badge>
                                    <span className="text-sm font-medium">{product.price_formatted}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {products.links.length > 3 && (
                    <div className="flex justify-center gap-1">
                        {products.links.map((link, index) => (
                            <Button
                                key={index}
                                size="sm"
                                variant={link.active ? 'default' : 'outline'}
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
