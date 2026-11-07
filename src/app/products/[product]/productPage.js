/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import ProductSugg from "@/components/productSuggestions";
import ProductInfo from "@/components/productInfo";
import { getProductBySlug, getProductSuggestions } from "@/lib/shopData";
import { ProductSlider } from "@/components/productViewer";
import ProductShare from "@/components/productShare";
import BreadCrumb from "@/components/breadcrumb";
import { useAddToCart } from "@/lib/useAddToCart";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, ArrowUpRight } from "lucide-react";

export default function ProductPage({ params }) {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [activeVariantId, setActiveVariantId] = useState(null);

  const addProductToCart = useAddToCart();

  useEffect(() => {
    let isMounted = true;
    async function loadProduct() {
      try {
        const id = (await params).product;
        const productData = await getProductBySlug(id);
        if (isMounted) {
          setProduct(productData);
          setActiveVariantId(
            productData?.defaultVariantId || productData?.variants?.[0]?.id || null
          );
        }

        const suggestionData = await getProductSuggestions();
        if (isMounted) {
          setSuggestions(suggestionData);
        }
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadProduct();
    return () => {
      isMounted = false;
    };
  }, [params]);

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");

  const slug =
    product?.title &&
    product.title
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-");

  const productUrl = `${baseUrl}/products/${slug}`;

  const activeVariant = product?.variants?.find((v) => v.id === activeVariantId);
  const sliderCover = activeVariant?.cover || product?.cover;
  const sliderImages = activeVariant?.thumbnails?.length
    ? activeVariant.thumbnails
    : product?.thumbnails;

  const handleAddToCart = (quantity = 1, sourceEl = null) => {
    if (!product) return;
    addProductToCart({
      product: {
        id: product.collectionId,
        title: activeVariant ? `${product.title} — ${activeVariant.label}` : product.title,
        price: product.price,
        image: sliderCover?.url,
        type: sliderCover?.type || "image",
      },
      quantity,
      sourceEl,
    });
  };

  if (loading) {
    return (
      <div className="mt-16 pt-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            <Skeleton className="aspect-square w-full" />
          </div>
          <div className="lg:col-span-7 space-y-4 pt-6">
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
      <div className="mt-16 pt-2 mb-16">
        <h1 className="text-3xl font-semibold">Product not found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full px-2 sm:px-4">
      <div className="mt-16 pt-2 font-mono text-xs">
        <BreadCrumb />
      </div>

      {/* 40:60 Proportional Layout (col-span-5 / col-span-7) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12 items-start">
        {/* Media frame (40% width) */}
        <div className="relative border border-primary/50 bg-card p-4 sm:p-6 w-full lg:col-span-5">
          <div className="absolute -top-px -left-px h-5 w-5 border-t-2 border-l-2 border-accent" />
          <div className="absolute -bottom-px -right-px h-5 w-5 border-b-2 border-r-2 border-accent" />
          <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-secondary">
            <span>MEDIA.FEED</span>
            <span>{product.category?.toUpperCase()}</span>
          </div>
          <ProductSlider
            key={activeVariantId || "default"}
            images={sliderImages}
            cover={sliderCover}
            pdfUrl={product?.pdfUrl}
          />
        </div>

        {/* Spec panel (60% width) */}
        <div className="relative border border-border bg-card/80 p-5 sm:p-7 md:p-8 w-full lg:col-span-7">
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
            <ProductShare productUrl={productUrl} productImageUrl={product.cover?.url} />
          </div>
          <ProductInfo
            product={product}
            onAddToCart={handleAddToCart}
            activeVariantId={activeVariantId}
            onVariantSelect={setActiveVariantId}
          />

          {product.pdfUrl && (
            <a
              href={`/api/pdf-proxy?url=${encodeURIComponent(product.pdfUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 pt-5 border-t border-border flex items-center justify-between font-mono text-xs uppercase tracking-widest group"
            >
              <span className="flex items-center gap-2 text-foreground font-semibold">
                <FileText className="h-4 w-4 text-primary" />
                User Manual (PDF)
              </span>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          )}
        </div>
      </div>

      {suggestions.length > 0 && (
        <section className="mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold uppercase font-serif mb-6">
            Related <span className="text-primary">Gear</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {suggestions.map((s, index) => (
              <ProductSugg key={index} cover={s.cover} title={s.title} price={s.price} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
