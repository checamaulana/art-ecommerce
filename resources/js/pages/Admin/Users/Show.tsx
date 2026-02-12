import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, Heart, Mail, MapPin, Phone } from 'lucide-react';

interface WishlistProduct {
    id: number;
    title: string;
    slug: string;
    status: 'available' | 'sold';
}

interface WishlistItem {
    id: number;
    product_id: number;
    created_at: string;
    product?: WishlistProduct | null;
}

interface UserDetails {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    whatsapp?: string | null;
    address?: string | null;
    role: 'admin' | 'user';
    created_at: string;
    updated_at: string;
    wishlists: WishlistItem[];
}

interface UserShowProps {
    user: UserDetails;
}

function formatDate(value: string | null): string {
    if (!value) {
        return 'Not verified';
    }

    return new Date(value).toLocaleDateString();
}

export default function UsersShow({ user }: UserShowProps) {
    return (
        <AdminLayout>
            <Head title={`User Details - ${user.name}`} />

            <div className="mx-auto max-w-5xl space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
                        <p className="text-muted-foreground">Detailed information for {user.name}</p>
                    </div>
                    <Link href={route('admin.users.index')}>
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Users
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between gap-3 rounded-lg border p-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Role</p>
                                    <p className="font-medium">{user.role}</p>
                                </div>
                                <Badge variant={user.email_verified_at ? 'default' : 'secondary'}>
                                    {user.email_verified_at ? 'Verified Email' : 'Unverified Email'}
                                </Badge>
                            </div>

                            <div className="space-y-3 rounded-lg border p-4">
                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{user.email}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{user.whatsapp || 'Not provided'}</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{user.address || 'Not provided'}</span>
                                </div>
                            </div>

                            <div className="space-y-3 rounded-lg border p-4">
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">Joined: {formatDate(user.created_at)}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">Email Verified: {formatDate(user.email_verified_at)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Heart className="h-4 w-4" />
                                Wishlist
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="rounded-lg border p-3">
                                <p className="text-2xl font-semibold">{user.wishlists.length}</p>
                                <p className="text-sm text-muted-foreground">Saved products</p>
                            </div>

                            {user.wishlists.length > 0 ? (
                                <div className="space-y-2">
                                    {user.wishlists.map((wishlist) => (
                                        <div key={wishlist.id} className="rounded-lg border p-3">
                                            <p className="text-sm font-medium">
                                                {wishlist.product?.title || 'Product not available'}
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Added: {formatDate(wishlist.created_at)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No wishlist items yet.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
