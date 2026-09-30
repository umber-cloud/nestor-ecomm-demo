"use client"
import BreadCrumb from '../../components/breadcrumb';
import React, { useEffect, useState } from 'react';
import CategoryGrid from '@/components/categories/categorieCard';
import { getProducts } from '@/lib/shopData';
import { Skeleton } from '@/components/ui/skeleton';

const CATEGORY_DESCRIPTIONS = {
    Apparel: "Everyday essentials",
    Accessories: "Finishing touches",
    Digital: "Tools & downloads",
};

function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadCategories() {
            try {
                const products = await getProducts();
                const byCategory = new Map();
                for (const product of products) {
                    if (!byCategory.has(product.category)) {
                        byCategory.set(product.category, product);
                    }
                }
                setCategories(Array.from(byCategory.entries()));
            } catch (error) {
                console.error('Error loading categories:', error);
            } finally {
                setLoading(false);
            }
        }
        loadCategories();
    }, []);

    return (
        <>
            <div className="pt-2 mt-16 mb-8">
                <BreadCrumb />
                <h1 className="font-serif text-3xl md:text-4xl">Categories</h1>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="aspect-[4/3] md:aspect-[16/10] w-full rounded-3xl" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
                    {categories.map(([category, product]) => (
                        <CategoryGrid
                            key={category}
                            title={category}
                            cover={product.cover?.url}
                            description={CATEGORY_DESCRIPTIONS[category] || "Shop now"}
                        />
                    ))}
                </div>
            )}
        </>
    );
}

export default CategoriesPage;
