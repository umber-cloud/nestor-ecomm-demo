"use client";
import { useCart } from "@/lib/cartContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/formatPrice";
import { CartItemThumbnail } from "@/components/CartItemThumbnail";

export function CartSheet({ isOpen, onClose }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const router = useRouter();

  const handleViewCart = () => {
    router.push("/cart");
    onClose();
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="flex flex-col gap-0 w-full sm:max-w-md">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="font-serif text-xl font-normal">
            Shopping Bag {cart.length > 0 && `(${cart.length})`}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Review items in your shopping bag and proceed to checkout.
          </SheetDescription>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground">Your bag is empty</p>
            <Button variant="outline" className="mt-2" onClick={onClose}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto divide-y divide-border">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 py-5">
                  <div className="relative w-20 h-20 bg-muted shrink-0 overflow-hidden rounded-none">
                    <CartItemThumbnail item={item} className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">${formatPrice(item.price)}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-border rounded-none">
                        <button
                          className="h-7 w-7 flex items-center justify-center hover:text-accent transition-colors"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-7 text-center text-sm">{item.quantity}</span>
                        <button
                          className="h-7 w-7 flex items-center justify-center hover:text-accent transition-colors"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
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
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 pb-2">
              <div className="flex justify-between mb-4 text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${formatPrice(getCartTotal())}</span>
              </div>
              <div className="space-y-2">
                <Button className="w-full h-11" onClick={handleViewCart}>
                  View Bag
                </Button>
                <Button
                  className="w-full h-11"
                  variant="outline"
                  onClick={onClose}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
