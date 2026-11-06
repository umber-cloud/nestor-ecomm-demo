"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { BANNER_SLIDES_CONFIG, fetchBannerSlides } from "@/lib/bannerData";

/**
 * Hero Banner Carousel Component
 * Displays 3 flagship hero slides:
 * 1. Spectacles (IRay glasses / ray-bans)
 * 2. Air Purifier (Smart HEPA Room Air Purifier - golden+blue image)
 * 3. Flagship Headphones (Soly)
 *
 * Media URLs are dynamically resolved from Umber ADN collection anchor assets.
 */
export default function Banner() {
  const [slides, setSlides] = useState(BANNER_SLIDES_CONFIG);
  const [currentSlide, setCurrentSlide] = useState(0);
  const autoplayRef = useRef(null);

  // Dynamically hydrate anchor images from deployed Umber ADN endpoints
  useEffect(() => {
    let isMounted = true;

    async function loadLiveBannerData() {
      try {
        const liveSlides = await fetchBannerSlides();
        if (isMounted && Array.isArray(liveSlides) && liveSlides.length > 0) {
          setSlides(liveSlides);
        }
      } catch (err) {
        console.error("Failed to load banner slides from Umber ADN:", err);
      }
    }

    loadLiveBannerData();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalSlides = slides.length || 1;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => setCurrentSlide(index);

  // Continuous autoplay cycle
  useEffect(() => {
    autoplayRef.current = setInterval(nextSlide, 6000);
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [totalSlides]);

  const slide = slides[currentSlide] || BANNER_SLIDES_CONFIG[0];

  return (
    <section className="relative mt-4 border border-border bg-card shadow-xs overflow-hidden">
      {/* Subtle architectural grid pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative flex flex-col-reverse md:flex-row items-stretch min-h-[460px] md:min-h-[560px]">
        {/* Left Column: Product Information & CTAs */}
        <div className="flex flex-col justify-center gap-6 px-6 md:px-14 py-10 md:py-0 md:w-[48%]">
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-secondary font-semibold">
            <span className="h-2 w-2 bg-secondary animate-pulse" />
            Transmission {String(currentSlide + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-[1.02] font-black uppercase text-foreground">
            {slide.title1}
            <br />
            <span className="text-primary">{slide.title2}</span>
          </h1>

          <p className="font-mono text-sm md:text-base text-muted-foreground max-w-md leading-relaxed">
            {slide.description}
          </p>

          <Link
            href={slide.href || "/products"}
            className="group inline-flex w-fit items-center gap-3 bg-primary text-primary-foreground px-6 py-3 font-mono text-sm font-bold uppercase tracking-widest hover:bg-accent transition-colors shadow-sm"
          >
            {slide.buttonText}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Right Column: Dynamic Media Frame */}
        <div className="relative md:w-[52%] h-72 md:h-auto flex items-center justify-center p-8 md:p-12">
          <div className="relative w-full h-full max-w-md max-h-96 border border-border bg-muted/40 p-4 shadow-sm">
            <div className="absolute -top-px -left-px h-5 w-5 border-t-2 border-l-2 border-accent" />
            <div className="absolute -bottom-px -right-px h-5 w-5 border-b-2 border-r-2 border-accent" />
            <div className="absolute top-2 left-3 font-mono text-[10px] tracking-widest text-secondary font-semibold">
              CH.0{currentSlide + 1} {"//"} LIVE
            </div>
            <div className="relative w-full h-full mt-4 flex items-center justify-center">
              {slide.imageSrc ? (
                <Image
                  src={slide.imageSrc}
                  fill
                  unoptimized
                  priority={currentSlide === 0}
                  className="object-contain transition-opacity duration-300"
                  alt={`${slide.title1} ${slide.title2}`}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 animate-pulse bg-muted/20">
                  <span className="h-3 w-3 bg-secondary/60 animate-ping rounded-full" />
                  <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest">
                    Streaming Umber ADN...
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Manual Left Arrow Navigation */}
      <button
        onClick={prevSlide}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 items-center justify-center h-10 w-10 border border-border bg-card/90 text-foreground hover:bg-primary hover:text-primary-foreground shadow-sm transition-colors z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Manual Right Arrow Navigation */}
      <button
        onClick={nextSlide}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 items-center justify-center h-10 w-10 border border-border bg-card/90 text-foreground hover:bg-primary hover:text-primary-foreground shadow-sm transition-colors z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Pagination Dot Indicators */}
      <div className="absolute bottom-5 left-6 md:left-14 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={`dot-${index}`}
            onClick={() => goToSlide(index)}
            className={`h-1.5 transition-all duration-300 ${
              currentSlide === index ? "w-8 bg-primary" : "w-3 bg-border hover:bg-primary/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
