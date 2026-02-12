import MainLayout from '@/layouts/MainLayout';
import { Head } from '@inertiajs/react';

export default function Privacy() {
  return (
    <MainLayout>
      <Head title="Privacy Policy" />

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 max-w-3xl prose dark:prose-invert">
        <h1 className="font-heading text-4xl font-bold mb-8">Privacy Policy</h1>
        
         <p className="lead text-xl text-muted-foreground mb-8">
            We value your privacy and are committed to protecting your personal data.
        </p>

        <h3>1. Information We Collect</h3>
        <p>We collect information you provide directly to us when you register an account, make a purchase, or contact us.</p>

        <h3>2. How We Use Your Information</h3>
        <p>We use the information we collect to operate, maintain, and provide the features and functionality of the service.</p>

        <h3>3. Sharing of Information</h3>
        <p>We do not share your personal information with third parties except as described in this privacy policy.</p>

        <h3>4. Security</h3>
        <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access.</p>
        
        <p className="mt-8 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </MainLayout>
  );
}
