export type * from './auth';

import type { Auth } from './auth';

export type SharedData = {
    name: string;
    auth: Auth;
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
