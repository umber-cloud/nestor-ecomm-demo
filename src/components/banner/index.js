"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button"; // Adjust path if necessary
import "./banner.module.css";
import bannerData from "@/lib/bannerData";
// Banner slide data


export default function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const autoplayRef = useRef(null);

  // Function to go to next slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerData.length);
  };

  // Function to go to previous slide
  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + bannerData.length) % bannerData.length
    );
  };

  // Function to go to a specific slide
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Setup autoplay
  useEffect(() => {
    autoplayRef.current = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, []);

  return (
    <div className="carousel-container relative w-full overflow-hidden">
      {/* Slides */}
      <div
        className="carousel-slides flex transition-transform duration-100 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {bannerData.map((slide) => (
          <div key={slide.id} className="carousel-slide w-full flex-shrink-0">
            <div className="flex flex-wrap bg-[#F7F5F6] rounded-lg gap-6 my-5 mt-20 p-6 md:p-10 justify-center items-center">
              {/* Text Content */}
              <div className="flex flex-col gap-4 text-left max-w-md p-5 md:p-0">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                  {slide.title1}
                  <br />
                  {slide.title2}
                </h1>
                <p className="text-gray-600 text-sm sm:text-base md:text-lg">
                  {slide.description}
                </p>
                <Button className="px-6 py-3 text-sm md:text-base lg:text-lg font-bold rounded-full self-start">
                  {slide.buttonText}
                </Button>
              </div>

              {/* Image */}
              <div className="w-full md:w-[500px] flex justify-center">
                <Image
                  src={slide.imageSrc}
                  width={1024}
                  height={720}
                  unoptimized
                  className="w-full max-w-[500px] h-auto object-contain"
                  alt={`banner image ${slide.id}`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-neutral-900 text-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 focus:outline-none z-10"
        aria-label="Previous slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-neutral-700 bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 focus:outline-none z-10"
        aria-label="Next slide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-1/2 transform mb-5 -translate-x-1/2 flex space-x-2 z-10">
        {bannerData.map((_, index) => (
          <button
            key={`dot-${index}`}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full focus:outline-none ${currentSlide === index
                ? "bg-gray-900"
                : "bg-gray-300 hover:bg-gray-400"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
}
