import { PropsWithChildren } from 'react';
import { Head, Link } from '@inertiajs/react';

interface Props extends PropsWithChildren {
    title?: string;
}

export default function GuestLayout({ title, children }: Props) {
    return (
        <>
            {title && <Head title={title} />}
            
            <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <Link href="/" className="flex justify-center mb-8">
                        <h1 className="text-3xl font-bold">Art Gallery</h1>
                    </Link>
                    
                    {/* Content Card */}
                    <div className="bg-card border rounded-lg shadow-lg p-8">
                        {children}
                    </div>
                    
                    {/* Footer */}
                    <p className="text-center text-sm text-muted-foreground mt-6">
                        &copy; {new Date().getFullYear()} Art Gallery. All rights reserved.
                    </p>
                </div>
            </div>
        </>
    );
}
