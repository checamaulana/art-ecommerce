import type { PropsWithChildren } from 'react';

const ProductGrid = ({ children }: PropsWithChildren) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {children}
        </div>
    );
};

export default ProductGrid;
