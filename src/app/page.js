"use client";
import Banner from "@/components/banner";
import CategoryCard from "@/components/categories/categorieCard";
import ProductGrid from "@/components/products/productGrid";

// this is the home page of the app
export default function Home() {
  return (
    <>
      <Banner />

      <ProductGrid />

      <section className="mt-20 mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">
          Shop by <em className="font-serif font-normal">Category</em>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CategoryCard
            cover={"https://adn.umbercloud.io/api/vi/67a06a45ea8a39c6628c71c3/ZebraBlendTShirt/7f011a7fc68a/dev/generic"}
            title={"Apparel"}
            description={"Shop Now"}
          />
          <CategoryCard
            cover={"https://adn.umbercloud.io/api/vi/67a06a45ea8a39c6628c71c3/Anotherhandbag/4dfe02122855/dev/generic"}
            title={"Accessories"}
            description={"Shop Now"}
          />
        </div>
      </section>
    </>
  );
}
