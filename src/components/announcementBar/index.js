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
 * - ZERO hardcoded messages: if the file is unreachable, nothing is rendered.
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
      className="relative z-50 w-full bg-neutral-950 text-white text-xs font-mono border-b border-white/10 transition-all duration-200"
    >
      <div className="max-w-7xl mx-auto h-9 px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Left Spacer for symmetrical centering on desktop */}
        <div className="hidden md:flex w-20 shrink-0" />

        {/* Center: Promotional Message & CTA */}
        <div className="flex-1 flex items-center justify-center gap-2 sm:gap-3 text-center overflow-hidden">
          {data.badge && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 text-[10px] uppercase font-bold tracking-widest shrink-0">
              <Sparkles className="w-2.5 h-2.5 animate-pulse" />
              {data.badge}
            </span>
          )}

          <p className="truncate text-[11px] sm:text-xs text-neutral-200 tracking-wide font-medium">
            {currentMessage}
          </p>

          {data.linkHref && data.linkText && (
            <Link
              href={data.linkHref}
              className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-primary hover:text-white transition-colors underline underline-offset-2 shrink-0 group ml-1"
            >
              <span>{data.linkText}</span>
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>

        {/* Right: Temporary Dismiss Button */}
        {data.dismissible !== false ? (
          <div className="flex items-center justify-end w-20 shrink-0">
            <button
              onClick={handleDismiss}
              className="p-1 rounded-sm text-neutral-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close announcement for now"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="hidden md:flex w-20 shrink-0" />
        )}
      </div>
    </aside>
  );
}
