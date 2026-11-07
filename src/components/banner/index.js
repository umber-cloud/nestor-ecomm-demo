"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { BANNER_VIDEO_SLIDES, fetchBannerVideoSlides } from "@/lib/bannerData";

/**
 * Modern Full-Bleed Video Hero Carousel
 * Inspired by Samsung flagship hero UI (https://www.samsung.com/in/)
 *
 * Features:
 * - Edge-to-edge stretched background video canvas
 * - 3 flagship product video streams from Umber Cloud ADN:
 *     1. banner-iray (IRay Spectacles)
 *     2. banner-sc-bottle (IClean UV Bottle)
 *     3. banner-air-purifier (HEPA Air Purifier)
 * - Automatic slide progression: video plays completely once, then triggers the next product
 * - Real-time progress bar synced to video playback time
 * - Samsung-style bottom pill navigation with Play/Pause and Next/Prev controls
 * - High-contrast cinematic scrim ensuring optimal text legibility across all displays
 */
export default function Banner() {
  const [slides, setSlides] = useState(BANNER_VIDEO_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRefs = useRef([]);

  // Fetch live video assets dynamically from Umber Cloud ADN
  useEffect(() => {
    let isMounted = true;
    async function loadLiveVideos() {
      try {
        const liveSlides = await fetchBannerVideoSlides();
        if (isMounted && Array.isArray(liveSlides) && liveSlides.length > 0) {
          setSlides(liveSlides);
        }
      } catch (err) {
        console.warn("[Banner] Using fallback video slides:", err);
      }
    }
    loadLiveVideos();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalSlides = slides.length || 1;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsPlaying(true);
  };

  // Synchronize active video playback when slide index changes
  useEffect(() => {
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return;
      if (idx === currentSlide) {
        vid.currentTime = 0;
        const playPromise = vid.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch((err) => {
              console.warn("[Banner] Video autoplay blocked or deferred:", err.message);
            });
        }
      } else {
        vid.pause();
        vid.currentTime = 0;
      }
    });
    setProgress(0);
  }, [currentSlide]);

  // Handle Play / Pause user toggle
  const togglePlayPause = () => {
    const activeVid = videoRefs.current[currentSlide];
    if (!activeVid) return;

    if (isPlaying) {
      activeVid.pause();
      setIsPlaying(false);
    } else {
      activeVid.play();
      setIsPlaying(true);
    }
  };

  // Called when active video finishes playing once: seamlessly advances to next product
  const handleVideoEnded = () => {
    if (isPlaying) {
      nextSlide();
    }
  };

  // Update progress bar based on active video current playback time
  const handleTimeUpdate = (e, index) => {
    if (index !== currentSlide) return;
    const vid = e.target;
    if (vid.duration && !isNaN(vid.duration)) {
      const pct = (vid.currentTime / vid.duration) * 100;
      setProgress(Math.min(100, Math.max(0, pct)));
    }
  };

  const currentProduct = slides[currentSlide] || BANNER_VIDEO_SLIDES[0];

  return (
    <section
      style={{ marginTop: "calc(var(--header-height, 65px) - 104px)" }}
      className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] max-w-[100vw] overflow-hidden bg-black mb-16 select-none"
    >
      {/* Container with cinematic height responsive curve */}
      <div className="relative w-full h-[85vh] min-h-[580px] sm:min-h-[640px] md:min-h-[720px] lg:min-h-[780px] max-h-[920px]">
        {/* Layer 1: Background Video Carousel */}
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id || index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <video
                ref={(el) => {
                  videoRefs.current[index] = el;
                }}
                src={slide.videoUrl}
                playsInline
                muted
                autoPlay={isActive}
                preload={index === 0 ? "auto" : "metadata"}
                onEnded={handleVideoEnded}
                onTimeUpdate={(e) => handleTimeUpdate(e, index)}
                className="w-full h-full object-cover"
              />
            </div>
          );
        })}

        {/* Layer 2: Samsung-Style Cinematic Scrim Gradients */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-t from-black/95 via-black/50 to-black/25 md:bg-gradient-to-r md:from-black/90 md:via-black/55 md:to-transparent"
        />

        {/* Layer 3: Text Content & Call to Actions */}
        <div className="relative z-30 h-full max-w-7xl mx-auto px-6 sm:px-10 md:px-16 flex flex-col justify-center pb-24 md:pb-28">
          <div className="max-w-2xl flex flex-col gap-5 text-white">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 w-fit text-[11px] sm:text-xs font-mono uppercase tracking-[0.25em] text-white/90">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              {currentProduct.tagline}
            </div>

            {/* Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[1.05] text-white drop-shadow-md">
              {currentProduct.title1}
              <br />
              <span className="text-primary">{currentProduct.title2}</span>
            </h1>

            {/* Description */}
            <p className="font-sans text-sm sm:text-base md:text-lg text-white/80 max-w-xl leading-relaxed drop-shadow-sm font-light">
              {currentProduct.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={currentProduct.primaryHref || "/products"}
                className="group inline-flex items-center gap-3 bg-primary hover:bg-accent text-white px-7 sm:px-8 py-3.5 sm:py-4 rounded-full font-mono text-xs sm:text-sm font-bold uppercase tracking-widest transition-all duration-300 shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
              >
                {currentProduct.primaryBtnText}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              {currentProduct.secondaryHref && (
                <Link
                  href={currentProduct.secondaryHref}
                  className="inline-flex items-center px-6 sm:px-7 py-3.5 sm:py-4 rounded-full font-mono text-xs sm:text-sm font-medium uppercase tracking-widest text-white/90 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 transition-all duration-300 hover:-translate-y-0.5"
                >
                  {currentProduct.secondaryBtnText}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Layer 4: Samsung-Style Bottom Carousel Controller */}
        <div className="absolute bottom-6 sm:bottom-8 left-0 right-0 z-30">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Product Tabs with Live Progress Indicators */}
            <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar py-1">
              {slides.map((item, index) => {
                const isActive = index === currentSlide;
                return (
                  <button
                    key={item.id || index}
                    onClick={() => goToSlide(index)}
                    className={`group relative flex flex-col text-left transition-all duration-300 pb-2 cursor-pointer ${
                      isActive ? "opacity-100" : "opacity-45 hover:opacity-75"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-mono text-[10px] sm:text-xs text-white/60">
                        0{index + 1}
                      </span>
                      <span className="font-sans text-xs sm:text-sm font-medium text-white tracking-wide whitespace-nowrap">
                        {item.tabLabel}
                      </span>
                    </div>

                    {/* Progress Track */}
                    <div className="h-0.5 w-24 sm:w-36 md:w-44 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-100 ease-linear"
                        style={{
                          width: isActive ? `${progress}%` : index < currentSlide ? "100%" : "0%",
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Play/Pause & Chevron Navigation Controls */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              {/* Play / Pause Toggle */}
              <button
                onClick={togglePlayPause}
                className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-200"
                aria-label={isPlaying ? "Pause banner video" : "Play banner video"}
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-white ml-0.5" />}
              </button>

              {/* Prev Slide */}
              <button
                onClick={prevSlide}
                className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-200"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Next Slide */}
              <button
                onClick={nextSlide}
                className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-200"
                aria-label="Next slide"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
 * old hero banner
 * ============================================================================
 *
 * import { useState, useEffect, useRef } from "react";
 * import Image from "next/image";
 * import Link from "next/link";
 * import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
 * import { BANNER_SLIDES_CONFIG, fetchBannerSlides } from "@/lib/bannerData";
 *
 * export default function OldBanner() {
 *   const [slides, setSlides] = useState(BANNER_SLIDES_CONFIG);
 *   const [currentSlide, setCurrentSlide] = useState(0);
 *   const autoplayRef = useRef(null);
 *
 *   useEffect(() => {
 *     let isMounted = true;
 *     async function loadLiveBannerData() {
 *       try {
 *         const liveSlides = await fetchBannerSlides();
 *         if (isMounted && Array.isArray(liveSlides) && liveSlides.length > 0) {
 *           setSlides(liveSlides);
 *         }
 *       } catch (err) {
 *         console.error("Failed to load banner slides from Umber ADN:", err);
 *       }
 *     }
 *     loadLiveBannerData();
 *     return () => { isMounted = false; };
 *   }, []);
 *
 *   const totalSlides = slides.length || 1;
 *   const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
 *   const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
 *   const goToSlide = (index) => setCurrentSlide(index);
 *
 *   useEffect(() => {
 *     autoplayRef.current = setInterval(nextSlide, 6000);
 *     return () => { if (autoplayRef.current) clearInterval(autoplayRef.current); };
 *   }, [totalSlides]);
 *
 *   const slide = slides[currentSlide] || BANNER_SLIDES_CONFIG[0];
 *
 *   return (
 *     <section className="relative mt-4 border border-border bg-card shadow-xs overflow-hidden">
 *       <div className="relative flex flex-col-reverse md:flex-row items-stretch min-h-[460px] md:min-h-[560px]">
 *         <div className="flex flex-col justify-center gap-6 px-6 md:px-14 py-10 md:py-0 md:w-[48%]">
 *           <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-secondary font-semibold">
 *             <span className="h-2 w-2 bg-secondary animate-pulse" />
 *             Transmission {String(currentSlide + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
 *           </div>
 *           <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-[1.02] font-black uppercase text-foreground">
 *             {slide.title1}<br /><span className="text-primary">{slide.title2}</span>
 *           </h1>
 *           <p className="font-mono text-sm md:text-base text-muted-foreground max-w-md leading-relaxed">{slide.description}</p>
 *           <Link href={slide.href || "/products"} className="group inline-flex w-fit items-center gap-3 bg-primary text-primary-foreground px-6 py-3 font-mono text-sm font-bold uppercase tracking-widest hover:bg-accent transition-colors shadow-sm">
 *             {slide.buttonText}
 *             <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
 *           </Link>
 *         </div>
 *         <div className="relative md:w-[52%] h-72 md:h-auto flex items-center justify-center p-8 md:p-12">
 *           <div className="relative w-full h-full max-w-md max-h-96 border border-border bg-muted/40 p-4 shadow-sm">
 *             <div className="absolute top-2 left-3 font-mono text-[10px] tracking-widest text-secondary font-semibold">
 *               CH.0{currentSlide + 1} {"//"} LIVE
 *             </div>
 *             <div className="relative w-full h-full mt-4 flex items-center justify-center">
 *               {slide.imageSrc && (
 *                 <Image src={slide.imageSrc} fill unoptimized priority={currentSlide === 0} className="object-contain" alt={`${slide.title1} ${slide.title2}`} />
 *               )}
 *             </div>
 *           </div>
 *         </div>
 *       </div>
 *     </section>
 *   );
 * }
 * ============================================================================
 * end old hero banner
 * ============================================================================
 */
