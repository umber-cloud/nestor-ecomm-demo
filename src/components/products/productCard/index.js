"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useCart } from "@/lib/cartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CartSheet } from "@/components/CartSheet";

const ProductCard = ({ title, price, cover, onClick, id, priority }) => {
  const [isMounted, setIsMounted] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const { toast } = useToast();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent triggering onClick (navigation)
    // Convert price string to number by removing '$' and ',' symbols
    const numericPrice = parseFloat(price.replace(/[$,]/g, ""));
    // Use title as unique identifier since we don't have unique IDs in the data
    const productId = title.toLowerCase().replace(/\s+/g, "-");
    const productToAdd = {
      id: productId,
      title,
      price: numericPrice,
      image: cover?.url || cover
    };
    console.log("Adding product to cart:", productToAdd);
    addToCart(productToAdd);
    setIsCartOpen(true);
    toast({
      title: "Added to cart",
      description: `${title} has been added to your cart`
    });
  };
  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Card className="overflow-hidden border-none shadow-none">
        <div onClick={onClick} className="flex justify-center relative">
          <CardHeader>
            {cover?.type === 'video' ? (
              <video
                src={cover.url}
                className="w-full h-auto object-cover rounded-lg cursor-pointer transition-all duration-200 hover:scale-110 hover:brightness-35 aspect-video"
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <Image
                width={1024}
                height={720}
                src={cover?.url || cover}
                alt={title}
                priority={priority}
                className="w-full aspect-video object-cover rounded-lg cursor-pointer transition-all duration-200 hover:scale-110 hover:brightness-35"
              />
            )}
          </CardHeader>
          <div className="image-shadow"></div>
        </div>
        <div className="p-1 py-1">
          <CardContent>
            <h2 className="text-xl font-medium text-gray-600 cursor-pointer">
              {title}
            </h2>
            <div className="flex items-center justify-between mt-2">
              <p className="text-lg font-semibold">{price}</p>
              <Button
                onClick={handleAddToCart}
                size="sm"
                className="flex items-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
      <CartSheet isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default ProductCard;
