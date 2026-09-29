"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/lib/cartContext";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ProductCard = ({ collectionId, title, price, cover, onClick, priority }) => {
  const [isMounted, setIsMounted] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const numericPrice = parseFloat(price.replace(/[$,]/g, ""));
    addToCart({
      id: collectionId,
      title,
      price: numericPrice,
      image: cover?.url || cover,
    });
    toast({
      title: "Added to cart",
      description: `${title} has been added to your cart`,
    });
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="group bg-card rounded-3xl p-3 transition-shadow hover:shadow-lg">
      <div onClick={onClick} className="image-wrapper cursor-pointer relative">
        {cover?.type === "video" ? (
          <video
            src={cover.url}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <Image
            width={1024}
            height={1024}
            src={cover?.url || cover}
            alt={title}
            priority={priority}
            className="w-full h-full object-cover"
          />
        )}

        <button
          onClick={handleAddToCart}
          aria-label={`Add ${title} to cart`}
          className="absolute bottom-3 right-3 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-accent transition-colors md:opacity-0 md:translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 duration-300"
        >
          <Plus className="h-4.5 w-4.5" />
        </button>
      </div>

      <div onClick={onClick} className="cursor-pointer px-1.5 pt-3 pb-1">
        <h3 className="text-sm md:text-base font-medium truncate">{title}</h3>
        <p className="text-sm text-muted-foreground mt-0.5">{price}</p>
      </div>
    </div>
  );
};

export default ProductCard;
