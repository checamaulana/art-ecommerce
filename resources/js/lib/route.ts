type RouteName = string;
type RoutePrimitive = string | number | boolean;
type RouteParamValue = RoutePrimitive | null | undefined;
type RouteParamRecord = Record<string, RouteParamValue>;
type RouteParamsInput = RouteParamRecord | RoutePrimitive;

interface RouteContext {
    current: () => RouteName | undefined;
    params: Record<string, string>;
}

interface RouteHelper {
    (name: string, params?: RouteParamsInput, absolute?: boolean): string;
    (): RouteContext;
}

const routePatterns: Record<string, string> = {
    home: '/',
    'catalog.index': '/catalog',
    'catalog.show': '/catalog/{product}',
    contact: '/contact',
    faq: '/faq',
    terms: '/terms',
    privacy: '/privacy',
    'profile.edit': '/profile',
    'profile.update': '/profile',
    'wishlist.index': '/wishlist',
    'wishlist.store': '/wishlist/{product}',
    'wishlist.destroy': '/wishlist/{product}',
    register: '/register',
    login: '/login',
    logout: '/logout',
    'password.request': '/forgot-password',
    'password.email': '/forgot-password',
    'password.reset': '/reset-password/{token}',
    'password.store': '/reset-password',
    // Admin routes
    'admin.dashboard': '/admin',
    'admin.products.index': '/admin/products',
    'admin.products.create': '/admin/products/create',
    'admin.products.store': '/admin/products',
    'admin.products.show': '/admin/products/{product}',
    'admin.products.edit': '/admin/products/{product}/edit',
    'admin.products.update': '/admin/products/{product}',
    'admin.products.destroy': '/admin/products/{product}',
    'admin.products.images.store': '/admin/products/{product}/images',
    'admin.products.images.destroy': '/admin/products/{product}/images/{image}',
    'admin.categories.index': '/admin/categories',
    'admin.categories.create': '/admin/categories/create',
    'admin.categories.store': '/admin/categories',
    'admin.categories.edit': '/admin/categories/{category}',
    'admin.categories.update': '/admin/categories/{category}',
    'admin.categories.destroy': '/admin/categories/{category}',
    'admin.users.index': '/admin/users',
    'admin.users.show': '/admin/users/{user}',
};

function getPathParamKeys(pattern: string): string[] {
    const matches = pattern.matchAll(/\{([^}:]+)(?::[^}]+)?\}/g);

    return Array.from(matches, (match) => match[1]);
}

function parseCurrentParams(): Record<string, string> {
    const params = new URLSearchParams(window.location.search);
    const parsedParams: Record<string, string> = {};

    for (const [key, value] of params.entries()) {
        parsedParams[key] = value;
    }

    return parsedParams;
}

function getCurrentRouteName(): RouteName | undefined {
    const currentPath = window.location.pathname;

    const entries = Object.entries(routePatterns);

    for (const [name, pattern] of entries) {
        const regexPattern = pattern
            .replace(/\{([^}:]+)(?::[^}]+)?\}/g, '[^/]+')
            .replace(/\//g, '\\/');
        const routeRegex = new RegExp(`^${regexPattern}$`);

        if (routeRegex.test(currentPath)) {
            return name;
        }
    }

    return undefined;
}

function resolveParams(
    pathParamKeys: string[],
    inputParams?: RouteParamsInput,
): { pathParams: Record<string, RoutePrimitive>; queryParams: RouteParamRecord } {
    const pathParams: Record<string, RoutePrimitive> = {};
    const queryParams: RouteParamRecord = {};

    if (inputParams === undefined || inputParams === null) {
        return { pathParams, queryParams };
    }

    if (typeof inputParams !== 'object') {
        if (pathParamKeys.length === 1) {
            pathParams[pathParamKeys[0]] = inputParams;
            return { pathParams, queryParams };
        }

        return { pathParams, queryParams };
    }

    const entries = Object.entries(inputParams);

    for (const [key, value] of entries) {
        if (pathParamKeys.includes(key) && value !== undefined && value !== null) {
            pathParams[key] = value;
            continue;
        }

        queryParams[key] = value;
    }

    if (pathParamKeys.length === 1 && pathParams[pathParamKeys[0]] === undefined) {
        const value = inputParams[pathParamKeys[0]];

        if (value !== undefined && value !== null) {
            pathParams[pathParamKeys[0]] = value;
        }
    }

    return { pathParams, queryParams };
}

function routeHelper(): RouteContext;
function routeHelper(name: string, params?: RouteParamsInput, absolute?: boolean): string;
function routeHelper(
    name?: string,
    params?: RouteParamsInput,
    absolute = false,
): string | RouteContext {
    if (!name) {
        return {
            current: getCurrentRouteName,
            params: parseCurrentParams(),
        };
    }

    const pattern = routePatterns[name];

    if (!pattern) {
        throw new Error(`Unknown route name: ${name}`);
    }

    const pathParamKeys = getPathParamKeys(pattern);
    const { pathParams, queryParams } = resolveParams(pathParamKeys, params);

    let path = pattern;

    for (const key of pathParamKeys) {
        const value = pathParams[key];

        if (value === undefined || value === null) {
            throw new Error(`Missing required route parameter "${key}" for route "${name}"`);
        }

        path = path.replace(`{${key}}`, encodeURIComponent(String(value)));
    }

    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(queryParams)) {
        if (value === undefined || value === null || value === '') {
            continue;
        }

        searchParams.set(key, String(value));
    }

    const queryString = searchParams.toString();
    const url = queryString.length > 0 ? `${path}?${queryString}` : path;

    if (absolute) {
        return `${window.location.origin}${url}`;
    }

    return url;
}

if (typeof window !== 'undefined' && typeof globalThis.route !== 'function') {
    globalThis.route = routeHelper as RouteHelper;
}

declare global {
    // eslint-disable-next-line no-var
    var route: RouteHelper;
}

export {};
