import { FormEvent } from 'react';
import { useForm, Link, usePage } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
    status?: string;
}

export default function ForgotPassword({ status }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/forgot-password');
    };

    return (
        <GuestLayout title="Forgot Password">
            <div className="space-y-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Forgot Password</h2>
                    <p className="text-muted-foreground mt-2 text-sm">
                        No problem. Just let us know your email address and we will email you a password reset link.
                    </p>
                </div>

                {status && (
                    <div className="bg-success/10 text-success border border-success/20 rounded-md p-4 text-sm">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4">
                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoFocus
                            placeholder="[email protected]"
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">{errors.email}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" disabled={processing} className="w-full">
                        {processing ? 'Sending...' : 'Email Password Reset Link'}
                    </Button>
                </form>

                {/* Back to Login Link */}
                <div className="text-center text-sm">
                    <Link href="/login" className="text-primary hover:underline">
                        ← Back to login
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}
