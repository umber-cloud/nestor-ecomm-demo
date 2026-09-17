"use client"
import ProductCard from '@/components/products/productCard';
import BreadCrumb from '@/components/breadcrumb';
import { getProductsByCategory } from '@/lib/shopData';
import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation';

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
            {/* BreadCrumb Component */}
            <div className="mt-16 pt-2">
                <BreadCrumb
                    page1={"home"}
                    page3={"categories"}
                    page2={categoryId}
                />
                <h1 className='font-bold text-2xl mt-2'>{categoryId}</h1>
                <p className='text-md text-muted-foreground'>
                    Category
                </p>
            </div>

            {loading ? (
                <div className="grid grid-cols-3 gap-4 mt-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-gray-200 h-64 rounded-lg"></div>
                            <div className="h-4 bg-gray-200 rounded mt-2"></div>
                            <div className="h-4 bg-gray-200 rounded mt-2 w-1/2"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-3">
                    {products.map((product, index) => {
                        return (
                            <ProductCard
                                key={index}
                                id={product.title.toLowerCase().replace(/\s+/g, '-')}
                                cover={product.cover}
                                title={product.title}
                                price={product.price}
                                priority={index < 3}
                                onClick={() => router.push(`/products/${product.title.replace(/\s+/g, "-")}`)}
                            />
                        )
                    })}
                </div>
            )}
        </>
    );
}

export default CategoriesPage;

