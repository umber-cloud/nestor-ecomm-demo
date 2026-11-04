'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProductCard from '../productCard';
import { getProducts } from '@/lib/shopData';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductGrid() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadProducts() {
      try {
        const data = await getProducts();
        if (isMounted) {
          setProducts(data);
        }
      } catch (error) {
        console.error('Error loading products from Umber ADN:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="mt-16">
      <div className="flex items-end justify-between mb-6 border-b border-border/60 pb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold">
            Featured <em className="font-serif font-normal">Hardware</em>
          </h2>
          <p className="font-mono text-xs text-muted-foreground mt-1">
            Real-time virtual collections streamed directly from Umber Cloud ADN Edge
          </p>
        </div>
        <span className="font-mono text-xs text-primary font-bold uppercase tracking-widest">
          [{products.length} Units Online]
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-card rounded-none p-3 border border-border/50">
              <Skeleton className="aspect-square w-full rounded-none" />
              <Skeleton className="h-4 w-3/4 mt-3" />
              <Skeleton className="h-4 w-1/4 mt-2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product, index) => (
            <ProductCard
              key={product.collectionId || index}
              onClick={() =>
                router.push(`/products/${encodeURIComponent(product.title.replace(/\s+/g, '-'))}`)
              }
              collectionId={product.collectionId}
              cover={product.cover}
              title={product.title}
              price={product.price}
              priority={index < 4}
            />
          ))}
        </div>
      )}
    </section>
  );
}
