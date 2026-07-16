'use client';
import React, { useState, useEffect } from 'react';
import ProductCard from '../productCard';
import { getProducts } from '@/lib/shopData';
import { useRouter } from 'next/navigation';

function ProductGrid() {
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProducts() {
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (error) {
                console.error('Error loading products:', error);
            } finally {
                setLoading(false);
            }
        }
        loadProducts();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="bg-gray-200 h-64 rounded-lg"></div>
                        <div className="h-4 bg-gray-200 rounded mt-2"></div>
                        <div className="h-4 bg-gray-200 rounded mt-2 w-1/2"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3">
            {products.slice(0, 6).map((product, index) => {
                return (
                    <ProductCard
                        key={index}
                        onClick={() =>
                            router.push(`/products/${product.title.replace(/\s+/g, "-")}`)
                        }
                        cover={product.cover}
                        title={product.title}
                        price={product.price}
                        priority={index < 3}
                    />
                );
            })}
        </div>
    );
}

export default ProductGrid;

