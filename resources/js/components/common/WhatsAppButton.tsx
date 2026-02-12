import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface WhatsAppButtonProps {
  product: Product;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export default function WhatsAppButton({ product, variant = 'default', size = 'default', className }: WhatsAppButtonProps) {
  const { t, i18n } = useTranslation();

  const handleClick = () => {
    const baseUrl = window.location.origin;
    const productUrl = `${baseUrl}/catalog/${product.slug}`;
    const message = i18n.language === 'id' 
      ? `Halo, saya tertarik dengan karya "${product.title}" (${productUrl}). Apakah masih tersedia?`
      : `Hello, I am interested in "${product.title}" (${productUrl}). Is it still available?`;

    const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button variant={variant} size={size} className={className} onClick={handleClick}>
      <MessageCircle className="mr-2 h-4 w-4" />
      {t('product.buy_whatsapp')}
    </Button>
  );
}
