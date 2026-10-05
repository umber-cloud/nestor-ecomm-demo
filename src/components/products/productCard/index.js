"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Plus, ImageOff } from "lucide-react";
import { useAddToCart } from "@/lib/useAddToCart";

const ProductCard = ({ collectionId, title, price, cover, onClick, priority }) => {
  const [isMounted, setIsMounted] = useState(false);
  const imageWrapperRef = useRef(null);
  const addProductToCart = useAddToCart();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const numericPrice = parseFloat(price.replace(/[$,]/g, ""));
    addProductToCart({
      product: {
        id: collectionId,
        title,
        price: numericPrice,
        image: cover?.url || null,
        type: cover?.type || "image",
      },
      sourceEl: imageWrapperRef.current,
    });
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="group bg-card rounded-2xl sm:rounded-3xl p-2 sm:p-3 transition-shadow hover:shadow-lg">
      <div
        ref={imageWrapperRef}
        onClick={onClick}
        className="image-wrapper cursor-pointer relative"
      >
        {cover?.type === "video" ? (
          <video
            src={cover.url}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : cover?.url ? (
          <Image
            width={1024}
            height={1024}
            src={cover.url}
            alt={title}
            priority={priority}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground bg-muted">
            <ImageOff className="h-6 w-6" />
            <span className="text-xs">Coming soon</span>
          </div>
        )}

        <button
          onClick={handleAddToCart}
          aria-label={`Add ${title} to cart`}
          className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-accent transition-colors md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 duration-300"
        >
          <Plus className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
        </button>
      </div>

      <div onClick={onClick} className="cursor-pointer px-1 sm:px-1.5 pt-2.5 sm:pt-3 pb-1">
        <h3 className="text-sm md:text-base font-medium truncate">{title}</h3>
        <p className="text-sm text-muted-foreground mt-0.5">{price}</p>
      </div>
    </div>
  );
};

export default ProductCard;
