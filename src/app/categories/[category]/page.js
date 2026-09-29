"use client"
import ProductCard from '@/components/products/productCard';
import BreadCrumb from '@/components/breadcrumb';
import { getProductsByCategory } from '@/lib/shopData';
import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

function CategoriesPage({ params }) {
    const router = useRouter();
    const [categoryId, setCategoryId] = useState();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const getId = useCallback(async () => {
        const id = (await params).category;
        setCategoryId(id);
    }, [params]);

    useEffect(() => {
        getId();
    }, [getId]);

    useEffect(() => {
        async function loadProducts() {
            if (!categoryId) return;

            try {
                setLoading(true);
                const data = await getProductsByCategory(categoryId);
                setProducts(data);
            } catch (error) {
                console.error('Error loading products:', error);
            } finally {
                setLoading(false);
            }
        }
        loadProducts();
    }, [categoryId]);

    return (
        <>
            <div className="mt-16 pt-2 mb-8">
                <BreadCrumb />
                <h1 className="font-serif text-3xl md:text-4xl">{categoryId}</h1>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 mb-16">
                    {[...Array(8)].map((_, i) => (
                        <div key={i}>
                            <Skeleton className="aspect-square w-full rounded-sm" />
                            <Skeleton className="h-4 w-3/4 mt-3" />
                            <Skeleton className="h-4 w-1/4 mt-2" />
                        </div>
                    ))}
                </div>
            ) : products.length === 0 ? (
                <p className="text-muted-foreground mb-16">No products found in this category.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 mb-16">
                    {products.map((product, index) => (
                        <ProductCard
                            key={index}
                            collectionId={product.collectionId}
                            cover={product.cover}
                            title={product.title}
                            price={product.price}
                            priority={index < 4}
                            onClick={() => router.push(`/products/${product.title.replace(/\s+/g, "-")}`)}
                        />
                    ))}
                </div>
            )}
        </>
    );
}

export default CategoriesPage;
