"use client";

import { useState, useEffect } from "react";
import Banner from "@/components/banner";
import CategoryCard from "@/components/categories/categorieCard";
import FeaturedProducts from "@/components/products/featuredProducts";
import { getProducts } from "@/lib/shopData";

// Homepage of Nestor ECommerce Demo showcasing live Umber ADN media
export default function Home() {
  const [covers, setCovers] = useState({
    Fun: null,
    AI: null,
    Wellness: null,
    Travel: null,
  });

  useEffect(() => {
    let isMounted = true;
    async function loadCategoryCovers() {
      try {
        const products = await getProducts();
        if (isMounted) {
          setCovers({
            Fun: products.find((p) => p.category?.toLowerCase() === "fun")?.cover?.url || null,
            AI: products.find((p) => p.category?.toLowerCase() === "ai")?.cover?.url || null,
            Wellness: products.find((p) => p.category?.toLowerCase() === "wellness")?.cover?.url || null,
            Travel: products.find((p) => p.category?.toLowerCase() === "travel")?.cover?.url || null,
          });
        }
      } catch (err) {
        console.error("Error loading category covers:", err);
      }
    }
    loadCategoryCovers();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Banner />

      <FeaturedProducts />

      <section className="mt-20 mb-8">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-tight text-foreground mb-6">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CategoryCard
            cover={covers.Fun}
            title="Fun"
            description="Explore"
          />
          <CategoryCard
            cover={covers.AI}
            title="AI"
            description="Explore"
          />
          <CategoryCard
            cover={covers.Wellness}
            title="Wellness"
            description="Explore"
          />
          <CategoryCard
            cover={covers.Travel}
            title="Travel"
            description="Explore"
          />
        </div>
      </section>
    </>
  );
}
