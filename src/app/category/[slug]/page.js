"use client";
import React, { useState, useEffect, use, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import BreadCrumb from "@/components/breadcrumb";
import { ProductSlider } from "@/components/productViewer";
import ProductInfo from "@/components/productInfo";
import ProductShare from "@/components/productShare";
import ProductSugg from "@/components/productSuggestions";
import { getCategoryProductBySlug, getCategoryProducts } from "@/data/categoryCatalog";
import { getProductBySlug } from "@/lib/shopData";
import { useAddToCart } from "@/lib/useAddToCart";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, ArrowUpRight, ArrowLeft, CheckCircle2 } from "lucide-react";

function CategoryProductContent({ slug }) {
  const searchParams = useSearchParams();
  const fromParam = searchParams?.get("from");

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);

  const addProductToCart = useAddToCart();

  useEffect(() => {
    async function loadItem() {
      try {
        if (!slug) return;
        // Search category catalog first, then shopData
        let item = getCategoryProductBySlug(slug);
        if (!item) {
          item = await getProductBySlug(slug);
        }
        setProduct(item);

        if (item) {
          // Find related products in same category
          const categoryItems = getCategoryProducts(item.category).filter(
            (p) => p.id !== item.id
          );
          setRelated(categoryItems.slice(0, 4));
        }
      } catch (error) {
        console.error("Error loading category product:", error);
      } finally {
        setLoading(false);
      }
    }
    loadItem();
  }, [slug]);

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BASE_URL || "";
  const productUrl = `${baseUrl}/category/${slug}`;

  const handleAddToCart = (quantity = 1, sourceEl = null) => {
    if (!product) return;
    addProductToCart({
      product: {
        id: product.collectionId || product.id,
        title: product.title,
        price: product.price,
        image: product.cover?.url,
        type: product.cover?.type || "image",
      },
      quantity,
      sourceEl,
    });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 mt-16 pt-2">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
          <Skeleton className="aspect-square w-full rounded-none" />
          <div className="space-y-4 pt-6">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-20 w-full mt-6" />
            <Skeleton className="h-11 w-full mt-6" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 mt-16 pt-8 mb-20 text-center">
        <div className="border border-border bg-card/60 p-12 max-w-md mx-auto">
          <h1 className="text-2xl font-serif font-bold mb-3">Product Not Found</h1>
          <p className="font-mono text-xs text-muted-foreground mb-6">
            The requested hardware identifier [{slug}] could not be resolved in the category registry.
          </p>
          <Link
            href="/category"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-widest hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Return to Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6">
      {/* Top Navigation */}
      <div className="mt-16 pt-2 flex items-center justify-between font-mono text-xs mb-6">
        <div className="flex items-center gap-2">
          <Link
            href="/category"
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>CATEGORIES</span>
          </Link>
          <span className="text-border">/</span>
          <Link
            href={fromParam ? `/category?filter=${encodeURIComponent(fromParam)}` : "/category"}
            className="text-muted-foreground hover:text-primary uppercase tracking-wider transition-colors"
          >
            {fromParam ? fromParam : "ALL"}
          </Link>
          <span className="text-border">/</span>
          <span className="text-foreground truncate max-w-[200px] sm:max-w-none">
            {product.title}
          </span>
        </div>
      </div>

      {/* Main Product Showcase */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 mb-12 items-stretch">
        {/* Media Frame with HUD Corners */}
        <div className="relative border border-primary/50 bg-card p-4 sm:p-6 w-full lg:w-[440px] shrink-0">
          <div className="absolute -top-px -left-px h-5 w-5 border-t-2 border-l-2 border-accent" />
          <div className="absolute -bottom-px -right-px h-5 w-5 border-b-2 border-r-2 border-accent" />
          <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-secondary">
            <span>MEDIA.FEED // 1080P</span>
            <span>{product.category?.toUpperCase()}</span>
          </div>
          <ProductSlider images={product.thumbnails} cover={product.cover} />
        </div>

        {/* Spec & Buy Panel */}
        <div className="relative border border-border bg-card/80 p-5 sm:p-7 md:p-8 w-full lg:flex-1 flex flex-col justify-between">
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
            <ProductShare productUrl={productUrl} productImageUrl={product.cover?.url} />
          </div>

          <div>
            <ProductInfo product={product} onAddToCart={handleAddToCart} />

            {/* Hardware Key Features */}
            {product.features && product.features.length > 0 && (
              <div className="mt-8 pt-6 border-t border-border">
                <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-secondary mb-3">
                  // HARDWARE SPECIFICATIONS
                </h4>
                <ul className="space-y-2">
                  {product.features.map((feat, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 font-mono text-xs text-foreground/90 leading-relaxed"
                    >
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* PDF Spec Sheet (if available) */}
          {product.pdfUrl && (
            <a
              href={`/api/pdf-proxy?url=${encodeURIComponent(product.pdfUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 pt-5 border-t border-border flex items-center justify-between font-mono text-xs uppercase tracking-widest group"
            >
              <span className="flex items-center gap-2 text-foreground">
                <FileText className="h-4 w-4 text-secondary" />
                Spec sheet (PDF)
              </span>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          )}
        </div>
      </div>

      {/* Related Category Products */}
      {related.length > 0 && (
        <section className="mb-20">
          <div className="flex items-baseline justify-between border-b border-border/80 pb-3 mb-6">
            <h3 className="text-xl sm:text-2xl font-bold uppercase font-serif text-foreground">
              More in <span className="text-primary">{product.category}</span>
            </h3>
            <Link
              href={`/category?filter=${encodeURIComponent(product.category)}`}
              className="font-mono text-xs text-muted-foreground hover:text-primary tracking-widest uppercase transition-colors"
            >
              View All &gt;
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {related.map((item, index) => (
              <ProductSugg
                key={index}
                href={`/category/${item.id}`}
                cover={item.cover}
                title={item.title}
                price={item.price}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function CategoryProductPage({ params }) {
  // Unwrap params using React.use() or direct access
  const unwrappedParams = typeof params?.then === "function" ? use(params) : params;
  const slug = unwrappedParams?.slug;

  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 mt-16 pt-8">
          <Skeleton className="h-96 w-full" />
        </div>
      }
    >
      <CategoryProductContent slug={slug} />
    </Suspense>
  );
}
