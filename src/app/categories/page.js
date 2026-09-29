"use client"
import BreadCrumb from '../../components/breadcrumb';
import React from 'react';
import CategoryGrid from '@/components/categories/categorieCard';

function CategoriesPage() {
    return (
        <>
            <div className="pt-2 mt-16 mb-8">
                <BreadCrumb />
                <h1 className="font-serif text-3xl md:text-4xl">Categories</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
                <CategoryGrid
                    title={"Apparel"}
                    cover={"https://adn.umbercloud.io/api/vi/67a06a45ea8a39c6628c71c3/ZebraBlendTShirt/7f011a7fc68a/dev/generic"}
                    description={"Shop now"}
                />
                <CategoryGrid
                    title={"Accessories"}
                    cover={"https://adn.umbercloud.io/api/vi/67a06a45ea8a39c6628c71c3/Anotherhandbag/4dfe02122855/dev/generic"}
                    description={"Shop now"}
                />
            </div>
        </>
    );
}

export default CategoriesPage;
