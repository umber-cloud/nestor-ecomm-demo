/* eslint-disable @next/next/no-img-element -- imperative WAAPI clone needs a plain <img> ref, not next/image's wrapper */
"use client";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const CartFlyContext = createContext(null);

/**
 * Provides a site-wide "fly to cart" interaction: any add-to-cart control can
 * call flyToCart({ imageUrl, sourceEl }) to launch a clone of the product
 * image along an arced path into the header cart icon, which then pulses and
 * bursts into particles on arrival.
 */
export function CartFlyAnimationProvider({ children }) {
  const cartIconRef = useRef(null);
  const [flights, setFlights] = useState([]);
  const [bursts, setBursts] = useState([]);
  const [pulseKey, setPulseKey] = useState(0);

  const flyToCart = useCallback(({ imageUrl, sourceEl, mediaType = "image" }) => {
    if (!sourceEl || !imageUrl || !cartIconRef.current) return;

    // Normalize the source into a centered square so the clone always reads
    // as a circle, even when the triggering element (e.g. a wide "Add to
    // Bag" button) isn't square itself.
    const rawRect = sourceEl.getBoundingClientRect();
    const size = Math.min(rawRect.width, rawRect.height, 96);
    const sourceRect = {
      left: rawRect.left + (rawRect.width - size) / 2,
      top: rawRect.top + (rawRect.height - size) / 2,
      width: size,
      height: size,
    };
    const targetRect = cartIconRef.current.getBoundingClientRect();
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    setFlights((prev) => [...prev, { id, imageUrl, mediaType, sourceRect, targetRect }]);
  }, []);

  const landFlight = useCallback((id, targetRect) => {
    setFlights((prev) => prev.filter((f) => f.id !== id));
    setPulseKey((k) => k + 1);
    setBursts((prev) => [...prev, { id, rect: targetRect }]);
    setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== id));
    }, 650);
  }, []);

  return (
    <CartFlyContext.Provider value={{ cartIconRef, flyToCart, pulseKey }}>
      {children}
      {flights.map((flight) => (
        <FlyingItem
          key={flight.id}
          {...flight}
          onDone={() => landFlight(flight.id, flight.targetRect)}
        />
      ))}
      {bursts.map((burst) => (
        <SparkBurst key={burst.id} rect={burst.rect} />
      ))}
    </CartFlyContext.Provider>
  );
}

export function useCartFlyAnimation() {
  const ctx = useContext(CartFlyContext);
  if (!ctx) {
    throw new Error("useCartFlyAnimation must be used within a CartFlyAnimationProvider");
  }
  return ctx;
}

function FlyingItem({ imageUrl, mediaType, sourceRect, targetRect, onDone }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const dx = targetRect.left + targetRect.width / 2 - (sourceRect.left + sourceRect.width / 2);
    const dy = targetRect.top + targetRect.height / 2 - (sourceRect.top + sourceRect.height / 2);
    const arcLift = Math.max(120, Math.abs(dx) * 0.35);

    const animation = el.animate(
      [
        { transform: "translate(0px, 0px) scale(1) rotate(0deg)", opacity: 1, offset: 0 },
        {
          transform: `translate(${dx * 0.45}px, ${dy * 0.45 - arcLift}px) scale(0.75) rotate(18deg)`,
          opacity: 1,
          offset: 0.45,
        },
        {
          transform: `translate(${dx * 0.85}px, ${dy * 0.85 - arcLift * 0.25}px) scale(0.4) rotate(-10deg)`,
          opacity: 0.95,
          offset: 0.8,
        },
        {
          transform: `translate(${dx}px, ${dy}px) scale(0.1) rotate(6deg)`,
          opacity: 0.2,
          offset: 1,
        },
      ],
      { duration: 750, easing: "cubic-bezier(0.22, 0.9, 0.32, 1)", fill: "forwards" }
    );

    animation.onfinish = onDone;
    return () => animation.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = {
    position: "fixed",
    left: sourceRect.left,
    top: sourceRect.top,
    width: sourceRect.width,
    height: sourceRect.height,
    objectFit: "cover",
    borderRadius: "9999px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    zIndex: 200,
    pointerEvents: "none",
    willChange: "transform, opacity",
  };

  if (mediaType === "video") {
    return (
      <video
        ref={ref}
        src={imageUrl}
        style={style}
        muted
        autoPlay
        loop
        playsInline
        aria-hidden="true"
      />
    );
  }

  return <img ref={ref} src={imageUrl} alt="" aria-hidden="true" style={style} />;
}

const PARTICLE_COUNT = 10;

function SparkBurst({ rect }) {
  if (!rect) return null;
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  return (
    <>
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
        <SparkParticle key={i} cx={cx} cy={cy} index={i} />
      ))}
    </>
  );
}

function SparkParticle({ cx, cy, index }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const angle = (index / PARTICLE_COUNT) * Math.PI * 2 + Math.random() * 0.4;
    const distance = 22 + Math.random() * 18;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    const animation = el.animate(
      [
        { transform: "translate(0px, 0px) scale(1)", opacity: 1, offset: 0 },
        { transform: `translate(${dx * 0.6}px, ${dy * 0.6}px) scale(1.1)`, opacity: 1, offset: 0.4 },
        { transform: `translate(${dx}px, ${dy}px) scale(0)`, opacity: 0, offset: 1 },
      ],
      { duration: 480 + Math.random() * 120, delay: index * 12, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" }
    );

    return () => animation.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span
      ref={ref}
      style={{
        position: "fixed",
        left: cx - 3,
        top: cy - 3,
        width: 6,
        height: 6,
        borderRadius: "9999px",
        background: index % 2 === 0 ? "hsl(var(--accent))" : "hsl(var(--primary))",
        zIndex: 200,
        pointerEvents: "none",
      }}
    />
  );
}
