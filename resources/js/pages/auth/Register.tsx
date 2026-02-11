import { FormEvent } from 'react';
import { useForm, Link } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        whatsapp: '',
        address: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <GuestLayout title="Register">
            <div className="space-y-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Create Account</h2>
                    <p className="text-muted-foreground mt-2">
                        Join us to explore beautiful artworks
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoFocus
                            placeholder="John Doe"
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            placeholder="[email protected]"
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">{errors.email}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                        {errors.password && (
                            <p className="text-sm text-destructive">{errors.password}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <Label htmlFor="password_confirmation">Confirm Password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                        {errors.password_confirmation && (
                            <p className="text-sm text-destructive">{errors.password_confirmation}</p>
                        )}
                    </div>

                    {/* WhatsApp (Optional) */}
                    <div className="space-y-2">
                        <Label htmlFor="whatsapp">WhatsApp Number <span className="text-muted-foreground">(Optional)</span></Label>
                        <Input
                            id="whatsapp"
                            type="tel"
                            value={data.whatsapp}
                            onChange={(e) => setData('whatsapp', e.target.value)}
                            placeholder="+62 812 3456 7890"
                        />
                        {errors.whatsapp && (
                            <p className="text-sm text-destructive">{errors.whatsapp}</p>
                        )}
                    </div>

                    {/* Address (Optional) */}
                    <div className="space-y-2">
                        <Label htmlFor="address">Address <span className="text-muted-foreground">(Optional)</span></Label>
                        <Input
                            id="address"
                            type="text"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            placeholder="Your address"
                        />
                        {errors.address && (
                            <p className="text-sm text-destructive">{errors.address}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" disabled={processing} className="w-full">
                        {processing ? 'Creating account...' : 'Create account'}
                    </Button>
                </form>

                {/* Login Link */}
                <div className="text-center text-sm">
                    <span className="text-muted-foreground">Already have an account? </span>
                    <Link href="/login" className="text-primary hover:underline font-medium">
                        Sign in here
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}
