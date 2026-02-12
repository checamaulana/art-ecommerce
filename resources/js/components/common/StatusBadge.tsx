import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface StatusBadgeProps {
  status: 'available' | 'sold';
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const { t } = useTranslation();
  
  const isSold = status === 'sold';
  
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        isSold 
          ? "bg-destructive/10 text-destructive border border-destructive/20" 
          : "bg-green-500/10 text-green-700 border border-green-500/20 dark:text-green-400",
        className
      )}
    >
      {isSold ? t('product.sold') : t('product.available')}
    </span>
  );
}
