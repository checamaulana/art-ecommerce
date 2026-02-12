import MainLayout from '@/layouts/MainLayout';
import { Head } from '@inertiajs/react';

export default function Terms() {
  return (
    <MainLayout>
      <Head title="Terms of Service" />

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 max-w-3xl prose dark:prose-invert">
        <h1 className="font-heading text-4xl font-bold mb-8">Terms of Service</h1>
        
        <p className="lead text-xl text-muted-foreground mb-8">
            Please read these terms and conditions carefully before using our service.
        </p>

        <h3>1. Acceptance of Terms</h3>
        <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>

        <h3>2. Intellectual Property</h3>
        <p>All content included on this site, such as text, graphics, logos, images, is the property of Art Gallery or its content suppliers and protected by international copyright laws.</p>

        <h3>3. Product Descriptions</h3>
        <p>We attempt to be as accurate as possible. However, we do not warrant that product descriptions or other content of this site is accurate, complete, reliable, current, or error-free.</p>

        <h3>4. Limitation of Liability</h3>
        <p>In no event shall Art Gallery be liable for any direct, indirect, incidental, special, exemplary, or consequential damages.</p>
        
        <p className="mt-8 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </MainLayout>
  );
}
