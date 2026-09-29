/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import ProductSugg from "@/components/productSuggestions";
import ProductInfo from "@/components/productInfo";
import { getProductBySlug, getProductSuggestions } from "@/lib/shopData";
import { ProductSlider } from "@/components/productViewer";
import ProductShare from "@/components/productShare";
import BreadCrumb from "@/components/breadcrumb";
import { useAddToCart } from "@/lib/useAddToCart";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, ArrowUpRight } from "lucide-react";

const PANEL_TINT = {
  Apparel: "bg-[#eef1ea]",
  Accessories: "bg-[#f3e9df]",
};

function ProductPage({ params }) {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const addProductToCart = useAddToCart();

  useEffect(() => {
    async function loadProduct() {
      try {
        const id = (await params).product;
        const productData = await getProductBySlug(id);
        setProduct(productData);

        const suggestionData = await getProductSuggestions();
        setSuggestions(suggestionData);
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, []);

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (typeof window !== 'undefined' ? window.location.origin : '');

  const slug =
    product?.title &&
    product.title
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-");

  const productUrl = `${baseUrl}/products/${slug}`;

  const handleAddToCart = (quantity = 1, sourceEl = null) => {
    if (!product) return;
    addProductToCart({
      product: {
        id: product.collectionId,
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
      <div className="mt-16 pt-2">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
          <Skeleton className="aspect-square w-full rounded-[2.5rem]" />
          <div className="space-y-4 pt-6">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-20 w-full mt-6" />
            <Skeleton className="h-11 w-full mt-6 rounded-full" />
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

  const panelTint = PANEL_TINT[product.category] || "bg-muted";

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="mt-16 pt-2 flex items-center justify-between">
        <BreadCrumb />
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 mb-10 items-start">
        {/* Image panel — tinted, rounded, contains gallery */}
        <div className={`relative rounded-[1.75rem] sm:rounded-[2.5rem] ${panelTint} p-4 sm:p-6 md:p-8 pb-4 sm:pb-6 w-full lg:w-[440px] shrink-0`}>
          <ProductSlider images={product?.thumbnails} cover={product?.cover} />
        </div>

        {/* Info card */}
        <div className="relative bg-card rounded-[1.5rem] sm:rounded-[2rem] shadow-xl p-5 sm:p-7 md:p-8 w-full lg:flex-1 z-10">
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
            <ProductShare productUrl={productUrl} productImageUrl={product.cover?.url} />
          </div>
          <ProductInfo product={product} onAddToCart={handleAddToCart} />

          {product.pdfUrl && (
            <a
              href={`/api/pdf-proxy?url=${encodeURIComponent(product.pdfUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 pt-5 border-t border-border flex items-center justify-between text-sm group"
            >
              <span className="flex items-center gap-2 text-foreground">
                <FileText className="h-4 w-4 text-accent" />
                Product documentation
              </span>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
            </a>
          )}
        </div>
      </div>

      {suggestions.length > 0 && (
        <section className="mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-6">
            You May Also <em className="font-serif font-normal">Like</em>
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

export default ProductPage;
