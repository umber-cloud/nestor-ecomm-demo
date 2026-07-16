"use client"
import BreadCrumb from '../../components/breadcrumb';
import React from 'react';
import CategoryGrid from '@/components/categories/categorieCard';

function CategoriesPage() {
    return (
        <>
            {/* BreadCrumb Component */}
            <div className=" pt-2 my-16">
                <BreadCrumb
                    page1={"Home"}
                    catogory={"Categories"}
                    page2={"Apparel"}
                />
                <h1 className='font-bold text-2xl mt-2'>Categories</h1>
            </div>

            {/* CategoryGrid Component */}
            <div className="grid grid-cols-2 gap-3">
                <CategoryGrid
                    title={"Apparel"}
                    cover={"https://https://adn.umbercloud.io/api/va/67a06a45ea8a39c6628c71c3/Apparel/dev/generic"}
                    description={"Shop now"}
                />
                <CategoryGrid
                    title={"Accessories"}
                    cover={"https://https://adn.umbercloud.io/api/va/67a06a45ea8a39c6628c71c3/Accessories/dev/generic"}
                    description={"Shop now"}
                />
            </div>
        </>
    );
}

export default CategoriesPage;
