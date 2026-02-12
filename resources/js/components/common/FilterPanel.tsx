import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Category } from '@/types';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface FilterPanelProps {
  categories: Category[];
  filters: {
    category?: string;
    type?: string;
    status?: string;
    price_min?: string;
    price_max?: string;
  };
  className?: string;
}

export default function FilterPanel({ categories, filters, className }: FilterPanelProps) {
  const { t } = useTranslation();

  const updateFilter = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    // Remove empty filters
    Object.keys(newFilters).forEach((k) => {
        if (!newFilters[k as keyof typeof newFilters]) {
            delete newFilters[k as keyof typeof newFilters];
        }
    });

    router.get(
      route(route().current() as string),
      newFilters,
      { preserveState: true, preserveScroll: true }
    );
  };

  const handlePriceChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const min = formData.get('price_min') as string;
    const max = formData.get('price_max') as string;

    const newFilters = { ...filters, price_min: min, price_max: max };
     Object.keys(newFilters).forEach((k) => {
        if (!newFilters[k as keyof typeof newFilters]) {
            delete newFilters[k as keyof typeof newFilters];
        }
    });

    router.get(
      route(route().current() as string),
      newFilters,
      { preserveState: true, preserveScroll: true }
    );
  };

  return (
    <div className={className}>
      <h3 className="font-heading font-semibold text-lg mb-4">{t('common.filter')}</h3>
      
      <div className="space-y-6">
        {/* Category */}
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={filters.category || 'all'}
            onValueChange={(val) => updateFilter('category', val === 'all' ? '' : val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name} ({cat.products_count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Type */}
        <div className="space-y-2">
          <Label>Type</Label>
          <Select
            value={filters.type || 'all'}
            onValueChange={(val) => updateFilter('type', val === 'all' ? '' : val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="original">{t('product.original')}</SelectItem>
              <SelectItem value="print">{t('product.print')}</SelectItem>
              <SelectItem value="digital">{t('product.digital')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={filters.status || 'all'}
            onValueChange={(val) => updateFilter('status', val === 'all' ? '' : val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">{t('product.available')}</SelectItem>
              <SelectItem value="sold">{t('product.sold')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <form onSubmit={handlePriceChange} className="space-y-2">
          <Label>{t('product.price')}</Label>
          <div className="flex items-center gap-2">
            <Input
              name="price_min"
              type="number"
              placeholder="Min"
              defaultValue={filters.price_min}
              className="w-full"
            />
            <span className="text-muted-foreground">-</span>
            <Input
              name="price_max"
              type="number"
              placeholder="Max"
              defaultValue={filters.price_max}
              className="w-full"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm" className="w-full mt-2">
            Apply Price
          </Button>
        </form>
        
        {/* Reset Filters */}
        <Button 
            variant="ghost" 
            className="w-full text-muted-foreground"
            onClick={() => router.get(route('catalog.index'))}
        >
            Reset Filters
        </Button>
      </div>
    </div>
  );
}
