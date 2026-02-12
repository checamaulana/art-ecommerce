import ImageGallery from '@/components/common/ImageGallery';
import PriceDisplay from '@/components/common/PriceDisplay';
import ProductCard from '@/components/common/ProductCard';
import StatusBadge from '@/components/common/StatusBadge';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import MainLayout from '@/layouts/MainLayout';
import { Product, SharedProps } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ChevronRight, Heart, Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface CatalogShowProps {
  product: Product;
  relatedProducts: Product[];
}

export default function CatalogShow({ product, relatedProducts }: CatalogShowProps) {
  const { t } = useTranslation();
  const { auth } = usePage<SharedProps>().props;
  
  const { post, delete: destroy, processing } = useForm();

  const isInWishlist = auth.user ? product.wishlisted_by?.some(u => u.id === auth.user.id) : false;
  // Note: product.wishlisted_by needs to be eager loaded or passed. 
  // In `CatalogController` I didn't eager load `wishlistedBy`. 
  // I should probably check this on backend and pass `isWishlisted` boolean, or just use `wishlistProducts` shared prop if available (but it's not shared globally).
  // Alternatively, the `WishlistController` toggle returns back, so we can re-fetch.
  // Actually, standard way is to pass `isWishlisted` prop from controller. 
  // Let me update `CatalogController` later to pass this, or for now assume I can check against a list.
  // Better yet, just handle the button click and let the flash message show status, and maybe optimistic UI.
  // For now I will assume the prop `is_wishlisted` is appended or I'll add it to the model/controller.
  // Let's check `Product` model. It has `wishlistedBy`.
  // I'll update `CatalogController.php` to append `is_wishlisted` attribute or just pass it.
  
  // For this step, I will implement the UI. The wishlist button might not reflect initial state correctly without that prop.
  // I'll assume `product.is_wishlisted` exists if I append it, or I'll fix the controller in next step.

  const toggleWishlist = () => {
    if (!auth.user) {
        toast.error("Please login to add to wishlist");
        return;
    }

    post(route('wishlist.store', { product: product.slug }), {
        preserveScroll: true,
        onSuccess: () => {
            // Toast handled by MainLayout flash listener or we can do it here
            // toast.success("Wishlist updated");
        }
    });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  return (
    <MainLayout>
      <Head title={product.title} />

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-muted-foreground mb-8">
            <Link href={route('home')} className="hover:text-foreground">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link href={route('catalog.index')} className="hover:text-foreground">Catalog</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-foreground font-medium truncate max-w-[200px]">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {/* Gallery */}
            <div>
                <ImageGallery images={product.images || []} altTitle={product.title} />
            </div>

            {/* Product Info */}
            <div className="space-y-8">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <Link href={route('catalog.index', { category: product.category?.id })} className="text-sm text-muted-foreground uppercase tracking-wider hover:text-primary">
                            {product.category?.name}
                        </Link>
                        <StatusBadge status={product.status} />
                    </div>
                    <h1 className="font-heading text-4xl font-bold text-foreground mb-2">{product.title}</h1>
                    <div className="flex items-center gap-4">
                        <PriceDisplay price={product.price} priceUsd={product.price_usd} className="text-2xl font-medium" />
                        <span className="text-sm text-muted-foreground capitalize">• {product.product_type}</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                        {product.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-muted-foreground block">{t('product.medium')}</span>
                            <span className="font-medium">{product.medium}</span>
                        </div>
                        <div>
                             <span className="text-muted-foreground block">{t('product.dimensions')}</span>
                             <span className="font-medium">{product.dimensions_formatted}</span>
                        </div>
                         <div>
                             <span className="text-muted-foreground block">{t('product.year')}</span>
                             <span className="font-medium">{product.year_created}</span>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Actions */}
                <div className="space-y-4">
                    <div className="flex gap-4">
                        <WhatsAppButton product={product} size="lg" className="flex-1" />
                         <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-11 w-11"
                            onClick={toggleWishlist}
                            disabled={processing}
                        >
                            <Heart className={product.status === 'sold' ? 'text-muted-foreground' : '' /* We need is_wishlisted prop to style fill */} />
                         </Button>
                         <Button variant="outline" size="icon" className="h-11 w-11" onClick={copyLink}>
                            <Share2 className="h-5 w-5" />
                         </Button>
                    </div>
                    {product.status === 'available' && (
                         <p className="text-xs text-muted-foreground text-center">
                            * Payments are processed securely via WhatsApp / Direct Transfer.
                        </p>
                    )}
                </div>
            </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
            <div className="mt-24">
                <h2 className="font-heading text-2xl font-bold mb-8">{t('product.related')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {relatedProducts.map((related) => (
                        <ProductCard key={related.id} product={related} />
                    ))}
                </div>
            </div>
        )}
      </div>
    </MainLayout>
  );
}
