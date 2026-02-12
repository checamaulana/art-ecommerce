import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { router } from '@inertiajs/react';
import { ArrowDownAZ, ArrowUpAZ, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SortDropdownProps {
  currentSort: string;
}

export default function SortDropdown({ currentSort }: SortDropdownProps) {
  const { t } = useTranslation();

  const handleSort = (sort: string) => {
    router.get(
      route(route().current() as string),
      { ...route().params, sort },
      { preserveState: true, preserveScroll: true }
    );
  };

  const getLabel = (sort: string) => {
    switch (sort) {
      case 'price_low':
        return 'Price: Low to High';
      case 'price_high':
        return 'Price: High to Low';
      default:
        return 'Newest';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[180px] justify-between">
          <span>{getLabel(currentSort)}</span>
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuItem onClick={() => handleSort('newest')}>
          Newest
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSort('price_low')}>
          <ArrowDownAZ className="mr-2 h-4 w-4" />
          Price: Low to High
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSort('price_high')}>
          <ArrowUpAZ className="mr-2 h-4 w-4" />
          Price: High to Low
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
