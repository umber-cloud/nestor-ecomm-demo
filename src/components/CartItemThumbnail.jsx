"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function CartItemThumbnail({ item, className }) {
  if (item.type === "video") {
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

  return (
    <Image src={item.image} alt={item.title} fill unoptimized className={className} />
  );
}
