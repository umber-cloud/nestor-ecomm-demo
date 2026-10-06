"use client";
import Link from "next/link";
import { PackageX, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Searchbar from "@/components/search";
import ProductGrid from "@/components/products/productGrid";

export default function NotFound() {
  return (
    <div className="py-4">
      <div className="relative overflow-hidden rounded-none mt-4 bg-card border border-primary/50 text-foreground px-8 md:px-14 py-16 md:py-24 text-center">
        {/* Decorative floating sparkles */}
        <Sparkles className="hidden sm:block absolute top-10 left-[12%] h-5 w-5 text-accent/60 animate-float" />
        <Sparkles className="hidden sm:block absolute bottom-14 right-[15%] h-4 w-4 text-secondary/60 animate-float-slow" />
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[10rem] sm:text-[14rem] leading-none text-primary/10 select-none pointer-events-none">
          404
        </span>

        <div className="relative">
          <div className="mx-auto h-20 w-20 sm:h-24 sm:w-24 rounded-none bg-foreground/10 backdrop-blur-sm flex items-center justify-center animate-float">
            <PackageX className="h-9 w-9 sm:h-10 sm:w-10 text-accent" />
          </div>

          <span className="inline-flex items-center rounded-none bg-foreground/10 px-3 py-1 text-xs uppercase tracking-[0.15em] mt-6">
            Lost in transit
          </span>

          <h1 className="text-3xl sm:text-5xl font-semibold mt-4">
            This page took a <em className="font-serif font-normal">wrong turn.</em>
          </h1>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or may have been
            moved. Try searching, or head back to somewhere familiar.
          </p>

          <div className="flex justify-center mt-8 [&_input]:bg-foreground/10 [&_input]:text-foreground [&_svg]:text-muted-foreground">
            <Searchbar />
          </div>

          <div className="flex flex-col xs:flex-row items-center justify-center gap-3 mt-6">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 w-full xs:w-auto">
              <Link href="/">Back to Home</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full xs:w-auto gap-2 bg-transparent border-primary/50 text-foreground hover:bg-primary hover:text-primary-foreground"
            >
              <Link href="/products">
                Browse Products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <ProductGrid />
    </div>
  );
}
