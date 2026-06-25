"use client"
import React, { useState, useEffect } from 'react'
import BreadCrumb from '@/components/breadcrumb';
import ProductCard from "@/components/products/productCard"
import { getProducts } from '@/lib/shopData';
import { useRouter } from 'next/navigation';

function ProductsPage() {
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
        <>
            {/* BreadCrumb Component */}
            <div className="mt-16 pt-2">
                <BreadCrumb
                    page1={"All Products"}
                    catogory={"Sunbeam Tote Jeff"}
                />

                {loading ? (
                    <div className="grid grid-cols-3 gap-4 mt-4">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-gray-200 h-64 rounded-lg"></div>
                                <div className="h-4 bg-gray-200 rounded mt-2"></div>
                                <div className="h-4 bg-gray-200 rounded mt-2 w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-3">
                        {products?.map((product, index) => {
                            return (
                                <ProductCard
                                    key={index}
                                    id={product.title.toLowerCase().replace(/\s+/g, '-')}
                                    onClick={() =>
                                        router.push(`/products/${product.title.replace(/\s+/g, "-")}`)
                                    }
                                    cover={product.cover}
                                    title={product.title}
                                    price={product.price}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    )
}

export default ProductsPage;

