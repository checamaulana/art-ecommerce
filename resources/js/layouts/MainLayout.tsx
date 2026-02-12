import { Toaster } from '@/components/ui/sonner';
import { SharedProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Menu, ShoppingBag, User } from 'lucide-react';
import { PropsWithChildren, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitch from '@/components/common/LanguageSwitch';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function MainLayout({ children }: PropsWithChildren) {
  const { auth } = usePage<SharedProps>().props;
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: t('common.home'), href: route('home') },
    { name: t('common.catalog'), href: route('catalog.index') },
    { name: t('common.contact'), href: route('contact') },
  ];

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href={route('home')} className="flex items-center gap-2">
            <span className="font-heading text-2xl font-bold tracking-tight">ART GALLERY</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors hover:text-primary/80"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitch />
            
            {auth.user ? (
              <>
                <Link href={route('wishlist.index')}>
                    <Button variant="ghost" size="icon">
                        <ShoppingBag className="h-5 w-5" />
                        <span className="sr-only">{t('common.wishlist')}</span>
                    </Button>
                </Link>
                <Link href={route('profile.edit')}>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                    <span className="sr-only">{t('common.profile')}</span>
                  </Button>
                </Link>
              </>
            ) : (
                <div className="flex items-center gap-2">
                    <Link href={route('login')}>
                        <Button variant="ghost" size="sm">{t('common.login')}</Button>
                    </Link>
                    <Link href={route('register')}>
                        <Button size="sm">{t('common.register')}</Button>
                    </Link>
                </div>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-6 mt-6">
                    <Link href={route('home')} className="font-heading text-xl font-bold" onClick={() => setIsMobileMenuOpen(false)}>
                        ART GALLERY
                    </Link>
                    <nav className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-lg font-medium hover:text-primary/80"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                        ))}
                    </nav>
                    <div className="flex flex-col gap-4 border-t pt-6">
                         <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">Language</span>
                            <LanguageSwitch />
                         </div>
                        {auth.user ? (
                            <>
                                <Link href={route('wishlist.index')} onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <ShoppingBag className="h-4 w-4" />
                                        {t('common.wishlist')}
                                    </Button>
                                </Link>
                                <Link href={route('profile.edit')} onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <User className="h-4 w-4" />
                                        {t('common.profile')}
                                    </Button>
                                </Link>
                                <Link href={route('logout')} method="post" as="button" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                                     <Button variant="destructive" className="w-full justify-start gap-2">
                                        {t('common.logout')}
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Link href={route('login')} onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button variant="outline" className="w-full">{t('common.login')}</Button>
                                </Link>
                                <Link href={route('register')} onClick={() => setIsMobileMenuOpen(false)}>
                                    <Button className="w-full">{t('common.register')}</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t bg-muted/50 py-12">
        <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-4">
                    <span className="font-heading text-xl font-bold">ART GALLERY</span>
                    <p className="text-sm text-muted-foreground">
                        Curated prints and original artworks for the modern collector.
                    </p>
                </div>
                <div>
                    <h3 className="font-medium mb-4">{t('common.catalog')}</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><Link href={route('catalog.index')} className="hover:text-foreground">All Works</Link></li>
                        <li><Link href={route('catalog.index', { type: 'original' })} className="hover:text-foreground">Originals</Link></li>
                        <li><Link href={route('catalog.index', { type: 'print' })} className="hover:text-foreground">Prints</Link></li>
                    </ul>
                </div>
                 <div>
                    <h3 className="font-medium mb-4">Support</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><Link href={route('contact')} className="hover:text-foreground">{t('common.contact')}</Link></li>
                        <li><Link href={route('faq')} className="hover:text-foreground">FAQ</Link></li>
                        <li><Link href={route('terms')} className="hover:text-foreground">Terms</Link></li>
                        <li><Link href={route('privacy')} className="hover:text-foreground">Privacy</Link></li>
                    </ul>
                </div>
                 <div>
                    <h3 className="font-medium mb-4">Connect</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><a href="#" className="hover:text-foreground">Instagram</a></li>
                        <li><a href="#" className="hover:text-foreground">Twitter</a></li>
                    </ul>
                </div>
            </div>
            <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} Art Gallery. All rights reserved.
            </div>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}
