"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { X, ArrowRight, Sparkles } from "lucide-react";
import { fetchAnnouncement } from "@/lib/adnService";

/**
 * Top Promotion & Announcement Banner Component
 * Displays exclusively on the Homepage ("/") above the fixed navbar.
 *
 * Rules:
 * - 100% dynamic from Umber ADN Virtual Asset (/va) endpoint.
 * - Max horizontal space allocated to message text: never truncates.
 * - Always shows on page refresh (no persistence of dismissal).
 */
export default function AnnouncementBar({ onVisibilityChange }) {
  const pathname = usePathname();
  const [data, setData] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);

  // Fetch live JSON directly from Umber ADN /va endpoint
  useEffect(() => {
    let isMounted = true;

    async function loadAnnouncement() {
      try {
        const liveData = await fetchAnnouncement("store-announcement");
        if (isMounted) {
          if (liveData && liveData.enabled !== false) {
            setData(liveData);
          } else {
            setData(null);
          }
        }
      } catch (err) {
        if (isMounted) {
          setData(null);
        }
        console.warn("[AnnouncementBar] /va endpoint unavailable:", err.message);
      }
    }

    loadAnnouncement();
    return () => {
      isMounted = false;
    };
  }, []);

  // Resolve message array dynamically from live Umber JSON
  const messages = (() => {
    if (!data) return [];
    if (data.message) {
      if (Array.isArray(data.messages) && data.messages.length > 0) {
        const additional = data.messages.filter((m) => m !== data.message);
        return [data.message, ...additional];
      }
      return [data.message];
    }
    if (Array.isArray(data.messages) && data.messages.length > 0) {
      return data.messages;
    }
    return [];
  })();

  // Rotate messages if multiple exist in the Umber JSON
  useEffect(() => {
    if (messages.length <= 1) return;
    const timer = setInterval(() => {
      setActiveMessageIndex((prev) => (prev + 1) % messages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [messages.length]);

  // Sync rendered visibility with Header to dynamically adjust --header-height
  const shouldRender =
    pathname === "/" &&
    isVisible &&
    data !== null &&
    data.enabled !== false &&
    messages.length > 0;

  useEffect(() => {
    if (onVisibilityChange) {
      onVisibilityChange(shouldRender);
    }
  }, [shouldRender, onVisibilityChange]);

  // If not on homepage, or if no JSON received from Umber, render NOTHING
  if (!shouldRender) {
    return null;
  }

  // Temporary dismissal for current view (never persisted)
  const handleDismiss = () => {
    setIsVisible(false);
  };

  const currentMessage = messages[activeMessageIndex] || messages[0];

  return (
    <aside
      role="banner"
      aria-label="Promotional announcement"
      className="relative z-50 w-full bg-neutral-950 text-white font-mono border-b border-white/10 transition-all duration-200"
    >
      <div className="w-full max-w-screen-2xl mx-auto min-h-[48px] sm:min-h-[56px] px-4 sm:px-12 md:px-16 flex items-center justify-center relative py-2.5">
        {/* Center: Promotional Message & CTA - Full available width without artificial truncation */}
        <div className="w-full flex items-center justify-center gap-2 sm:gap-3.5 flex-wrap text-center pr-8 sm:pr-0">
          {data.badge && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 text-[11px] sm:text-xs uppercase font-bold tracking-widest shrink-0">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              {data.badge}
            </span>
          )}

          <p className="text-xs sm:text-sm md:text-[15px] lg:text-base text-neutral-100 font-medium tracking-wide">
            {currentMessage}
          </p>

          {data.linkHref && data.linkText && (
            <Link
              href={data.linkHref}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm md:text-[15px] font-bold text-primary hover:text-white transition-colors underline underline-offset-4 shrink-0 whitespace-nowrap group ml-0.5"
            >
              <span>{data.linkText}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>

        {/* Right: Absolute-positioned Dismiss Button (does not shrink the text container) */}
        {data.dismissible !== false && (
          <div className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 flex items-center">
            <button
              onClick={handleDismiss}
              className="p-1.5 rounded-sm text-neutral-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close announcement for now"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
