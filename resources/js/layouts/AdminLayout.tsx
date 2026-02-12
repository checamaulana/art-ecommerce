import { Toaster } from '@/components/ui/sonner';
import { SharedProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, Menu, Package, Tags, Users, Home } from 'lucide-react';
import { PropsWithChildren, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function AdminLayout({ children }: PropsWithChildren) {
    const { auth } = usePage<SharedProps>().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Dashboard', href: route('admin.dashboard'), icon: LayoutDashboard },
        { name: 'Products', href: route('admin.products.index'), icon: Package },
        { name: 'Categories', href: route('admin.categories.index'), icon: Tags },
        { name: 'Users', href: route('admin.users.index'), icon: Users },
    ];

    const Sidebar = () => (
        <div className="flex flex-col gap-4">
            <div className="px-6 py-4">
                <Link href={route('admin.dashboard')} className="flex items-center gap-2">
                    <span className="font-heading text-xl font-bold">Admin Panel</span>
                </Link>
            </div>
            <nav className="flex flex-col gap-1 px-3">
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground"
                    >
                        <link.icon className="h-4 w-4" />
                        {link.name}
                    </Link>
                ))}
            </nav>
            <div className="mt-auto px-3 pb-4">
                <Link
                    href={route('home')}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground border"
                >
                    <Home className="h-4 w-4" />
                    Back to Site
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background">
            {/* Desktop Sidebar */}
            <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r bg-background md:block">
                <Sidebar />
            </aside>

            {/* Main Content */}
            <div className="md:pl-64">
                {/* Header */}
                <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
                    {/* Mobile Menu */}
                    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 p-0">
                            <Sidebar />
                        </SheetContent>
                    </Sheet>

                    <div className="flex-1" />

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback>{auth.user?.name?.[0]?.toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium">{auth.user?.name}</p>
                                    <p className="text-xs text-muted-foreground">{auth.user?.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href={route('profile.edit')}>Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={route('home')}>View Site</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href={route('logout')} method="post" as="button" className="w-full">
                                    Logout
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>

                {/* Page Content */}
                <main className="p-4 sm:p-6 lg:p-8">{children}</main>
            </div>

            <Toaster />
        </div>
    );
}
