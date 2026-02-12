import ProductCard from '@/components/common/ProductCard';
import { Button } from '@/components/ui/button';
import MainLayout from '@/layouts/MainLayout';
import { Product } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface WishlistIndexProps {
  wishlistProducts: Product[];
}

export default function WishlistIndex({ wishlistProducts }: WishlistIndexProps) {
  const { t } = useTranslation();

  return (
    <MainLayout>
      <Head title={t('common.wishlist')} />

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <h1 className="font-heading text-3xl font-bold mb-8">{t('common.wishlist')}</h1>

        {wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {wishlistProducts.map((product) => (
               <div key={product.id} className="relative group">
                   <ProductCard product={product} />
                   <Link 
                        href={route('wishlist.destroy', product.id)} 
                        method="delete" 
                        as="button"
                        className="absolute top-2 right-2 z-10 p-1.5 bg-background/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                    >
                        <span className="sr-only">Remove</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                   </Link>
               </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl bg-muted/30">
            <h2 className="text-xl font-medium mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">Start collecting artworks you love.</p>
            <Link href={route('catalog.index')}>
              <Button>Explore Catalog</Button>
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
