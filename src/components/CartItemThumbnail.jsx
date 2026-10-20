"use client";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function CartItemThumbnail({ item, className }) {
  const hasImage = typeof item?.image === "string" && item.image.trim().length > 0;

  if (item?.type === "video" && hasImage) {
    return (
      <video
        src={item.image}
        className={cn("absolute inset-0 w-full h-full", className)}
        muted
        autoPlay
        loop
        playsInline
      />
    );
  }

  if (hasImage) {
    return (
      <Image src={item.image} alt={item.title || "Cart item"} fill unoptimized className={className} />
    );
  }

  return (
    <div className={cn("absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground", className)}>
      <ImageOff className="h-4 w-4" />
    </div>
  );
}
