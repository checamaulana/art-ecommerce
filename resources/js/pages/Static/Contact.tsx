import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MainLayout from '@/layouts/MainLayout';
import { Head } from '@inertiajs/react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Contact() {
  const { t } = useTranslation();

  return (
    <MainLayout>
      <Head title={t('common.contact')} />

      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-2xl mx-auto text-center mb-12">
           <h1 className="font-heading text-4xl font-bold mb-4">{t('common.contact')}</h1>
           <p className="text-muted-foreground text-lg">
             Have questions about an artwork or want to collaborate? Reach out to us.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Get in Touch</CardTitle>
                        <CardDescription>We'd love to hear from you.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-start gap-4">
                            <MapPin className="h-6 w-6 text-primary mt-1" />
                            <div>
                                <h3 className="font-medium">Gallery Location</h3>
                                <p className="text-muted-foreground">
                                    Jl. Seni Rupa No. 123<br />
                                    Jakarta Selatan, 12345<br />
                                    Indonesia
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                             <Phone className="h-6 w-6 text-primary mt-1" />
                             <div>
                                <h3 className="font-medium">Call / WhatsApp</h3>
                                <p className="text-muted-foreground">+62 812 3456 7890</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                             <Mail className="h-6 w-6 text-primary mt-1" />
                             <div>
                                <h3 className="font-medium">Email</h3>
                                <p className="text-muted-foreground">hello@artgallery.com</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Contact Form */}
            <div>
                 <form className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                             <Label htmlFor="name">Name</Label>
                             <Input id="name" placeholder="Your name" />
                        </div>
                         <div className="space-y-2">
                             <Label htmlFor="email">Email</Label>
                             <Input id="email" type="email" placeholder="Your email" />
                        </div>
                         <div className="space-y-2">
                             <Label htmlFor="message">Message</Label>
                             <textarea 
                                id="message" 
                                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                                placeholder="How can we help you?"
                             />
                        </div>
                        <Button type="button" className="w-full">Send Message</Button>
                    </div>
                 </form>
            </div>
        </div>
      </div>
    </MainLayout>
  );
}
