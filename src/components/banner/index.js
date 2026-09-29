"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import bannerData from "@/lib/bannerData";

export default function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const autoplayRef = useRef(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerData.length) % bannerData.length);
  };

  const goToSlide = (index) => setCurrentSlide(index);

  useEffect(() => {
    autoplayRef.current = setInterval(nextSlide, 6000);
    return () => clearInterval(autoplayRef.current);
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-[2rem] mt-4 bg-primary text-primary-foreground">
      <div
        className="flex transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {bannerData.map((slide) => (
          <div key={slide.id} className="w-full flex-shrink-0">
            <div className="relative flex flex-col-reverse md:flex-row items-stretch min-h-[440px] md:min-h-[560px] overflow-hidden">
              {/* Text */}
              <div className="flex flex-col justify-center gap-5 px-8 md:px-14 py-10 md:py-0 md:w-[45%]">
                <span className="inline-flex w-fit items-center rounded-full bg-secondary/20 text-secondary-foreground/90 px-3 py-1 text-xs uppercase tracking-[0.15em] text-secondary">
                  New Arrivals
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-[3.2rem] leading-[1.05] text-balance font-semibold">
                  {slide.title1}
                  <br />
                  <em className="font-serif font-normal">{slide.title2}</em>
                </h1>
                <p className="text-primary-foreground/70 text-base md:text-lg max-w-md">
                  {slide.description}
                </p>
                <Button
                  asChild
                  size="lg"
                  className="self-start bg-accent text-accent-foreground hover:bg-accent/90 group"
                >
                  <Link href={slide.href || "/products"}>
                    {slide.buttonText}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>

              {/* Image */}
              <div className="relative md:w-[55%] h-64 md:h-auto flex items-center justify-center p-6 md:p-10">
                <div className="relative w-full h-full max-w-md max-h-72 md:max-h-96">
                  <Image
                    src={slide.imageSrc}
                    fill
                    unoptimized
                    priority={slide.id === 1}
                    className="object-contain drop-shadow-2xl"
                    alt={`${slide.title1} ${slide.title2}`}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="hidden md:block absolute left-5 top-1/2 -translate-y-1/2 bg-primary-foreground/10 hover:bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground rounded-full p-2.5 transition-colors z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={nextSlide}
        className="hidden md:block absolute right-5 top-1/2 -translate-y-1/2 bg-primary-foreground/10 hover:bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground rounded-full p-2.5 transition-colors z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-8 md:left-14 flex gap-2 z-10">
        {bannerData.map((_, index) => (
          <button
            key={`dot-${index}`}
            onClick={() => goToSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentSlide === index ? "w-6 bg-accent" : "w-1.5 bg-primary-foreground/30 hover:bg-primary-foreground/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
