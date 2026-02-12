import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MainLayout from '@/layouts/MainLayout';
import { User } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface ProfileEditProps {
  user: User;
}

export default function ProfileEdit({ user }: ProfileEditProps) {
  const { t } = useTranslation();
  
  const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
    name: user.name,
    email: user.email,
    whatsapp: user.whatsapp || '',
    address: user.address || '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    patch(route('profile.update'));
  };

  return (
    <MainLayout>
      <Head title={t('common.profile')} />

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-2xl">
        <h1 className="font-heading text-3xl font-bold mb-8">{t('common.profile')}</h1>

        <Card>
            <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your contact information and delivery address.</CardDescription>
            </CardHeader>
            <form onSubmit={submit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">{t('auth.name')}</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">{t('auth.email')}</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                         {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="whatsapp">{t('auth.whatsapp')}</Label>
                        <Input
                            id="whatsapp"
                            value={data.whatsapp}
                            onChange={(e) => setData('whatsapp', e.target.value)}
                            placeholder="e.g. 628123456789"
                        />
                         {errors.whatsapp && <p className="text-sm text-destructive">{errors.whatsapp}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">{t('auth.address')}</Label>
                        <textarea
                            id="address"
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                        />
                         {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                    {recentlySuccessful && (
                        <p className="text-sm text-green-600">Saved successfully.</p>
                    )}
                    <Button type="submit" disabled={processing} className="ml-auto">
                        Save Changes
                    </Button>
                </CardFooter>
            </form>
        </Card>
      </div>
    </MainLayout>
  );
}
