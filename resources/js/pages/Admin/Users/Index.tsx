import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { User, PaginatedData } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Eye } from 'lucide-react';
import { useState } from 'react';

interface UsersIndexProps {
    users: PaginatedData<User>;
    filters: {
        search?: string;
    };
}

export default function UsersIndex({ users, filters }: UsersIndexProps) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = () => {
        router.get(route('admin.users.index'), { search }, { preserveState: true });
    };

    return (
        <AdminLayout>
            <Head title="Manage Users" />

            <div className="space-y-6 max-w-4xl">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                    <p className="text-muted-foreground">View registered user accounts</p>
                </div>

                {/* Search */}
                <div className="flex gap-2 max-w-md">
                    <Input
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button onClick={handleSearch}>
                        <Search className="h-4 w-4" />
                    </Button>
                </div>

                {/* Users List */}
                <div className="space-y-3">
                    {users.data.map((user) => (
                        <Card key={user.id}>
                            <CardContent className="p-4 flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="font-semibold">{user.name}</h3>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                    {user.whatsapp && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            WhatsApp: {user.whatsapp}
                                        </p>
                                    )}
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Joined: {new Date(user.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <Link href={route('admin.users.show', user.id)}>
                                    <Button size="sm" variant="outline">
                                        <Eye className="h-4 w-4 mr-2" />
                                        View
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Pagination */}
                {users.links.length > 3 && (
                    <div className="flex justify-center gap-1">
                        {users.links.map((link, index) => (
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
