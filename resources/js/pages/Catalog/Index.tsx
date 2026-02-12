import FilterPanel from '@/components/common/FilterPanel';
import Pagination from '@/components/common/Pagination';
import ProductCard from '@/components/common/ProductCard';
import SortDropdown from '@/components/common/SortDropdown';
import MainLayout from '@/layouts/MainLayout';
import { Category, PaginatedData, Product } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface CatalogIndexProps {
  products: PaginatedData<Product>;
  categories: Category[];
  filters: {
    category?: string;
    type?: string;
    status?: string;
    price_min?: string;
    price_max?: string;
    sort: string;
  };
}

export default function CatalogIndex({ products, categories, filters }: CatalogIndexProps) {
  const { t } = useTranslation();

  return (
    <MainLayout>
      <Head title={t('common.catalog')} />

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <FilterPanel categories={categories} filters={filters} />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-heading text-3xl font-bold">{t('common.catalog')}</h1>
              <div className="flex items-center gap-2">
                 {/* Mobile Filter Toggle */}
                 <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="md:hidden">
                            <Filter className="mr-2 h-4 w-4" />
                            Filters
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <FilterPanel categories={categories} filters={filters} className="mt-6" />
                    </SheetContent>
                 </Sheet>

                <SortDropdown currentSort={filters.sort} />
              </div>
            </div>

            {products.data.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.data.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                <Pagination links={products.links} />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-lg">
                <p className="text-lg font-medium text-muted-foreground mb-2">
                  No products found
                </p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your filters or search criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
