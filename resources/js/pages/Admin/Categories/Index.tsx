import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

interface CategoriesIndexProps {
    categories: Array<Category & { products_count: number }>;
}

export default function CategoriesIndex({ categories }: CategoriesIndexProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [name, setName] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(
            route('admin.categories.store'),
            { name },
            {
                onSuccess: () => {
                    setName('');
                    setIsCreateOpen(false);
                },
            }
        );
    };

    const handleEdit = (category: Category) => {
        setEditingId(category.id);
        setName(category.name);
        setIsEditOpen(true);
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingId) return;

        router.put(
            route('admin.categories.update', editingId),
            { name },
            {
                onSuccess: () => {
                    setName('');
                    setEditingId(null);
                    setIsEditOpen(false);
                },
            }
        );
    };

    const handleDelete = (categoryId: number, productsCount: number) => {
        if (productsCount > 0) {
            alert('Cannot delete category with existing products');
            return;
        }

        if (confirm('Are you sure you want to delete this category?')) {
            router.delete(route('admin.categories.destroy', categoryId));
        }
    };

    return (
        <AdminLayout>
            <Head title="Manage Categories" />

            <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                        <p className="text-muted-foreground">Manage product categories</p>
                    </div>

                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Category
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <form onSubmit={handleCreate}>
                                <DialogHeader>
                                    <DialogTitle>Create New Category</DialogTitle>
                                    <DialogDescription>
                                        Add a new category for organizing your products.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                    <Label htmlFor="name">Category Name</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g., Landscapes"
                                        required
                                    />
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Create Category</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                                >
                                    <div>
                                        <h3 className="font-medium">{category.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {category.products_count} product{category.products_count !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="icon" variant="outline" onClick={() => handleEdit(category)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            onClick={() => handleDelete(category.id, category.products_count)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Edit Dialog */}
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent>
                        <form onSubmit={handleUpdate}>
                            <DialogHeader>
                                <DialogTitle>Edit Category</DialogTitle>
                                <DialogDescription>Update the category name.</DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                <Label htmlFor="edit-name">Category Name</Label>
                                <Input
                                    id="edit-name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit">Update Category</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
