import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ImageUpload from '@/components/admin/ImageUpload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, X } from 'lucide-react';

interface ProductsCreateProps {
    categories: Category[];
}

export default function ProductsCreate({ categories }: ProductsCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        category_id: '',
        title: '',
        description: '',
        product_type: 'original' as 'original' | 'print' | 'digital',
        price: '',
        price_usd: '',
        width: '',
        height: '',
        medium: '',
        year_created: '',
        status: 'available' as 'available' | 'sold',
        is_featured: false,
        images: [] as File[],
        print_sizes: [] as Array<{
            size_name: string;
            width: string;
            height: string;
            price: string;
            price_usd: string;
        }>,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.products.store'));
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
            <Head title="Add New Product" />

            <div className="space-y-6 max-w-4xl">
                <div className="flex items-center gap-4">
                    <Link href={route('admin.products.index')}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
                        <p className="text-muted-foreground">Create a new product for your catalog</p>
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
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id.toString()}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.category_id && (
                                        <p className="text-sm text-destructive mt-1">{errors.category_id}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="product_type">Product Type *</Label>
                                    <Select
                                        value={data.product_type}
                                        onValueChange={(value: any) => setData('product_type', value)}
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
                                        placeholder="e.g., Oil on Canvas"
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
                            <ImageUpload onUpload={(files) => setData('images', files)} />
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
                                                    placeholder="A4, A3, etc."
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
                            {processing ? 'Creating...' : 'Create Product'}
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
