"use client";
import Banner from "@/components/banner";
import CategoryCard from "@/components/categories/categorieCard";
import ProductCard from "@/components/products/productCard";
import ProductGrid from "@/components/products/productGrid";
import { products } from "@/lib/shopData";
import { useRouter } from "next/navigation";

// this is the home page of the app
export default function Home() {
  const route = useRouter();
  return (
    <>
      {/* Home Page Banner */}

      <Banner />

      {/* Product Card */}

      <ProductGrid />

      {/* Category Card */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CategoryCard
          cover={"https://adn.nestortech.io/api/va/67a06a45ea8a39c6628c71c3/Apparel/dev/generic"}
          title={"Apperal"}
          description={"Shop Now"}
        />
        <CategoryCard
          cover={"https://adn.nestortech.io/api/va/67a06a45ea8a39c6628c71c3/Accessories/dev/generic"}
          title={"Accessories"}
          description={"Shop Now"}
        />
      </div>
    </>
  );
}
