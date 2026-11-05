"use client";
import Banner from "@/components/banner";
import CategoryCard from "@/components/categories/categorieCard";
import ProductGrid from "@/components/products/productGrid";

// Homepage of Nestor ECommerce Demo showcasing live Umber ADN media
export default function Home() {
  return (
    <>
      <Banner />

      <ProductGrid />

      <section className="mt-20 mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">
          Shop by <em className="font-serif font-normal">Category</em>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CategoryCard
            cover="https://harbour-wren-3226.umberadn.com/api/vi/6ae094fb1701f00439587797/steam-deck/9d9efd2d0b90/DEV/generic"
            title="Fun"
            description="Explore"
          />
          <CategoryCard
            cover="https://harbour-wren-3226.umberadn.com/api/vi/6ae094fb1701f00439587797/sp-speaker/4d58a2f43ba2/DEV/generic"
            title="AI"
            description="Explore"
          />
          <CategoryCard
            cover="https://harbour-wren-3226.umberadn.com/api/vi/6ae094fb1701f00439587797/air-purifier/e0acf7014109/DEV/generic"
            title="Wellness"
            description="Explore"
          />
          <CategoryCard
            cover="https://harbour-wren-3226.umberadn.com/api/vi/6ae094fb1701f00439587797/multiport-charger/c663aa30dd57/DEV/generic"
            title="Travel"
            description="Explore"
          />
        </div>
      </section>
    </>
  );
}
