"use client";
import React, { useState } from 'react'
import { Button } from "@/components/ui/button";
import { ShoppingBag, Truck, RotateCcw, ShieldCheck, Minus, Plus } from "lucide-react";

function ProductInfo({ product, onAddToCart }) {
    const [quantity, setQuantity] = useState(1);

    return (
        <div className="flex flex-col">
            <span className="inline-flex w-fit items-center rounded-full bg-muted px-3 py-1 text-xs uppercase tracking-[0.15em] text-accent font-medium">
                {product?.category}
            </span>

            <h1 className="text-3xl md:text-4xl font-semibold mt-4">{product?.title}</h1>
            <p className="text-2xl text-muted-foreground mt-2">{product?.price}</p>

            <p className="text-muted-foreground leading-relaxed mt-5">
                Meet the {product?.title} — thoughtfully designed within our{" "}
                <em className="font-serif not-italic md:italic">{product?.category?.toLowerCase()}</em>{" "}
                range, made to look good and hold up to everyday use.
            </p>

            <div className="flex items-center gap-3 mt-7">
                <div className="flex items-center border border-border rounded-full">
                    <button
                        className="h-11 w-11 flex items-center justify-center hover:text-accent transition-colors"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        aria-label="Decrease quantity"
                    >
                        <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{quantity}</span>
                    <button
                        className="h-11 w-11 flex items-center justify-center hover:text-accent transition-colors"
                        onClick={() => setQuantity((q) => q + 1)}
                        aria-label="Increase quantity"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </div>

                <Button
                    className="h-11 flex-1 text-base gap-2"
                    onClick={() => onAddToCart(quantity)}
                >
                    <ShoppingBag className="h-4 w-4" />
                    Add to Bag
                </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-8">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3.5 py-2 text-xs text-muted-foreground">
                    <Truck className="h-3.5 w-3.5 text-accent" />
                    Free shipping
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3.5 py-2 text-xs text-muted-foreground">
                    <RotateCcw className="h-3.5 w-3.5 text-accent" />
                    30-day returns
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3.5 py-2 text-xs text-muted-foreground">
                    <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                    Secure checkout
                </span>
            </div>
        </div>
    )
}

export default ProductInfo;
