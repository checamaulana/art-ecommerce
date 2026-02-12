export type * from './auth';

import type { Auth } from './auth';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    whatsapp?: string;
    address?: string;
    role: 'admin' | 'user';
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    products_count?: number;
}

export interface Image {
    id: number;
    url: string;
    is_primary: boolean;
    order: number;
}

export interface PrintSize {
    id: number;
    size_name: string;
    width: number;
    height: number;
    price: number;
    price_usd?: number;
    price_formatted?: string;
}

export interface Product {
    id: number;
    title: string;
    slug: string;
    description: string;
    product_type: 'original' | 'print' | 'digital';
    price: number;
    price_usd?: number;
    price_formatted?: string;
    width: number;
    height: number;
    dimensions_formatted?: string;
    medium: string;
    year_created: number;
    status: 'available' | 'sold';
    is_featured: boolean;
    category_id: number;
    category?: Category;
    images?: Image[];
    primary_image?: Image;
    print_sizes?: PrintSize[];
    thumbnail?: string;
    wishlisted_by?: Array<{
        id: number;
    }>;
}

export interface PaginatedData<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}

export type SharedProps = {
    name: string;
    auth: {
        user: User;
    };
    locale: {
        current: 'id' | 'en';
        available: string[];
    };
    currency: 'IDR' | 'USD';
    flash: {
        success?: string;
        error?: string;
    };
    config: {
        whatsappNumber: string;
    };
};
