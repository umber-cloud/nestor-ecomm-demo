"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/lib/shopData";
import { fetchShowcaseFeed } from "@/lib/adnService";
import { ShowcaseFeed } from "@/components/showcase";
import { Skeleton } from "@/components/ui/skeleton";

// Showcase: a shoppable creator feed. All content (creators, posts,
// captions, media, tagged products) is published from Umber — see
// fetchShowcaseFeed() in adnService.js for the manifest shape.
export default function ShowcasePage() {
  const [feed, setFeed] = useState(undefined); // undefined = loading, null = unavailable

  useEffect(() => {
    let alive = true;
    (async () => {
      const products = await getProducts();
      const result = await fetchShowcaseFeed(products);
      if (alive) setFeed(result);
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="relative">
      {/* Soft full-width top glow, like a feed header */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-56 bg-gradient-to-b from-primary/15 via-primary/5 to-transparent pointer-events-none" />
      <div className="relative max-w-md mx-auto bg-background border-x border-border min-h-screen">
        <div className="px-3 pt-4 pb-3">
          <h1 className="font-serif text-2xl font-bold uppercase tracking-tight">Showcase</h1>
          <p className="font-mono text-[10px] tracking-widest text-muted-foreground">SHOP THE LOOK FROM CREATORS</p>
        </div>
        {feed === undefined ? (
          <div className="space-y-4 px-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-9 w-40 mb-2" />
                <Skeleton className="w-full aspect-[4/5]" />
              </div>
            ))}
          </div>
        ) : feed && feed.posts.length > 0 ? (
          <ShowcaseFeed feed={feed} />
        ) : (
          <p className="px-6 py-24 text-center font-mono text-xs tracking-widest text-muted-foreground">
            NO SHOWCASE POSTS PUBLISHED YET
          </p>
        )}
      </div>
    </div>
  );
}
