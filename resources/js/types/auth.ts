export type User = {
    id: number;
    name: string;
    email: string;
    whatsapp?: string;
    address?: string;
    role: 'user' | 'admin';
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
};

export type Auth = {
    user: User;
};
