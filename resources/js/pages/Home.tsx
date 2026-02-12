import ProductCard from '@/components/common/ProductCard';
import MainLayout from '@/layouts/MainLayout';
import { Product } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

interface HomeProps {
  featuredProducts: Product[];
}

export default function Home({ featuredProducts }: HomeProps) {
  const { t } = useTranslation();

  return (
    <MainLayout>
      <Head title={t('common.home')} />

      {/* Hero Section */}
      <section className="relative bg-muted/30 py-20 md:py-32 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-2xl space-y-6">
            <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-6xl text-primary">
              Discover Unique Art for Your Space
            </h1>
            <p className="text-xl text-muted-foreground">
              Curated collection of originals, limited edition prints, and digital artworks from emerging artists.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href={route('catalog.index')}>
                <Button size="lg" className="rounded-full px-8">
                  Check Catalog
                </Button>
              </Link>
              <Link href={route('contact')}>
                <Button variant="outline" size="lg" className="rounded-full px-8">
                    Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 -z-10 h-full w-1/2 bg-gradient-to-l from-primary/5 to-transparent opacity-50 blur-3xl" />
        <div className="absolute bottom-0 left-0 -z-10 h-1/2 w-1/2 bg-gradient-to-tr from-secondary/5 to-transparent opacity-50 blur-3xl" />
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-8 md:mb-12">
            <div>
              <h2 className="font-heading text-3xl font-bold">{t('product.featured')}</h2>
              <p className="text-muted-foreground mt-2">Hand-picked selections just for you</p>
            </div>
            <Link href={route('catalog.index')}>
              <Button variant="link" className="hidden md:inline-flex">
                View All Works &rarr;
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link href={route('catalog.index')}>
                <Button variant="outline" className="w-full">
                    View All Works
                </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About / Manifesto Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
          <h2 className="font-heading text-3xl font-bold mb-6">Art for Everyone</h2>
          <p className="text-lg md:text-xl leading-relaxed opacity-90">
            We believe that art should be accessible, affordable, and deeply personal. Our mission is to connect talented artists with collectors who value originality and craftsmanship. Whether you're looking for a digital masterpiece or a traditional oil painting, you'll find it here.
          </p>
        </div>
      </section>
    </MainLayout>
  );
}
