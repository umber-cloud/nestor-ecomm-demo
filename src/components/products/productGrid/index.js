'use client';
import React, { useState, useEffect } from 'react';
import ProductCard from '../productCard';
import { getProducts } from '@/lib/shopData';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

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

    return (
        <section className="mt-16">
            <div className="flex items-end justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-semibold">
                    Featured <em className="font-serif font-normal">Pieces</em>
                </h2>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-card rounded-none p-3">
                            <Skeleton className="aspect-square w-full rounded-none" />
                            <Skeleton className="h-4 w-3/4 mt-3" />
                            <Skeleton className="h-4 w-1/4 mt-2" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.slice(0, 8).map((product, index) => (
                        <ProductCard
                            key={index}
                            onClick={() =>
                                router.push(`/products/${product.title.replace(/\s+/g, "-")}`)
                            }
                            collectionId={product.collectionId}
                            cover={product.cover}
                            title={product.title}
                            price={product.price}
                            priority={index < 4}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

export default ProductGrid;
