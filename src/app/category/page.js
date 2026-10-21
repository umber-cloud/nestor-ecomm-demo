"use client";
import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import BreadCrumb from "@/components/breadcrumb";
import ProductCard from "@/components/products/productCard";
import { CATEGORY_ITEMS } from "@/data/categoryCatalog";
import {
  Gamepad2,
  Cpu,
  Laptop,
  HeartPulse,
  Compass,
  Layers,
  Sparkles,
  ArrowRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// The 5 requested categories
const CATEGORIES = [
  {
    id: "Fun",
    label: "Fun",
    tagline: "Handhelds & entertainment",
    icon: Gamepad2,
    accent: "from-purple-500/20 to-pink-500/10",
    badgeColor: "text-purple-400 border-purple-500/30",
  },
  {
    id: "AI",
    label: "AI",
    tagline: "Neural acoustics & optics",
    icon: Cpu,
    accent: "from-cyan-500/20 to-blue-500/10",
    badgeColor: "text-cyan-400 border-cyan-500/30",
  },
  {
    id: "Productivity",
    label: "Productivity",
    tagline: "Workstations, audio & rollables",
    icon: Laptop,
    accent: "from-amber-500/20 to-orange-500/10",
    badgeColor: "text-amber-400 border-amber-500/30",
  },
  {
    id: "Wellness",
    label: "Wellness",
    tagline: "Biometrics, sleep & air",
    icon: HeartPulse,
    accent: "from-emerald-500/20 to-teal-500/10",
    badgeColor: "text-emerald-400 border-emerald-500/30",
  },
  {
    id: "Travel",
    label: "Travel",
    tagline: "GaN power, routers & solar",
    icon: Compass,
    accent: "from-yellow-500/20 to-amber-500/10",
    badgeColor: "text-yellow-400 border-yellow-500/30",
  },
];

function CategoryPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("filter") || null;
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  const handleSelectCategory = (categoryId) => {
    setActiveCategory(categoryId);
    const query = categoryId ? `?filter=${encodeURIComponent(categoryId)}` : "";
    router.replace(`/category${query}`, { scroll: false });
  };

  // Filter products based on selected category
  const filteredProducts = useMemo(() => {
    if (!activeCategory || activeCategory.toLowerCase() === "all") {
      return CATEGORY_ITEMS;
    }
    return CATEGORY_ITEMS.filter(
      (item) => item.category.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [activeCategory]);

  const getItemCount = (categoryId) => {
    return CATEGORY_ITEMS.filter(
      (item) => item.category.toLowerCase() === categoryId.toLowerCase()
    ).length;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* Top Breadcrumb */}
      <div className="mt-16 pt-2 mb-6">
        <BreadCrumb />
      </div>

      {/* Hero Header */}
      <section className="mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-secondary">
              <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
              <span>TRANSMISSION // CATEGORY MATRIX</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black uppercase text-foreground mt-2">
              Shop by <span className="text-primary italic">Categories</span>
            </h1>
            <p className="font-mono text-xs sm:text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
              Curated hardware index spanning entertainment, generative AI interfaces, professional workspaces, biometric health, and high-mobility travel infrastructure.
            </p>
          </div>

          {/* ALL Reset Button */}
          <button
            onClick={() => handleSelectCategory(null)}
            className={cn(
              "self-start md:self-end font-mono text-xs uppercase tracking-widest px-4 py-2.5 border transition-all flex items-center gap-2",
              !activeCategory
                ? "border-primary bg-primary text-primary-foreground font-bold shadow-[0_0_16px_hsl(var(--primary)/0.35)]"
                : "border-border/80 hover:border-primary/80 bg-card/60 text-muted-foreground hover:text-foreground"
            )}
          >
            <Layers className="h-4 w-4" />
            <span>ALL ({CATEGORY_ITEMS.length})</span>
          </button>
        </div>

        {/* 5 Distinctive Category Boxes UI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory?.toLowerCase() === cat.id.toLowerCase();
            const count = getItemCount(cat.id);

            return (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(isSelected ? null : cat.id)}
                className={cn(
                  "group relative p-5 border text-left flex flex-col justify-between transition-all duration-300 min-h-[150px] overflow-hidden",
                  isSelected
                    ? "border-primary bg-primary/10 shadow-[0_0_24px_hsl(var(--primary)/0.25)] ring-1 ring-primary/60 -translate-y-1"
                    : "border-border/70 hover:border-primary/80 bg-card/80 hover:bg-card hover:-translate-y-0.5"
                )}
              >
                {/* HUD Corner Accents */}
                <div
                  className={cn(
                    "absolute -top-px -left-px h-3.5 w-3.5 border-t-2 border-l-2 transition-colors",
                    isSelected ? "border-primary" : "border-border group-hover:border-primary/80"
                  )}
                />
                <div
                  className={cn(
                    "absolute -bottom-px -right-px h-3.5 w-3.5 border-b-2 border-r-2 transition-colors",
                    isSelected ? "border-primary" : "border-border group-hover:border-primary/80"
                  )}
                />

                {/* Subtle gradient wash */}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-40 pointer-events-none transition-opacity",
                    cat.accent,
                    isSelected ? "opacity-90" : "group-hover:opacity-70"
                  )}
                />

                {/* Top: Units Count Badge + Icon */}
                <div className="relative z-10 flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      "font-mono text-[10px] px-2 py-0.5 border font-semibold tracking-wider whitespace-nowrap shrink-0",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background/80 text-muted-foreground group-hover:border-primary/50 group-hover:text-foreground"
                    )}
                  >
                    {count} {count === 1 ? "unit" : "units"}
                  </span>
                  <div
                    className={cn(
                      "h-9 w-9 shrink-0 rounded-none border flex items-center justify-center transition-all",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground shadow-[0_0_10px_hsl(var(--primary))]"
                        : "border-border bg-background/80 text-foreground group-hover:border-primary/70 group-hover:text-primary"
                    )}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                </div>

                {/* Bottom: Title & Tagline */}
                <div className="relative z-10 mt-4">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors truncate">
                    {cat.label}
                  </h3>
                  <p className="font-mono text-[11px] text-muted-foreground/85 mt-1.5 line-clamp-1 leading-snug">
                    {cat.tagline}
                  </p>
                </div>

                {/* Active Indicator Bar */}
                {isSelected && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary shadow-[0_0_10px_hsl(var(--primary))]" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Grid Header */}
      <div className="flex items-center justify-between border-b border-border/80 pb-4 mb-8">
        <div className="flex items-baseline gap-3">
          <h2 className="font-serif text-2xl sm:text-3xl text-foreground font-bold">
            {activeCategory ? `${activeCategory} Collection` : "All Categorized Hardware"}
          </h2>
          <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
            [{filteredProducts.length} {filteredProducts.length === 1 ? "PIECE" : "PIECES"}]
          </span>
        </div>

        {activeCategory && (
          <button
            onClick={() => handleSelectCategory(null)}
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
          >
            <span>Reset Filter</span>
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Products Grid — Same UI as Site Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-20">
        {filteredProducts.map((product, index) => (
          <ProductCard
            key={product.id || index}
            // collectionId passed from category item (used by ProductCard for cart management)
            collectionId={product.collectionId}
            cover={product.cover}
            title={product.title}
            price={product.price}
            priority={index < 4}
            onClick={() => {
              const query = activeCategory ? `?from=${encodeURIComponent(activeCategory)}` : "";
              router.push(`/category/${product.id}${query}`);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={null}>
      <CategoryPageContent />
    </Suspense>
  );
}
