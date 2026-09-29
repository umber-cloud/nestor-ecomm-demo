"use client";
import Image from "next/image";
import { useCart } from "@/lib/cartContext";
import { useCartFlyAnimation } from "@/components/cartFlyAnimation";
import { toast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/formatPrice";

/**
 * Single reusable entry point for every "add to cart" control on the site.
 * Updates cart state, launches the fly-to-cart animation from the clicked
 * element, and shows a toast with the product's image, title and price.
 */
export function useAddToCart() {
  const { addToCart } = useCart();
  const { flyToCart } = useCartFlyAnimation();

  return function addProductToCart({ product, sourceEl, quantity = 1 }) {
    addToCart(product, quantity);

    // The fly-to-cart clone only supports static images — video covers skip
    // the flight but still get the toast confirmation.
    if (sourceEl && product.image && product.type !== "video") {
      flyToCart({ imageUrl: product.image, sourceEl });
    }

    toast({
      title: "Added to bag",
      description: (
        <div className="flex items-center gap-3 mt-1">
          {product.image && product.type === "video" ? (
            <video
              src={product.image}
              className="h-12 w-12 rounded-xl object-cover shrink-0 bg-muted"
              muted
              autoPlay
              loop
              playsInline
            />
          ) : (
            product.image && (
              <Image
                src={product.image}
                alt={product.title}
                width={48}
                height={48}
                unoptimized
                className="h-12 w-12 rounded-xl object-cover shrink-0 bg-muted"
              />
            )
          )}
          <div className="min-w-0">
            <p className="font-medium text-foreground truncate">{product.title}</p>
            <p className="text-muted-foreground">
              ${formatPrice(product.price)}
              {quantity > 1 ? ` × ${quantity}` : ""}
            </p>
          </div>
        </div>
      ),
    });
  };
}
