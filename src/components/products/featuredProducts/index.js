"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProductCard from "../productCard";
import { getFeaturedProducts } from "@/lib/shopData";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Sparkles } from "lucide-react";

/**
 * FeaturedProducts Component
 * Displays the 3 flagship products (IRay glasses, Soly, IClean)
 * directly below the hero banner on the homepage.
 */
export default function FeaturedProducts() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadFeatured() {
      try {
        const data = await getFeaturedProducts();
        if (isMounted) {
          setProducts(data);
        }
      } catch (error) {
        console.error("Error loading featured products:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadFeatured();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="mt-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest text-primary border border-primary/40 bg-primary/10">
              <Sparkles className="h-3 w-3" />
              Featured Showcase
            </span>
            <span className="font-mono text-[10px] lowercase text-muted-foreground/80">
              powered by umber
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold">
            Featured <em className="font-serif font-normal">Products</em>
          </h2>
          <p className="font-mono text-xs text-muted-foreground mt-1">
            Flagship hardware streamed live from Umber Cloud ADN Edge
          </p>
        </div>

        <Link
          href="/products"
          className="group inline-flex items-center gap-1.5 font-mono text-xs text-primary hover:text-accent font-bold uppercase tracking-widest transition-colors"
        >
          View All Hardware [17 Units]
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card rounded-none p-3 border border-border/50">
              <Skeleton className="aspect-square w-full rounded-none" />
              <Skeleton className="h-4 w-3/4 mt-3" />
              <Skeleton className="h-4 w-1/4 mt-2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <ProductCard
              key={product.collectionId || index}
              onClick={() =>
                router.push(
                  `/products/${encodeURIComponent(product.title.replace(/\s+/g, "-"))}`
                )
              }
              collectionId={product.collectionId}
              cover={product.cover}
              title={product.title}
              price={product.price}
              priority={true}
            />
          ))}
        </div>
      )}
    </section>
  );
}

