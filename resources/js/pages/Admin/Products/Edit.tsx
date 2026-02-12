import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Product, Category, Image as ProductImage } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ImageUpload from '@/components/admin/ImageUpload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, X } from 'lucide-react';

interface ProductsEditProps {
    product: Product & {
        images: ProductImage[];
        print_sizes: Array<{
            size_name: string;
            width: number;
            height: number;
            price: number;
            price_usd?: number | null;
        }>;
    };
    categories: Category[];
}

export default function ProductsEdit({ product, categories }: ProductsEditProps) {
    const { data, setData, post, processing, errors } = useForm({
        category_id: product.category_id.toString(),
        title: product.title,
        description: product.description,
        product_type: product.product_type as 'original' | 'print' | 'digital',
        price: product.price.toString(),
        price_usd: product.price_usd?.toString() || '',
        width: product.width.toString(),
        height: product.height.toString(),
        medium: product.medium,
        year_created: product.year_created.toString(),
        status: product.status as 'available' | 'sold',
        is_featured: product.is_featured,
        images: [] as File[],
        print_sizes: (product.print_sizes || []).map((size) => ({
            size_name: size.size_name,
            width: size.width.toString(),
            height: size.height.toString(),
            price: size.price.toString(),
            price_usd: size.price_usd?.toString() || '',
        })),
        _method: 'PUT',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.products.update', { product: product.slug }));
    };

    const handleDeleteImage = (imageId: number) => {
        if (confirm('Are you sure you want to delete this image?')) {
            router.delete(
                route('admin.products.images.destroy', {
                    product: product.slug,
                    image: imageId,
                }),
                {
                preserveScroll: true,
                }
            );
        }
    };

    const addPrintSize = () => {
        setData('print_sizes', [
            ...data.print_sizes,
            { size_name: '', width: '', height: '', price: '', price_usd: '' },
        ]);
    };

    const removePrintSize = (index: number) => {
        setData(
            'print_sizes',
            data.print_sizes.filter((_, i) => i !== index)
        );
    };

    const updatePrintSize = (index: number, field: string, value: string) => {
        const updated = [...data.print_sizes];
        updated[index] = { ...updated[index], [field]: value };
        setData('print_sizes', updated);
    };

    return (
        <AdminLayout>
            <Head title={`Edit ${product.title}`} />

            <div className="space-y-6 max-w-4xl">
                <div className="flex items-center gap-4">
                    <Link href={route('admin.products.index')}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
                        <p className="text-muted-foreground">{product.title}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                />
                                {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
                            </div>

                            <div>
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={4}
                                    required
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive mt-1">{errors.description}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="category_id">Category *</Label>
                                    <Select
                                        value={data.category_id}
                                        onValueChange={(value) => setData('category_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id.toString()}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="product_type">Product Type *</Label>
                                    <Select
                                        value={data.product_type}
                                        onValueChange={(value: 'original' | 'print' | 'digital') =>
                                            setData('product_type', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="original">Original</SelectItem>
                                            <SelectItem value="print">Print</SelectItem>
                                            <SelectItem value="digital">Digital</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="status">Status *</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value: 'available' | 'sold') => setData('status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="available">Available</SelectItem>
                                            <SelectItem value="sold">Sold</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center gap-2 pt-8">
                                    <input
                                        type="checkbox"
                                        id="is_featured"
                                        checked={data.is_featured}
                                        onChange={(e) => setData('is_featured', e.target.checked)}
                                        className="h-4 w-4"
                                    />
                                    <Label htmlFor="is_featured" className="cursor-pointer">
                                        Featured Product
                                    </Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing & Dimensions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pricing & Dimensions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="price">Price (IDR) *</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="price_usd">Price (USD)</Label>
                                    <Input
                                        id="price_usd"
                                        type="number"
                                        value={data.price_usd}
                                        onChange={(e) => setData('price_usd', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="width">Width (cm) *</Label>
                                    <Input
                                        id="width"
                                        type="number"
                                        value={data.width}
                                        onChange={(e) => setData('width', e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="height">Height (cm) *</Label>
                                    <Input
                                        id="height"
                                        type="number"
                                        value={data.height}
                                        onChange={(e) => setData('height', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="medium">Medium *</Label>
                                    <Input
                                        id="medium"
                                        value={data.medium}
                                        onChange={(e) => setData('medium', e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="year_created">Year Created *</Label>
                                    <Input
                                        id="year_created"
                                        type="number"
                                        value={data.year_created}
                                        onChange={(e) => setData('year_created', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Images */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Images</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ImageUpload
                                onUpload={(files) => setData('images', files)}
                                existingImages={product.images}
                                onDelete={handleDeleteImage}
                            />
                        </CardContent>
                    </Card>

                    {/* Print Sizes (for print type) */}
                    {data.product_type === 'print' && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Print Sizes</CardTitle>
                                    <Button type="button" variant="outline" size="sm" onClick={addPrintSize}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Size
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {data.print_sizes.map((size, index) => (
                                    <div key={index} className="flex gap-4 items-start border-b pb-4">
                                        <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-4">
                                            <div>
                                                <Label>Size Name</Label>
                                                <Input
                                                    value={size.size_name}
                                                    onChange={(e) =>
                                                        updatePrintSize(index, 'size_name', e.target.value)
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <Label>Width (cm)</Label>
                                                <Input
                                                    type="number"
                                                    value={size.width}
                                                    onChange={(e) => updatePrintSize(index, 'width', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Label>Height (cm)</Label>
                                                <Input
                                                    type="number"
                                                    value={size.height}
                                                    onChange={(e) => updatePrintSize(index, 'height', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Label>Price (IDR)</Label>
                                                <Input
                                                    type="number"
                                                    value={size.price}
                                                    onChange={(e) => updatePrintSize(index, 'price', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Label>Price (USD)</Label>
                                                <Input
                                                    type="number"
                                                    value={size.price_usd}
                                                    onChange={(e) =>
                                                        updatePrintSize(index, 'price_usd', e.target.value)
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removePrintSize(index)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* Actions */}
                    <div className="flex gap-4">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Product'}
                        </Button>
                        <Link href={route('admin.products.index')}>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
