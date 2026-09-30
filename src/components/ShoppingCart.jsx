"use client";
import { useCart } from "@/lib/cartContext";
import { Button } from "./ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/formatPrice";
import { CartItemThumbnail } from "@/components/CartItemThumbnail";

export function ShoppingCart() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

  if (!isMounted) {
    return null;
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        <h2 className="font-serif text-2xl">Your bag is empty</h2>
        <p className="text-muted-foreground max-w-sm">
          Add some products to your bag to see them here.
        </p>
        <Button asChild className="mt-2 h-11 px-8">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="py-4 max-w-7xl mx-auto w-full">
      <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl mb-6 sm:mb-10">Shopping Bag</h1>
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="lg:w-2/3 divide-y divide-border">
          {cart.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[auto_1fr] xs:grid-cols-[auto_1fr_auto] gap-x-4 gap-y-3 items-center py-6"
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-muted shrink-0 overflow-hidden rounded-2xl">
                <CartItemThumbnail item={item} className="object-cover" />
              </div>
              <div className="min-w-0">
                <h3 className="font-medium truncate">{item.title}</h3>
                <p className="text-muted-foreground mt-1">${formatPrice(item.price)}</p>
              </div>
              <div className="col-span-2 xs:col-span-1 flex items-center gap-3 justify-between xs:justify-end">
                <div className="flex items-center border border-border rounded-full">
                  <button
                    className="h-9 w-9 flex items-center justify-center hover:text-accent transition-colors"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-9 text-center">{item.quantity}</span>
                  <button
                    className="h-9 w-9 flex items-center justify-center hover:text-accent transition-colors"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  className="text-muted-foreground hover:text-destructive transition-colors"
                  onClick={() => removeFromCart(item.id)}
                  aria-label="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:w-1/3">
          <div className="bg-muted rounded-3xl p-5 sm:p-6 lg:sticky lg:top-24">
            <h2 className="font-serif text-xl mb-5">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${formatPrice(getCartTotal())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t border-border pt-3 mt-3">
                <div className="flex justify-between font-medium text-base">
                  <span>Total</span>
                  <span>${formatPrice(getCartTotal())}</span>
                </div>
              </div>
            </div>
            <Link href="/checkout">
              <Button className="w-full mt-6 h-11">Proceed to Checkout</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
