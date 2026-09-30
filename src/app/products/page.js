"use client"
import React, { useState, useEffect, Suspense } from 'react'
import BreadCrumb from '@/components/breadcrumb';
import ProductCard from "@/components/products/productCard"
import { getProducts } from '@/lib/shopData';
import { useRouter, useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

function ProductsPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const searchTerm = searchParams.get('search')?.trim() || '';
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

    const visibleProducts = searchTerm
        ? products.filter((product) =>
              `${product.title} ${product.category}`
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
          )
        : products;

    return (
        <>
            <div className="mt-16 pt-2 mb-8">
                <BreadCrumb />
                <h1 className="font-serif text-3xl md:text-4xl">
                    {searchTerm ? `Results for "${searchTerm}"` : 'All Products'}
                </h1>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 mb-16">
                    {[...Array(9)].map((_, i) => (
                        <div key={i}>
                            <Skeleton className="aspect-square w-full rounded-sm" />
                            <Skeleton className="h-4 w-3/4 mt-3" />
                            <Skeleton className="h-4 w-1/4 mt-2" />
                        </div>
                    ))}
                </div>
            ) : visibleProducts.length === 0 ? (
                <p className="text-muted-foreground mb-16">No products found.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 mb-16">
                    {visibleProducts.map((product, index) => (
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
        </>
    )
}

function ProductsPage() {
    return (
        <Suspense fallback={null}>
            <ProductsPageContent />
        </Suspense>
    );
}

export default ProductsPage;
