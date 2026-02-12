import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Product } from '@/types';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import PriceDisplay from './PriceDisplay';
import StatusBadge from './StatusBadge';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t } = useTranslation();

  return (
    <Link href={route('catalog.show', product.slug)}>
      <Card className="h-full overflow-hidden transition-all hover:shadow-lg group">
        <div className="aspect-square w-full overflow-hidden bg-muted relative">
          {product.thumbnail ? (
            <img
              src={product.thumbnail}
              alt={product.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
             <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
                No Image
             </div>
          )}
          {product.status === 'sold' && (
             <div className="absolute top-2 right-2">
                 <StatusBadge status="sold" />
             </div>
          )}
           {product.is_featured && (
             <div className="absolute top-2 left-2">
                 <Badge variant="secondary" className="backdrop-blur-sm bg-background/50">
                    {t('product.featured')}
                 </Badge>
             </div>
          )}
        </div>
        
        <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-start gap-2">
                <div>
                     <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
                        {product.category?.name}
                    </p>
                    <h3 className="font-heading font-semibold text-lg leading-tight line-clamp-1 group-hover:text-primary/80 transition-colors">
                        {product.title}
                    </h3>
                </div>
            </div>
        </CardHeader>
        
        <CardContent className="p-4 pt-0">
             <div className="flex justify-between items-center mt-2">
                <PriceDisplay price={product.price} priceUsd={product.price_usd} className="font-medium" />
                <span className="text-xs text-muted-foreground capitalize">{product.product_type}</span>
             </div>
        </CardContent>
      </Card>
    </Link>
  );
}
