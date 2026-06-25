/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import ProductSugg from "@/components/productSuggestions";
import ProductInfo from "@/components/productInfo";
import { getProductBySlug, getProductSuggestions } from "@/lib/shopData";
import { ProductSlider } from "@/components/productViewer";
import { PDFViewer } from "@/components/PDFViewer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductShare from "@/components/productShare";
import BreadCrumb from "@/components/breadcrumb";
import { CartSheet } from "@/components/CartSheet";
import { useCart } from "@/lib/cartContext";

function ProductPage({ params }) {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const { addToCart } = useCart();

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

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.collectionId,
      title: product.title,
      price: product.price,
      image: product.cover?.url,
    });
    setCartOpen(true);
  };

  if (loading) {
    return (
      <div className="mt-16 pt-2">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mt-16 pt-2">
        <h1 className="text-2xl font-bold">Product not found</h1>
      </div>
    );
  }

  return (
    <>
      {/* Cart drawer */}
      <CartSheet isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* BreadCrumb */}
      <div className="mt-16 pt-2">
        <BreadCrumb />
      </div>

      {/* Product tabs */}
      <div className="flex flex-col justify-center items-center">
        {product?.cover && (
          <Tabs defaultValue="product" className="w-full max-w-6xl">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="product">Product</TabsTrigger>
              <TabsTrigger value="documentation">Documentation</TabsTrigger>
            </TabsList>

            {/* Share */}
            <div className="flex justify-center items-center">
              <ProductShare
                productUrl={productUrl}
                productImageUrl={product.cover.url}
              />
            </div>

            <TabsContent value="product" className="mt-4">
              <div className="flex gap-2 flex-wrap lg:flex-nowrap">
                <ProductSlider
                  images={product?.thumbnails}
                  cover={product?.cover}
                />
                <div className="items-end p-5 m-1 gap-1">
                  <ProductInfo product={product} onAddToCart={handleAddToCart} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="documentation" className="mt-4">
              <PDFViewer url={product.pdfUrl} />
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* You May Also Like */}
      <h1 className="text-2xl font-bold m-5">You May Also Like</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-5">
        {suggestions.map((product, index) => (
          <ProductSugg
            key={index}
            cover={product.cover}
            title={product.title}
            price={product.price}
          />
        ))}
      </div>
    </>
  );
}

export default ProductPage;
