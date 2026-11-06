"use client";

/** Row of color-variant swatches. Unavailable variants are muted and unclickable. */
function ColorSwatches({ variants, activeId, onSelect }) {
  if (!Array.isArray(variants) || variants.length === 0) return null;

  const activeVariant = variants.find((v) => v.id === activeId);

  return (
    <div className="flex flex-col gap-2 mt-5">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        Color{activeVariant ? ` — ${activeVariant.label}` : ""}
      </span>
      <div className="flex items-center gap-2.5">
        {variants.map((variant) => {
          const isActive = variant.id === activeId;
          const isAvailable = variant.available !== false;
          return (
            <button
              key={variant.id}
              type="button"
              disabled={!isAvailable}
              title={isAvailable ? variant.label : `${variant.label} — Out of stock`}
              aria-label={variant.label}
              onClick={() => isAvailable && onSelect?.(variant.id)}
              className={`relative h-8 w-8 rounded-full border-2 transition-all ${
                isActive ? "border-primary scale-110" : "border-border"
              } ${
                isAvailable
                  ? "cursor-pointer hover:border-primary/60"
                  : "cursor-not-allowed opacity-30"
              }`}
              style={{ backgroundColor: variant.hex }}
            >
              {!isAvailable && (
                <span className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full">
                  <span className="h-[150%] w-[1.5px] bg-destructive rotate-45" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ColorSwatches;
