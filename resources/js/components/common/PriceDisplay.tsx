import { usePage } from '@inertiajs/react';
import { SharedProps } from '@/types';

interface PriceDisplayProps {
  price: number;
  priceUsd?: number;
  className?: string;
}

export default function PriceDisplay({ price, priceUsd, className }: PriceDisplayProps) {
  const { currency } = usePage<SharedProps>().props;

  const displayPrice = currency === 'USD' && priceUsd ? priceUsd : price;
  
  const formattedPrice = new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'id-ID', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(displayPrice);

  return (
    <span className={className}>
      {formattedPrice}
    </span>
  );
}
