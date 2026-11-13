"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Share2, Volume2, VolumeX, ShoppingBag, Plus, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAddToCart } from "@/lib/useAddToCart";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";

// ---------------------------------------------------------------------------
// Studio feed, modelled on Myntra Studio: one narrow phone-width column of
// creator posts. Each post = creator row (avatar, name, Follow, time), a
// swipeable photo/video carousel, a strip of tagged products with "SHOP ALL",
// like / share actions and a hashtag caption. A "Recommended for you" row of
// followable accounts is interleaved every few posts.
//
// All content (creators, posts, captions, media, tagged products) is supplied
// by Umber via fetchStudioFeed(). Likes and follows are per-browser
// (localStorage); there is no backend for them.
// ---------------------------------------------------------------------------

const PALETTE = ["#e11d48", "#2563eb", "#059669", "#d97706", "#7c3aed", "#0891b2"];
const hash = (s) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
};
const timeAgo = (iso) => {
  if (!iso) return "";
  const mins = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return `${mins}m`;
  if (mins < 60 * 24) return `${Math.round(mins / 60)}h`;
  if (mins < 60 * 24 * 30) return `${Math.round(mins / 1440)}d`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};
const productHref = (p) => `/products/${encodeURIComponent(p.title.replace(/\s+/g, "-"))}`;
const priceNumber = (p) => parseFloat(String(p.price).replace(/[$,]/g, ""));

function useLocalSet(key) {
  const [set, setSet] = useState({});
  useEffect(() => {
    try {
      setSet(JSON.parse(localStorage.getItem(key) || "{}"));
    } catch {}
  }, [key]);
  const toggle = useCallback(
    (id) =>
      setSet((prev) => {
        const next = { ...prev };
        if (next[id]) delete next[id];
        else next[id] = true;
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch {}
        return next;
      }),
    [key]
  );
  return [set, toggle];
}

function Avatar({ creator, size = 36 }) {
  if (creator.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={creator.avatarUrl}
        alt={creator.name}
        width={size}
        height={size}
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      className="inline-flex items-center justify-center rounded-full text-white font-serif font-bold shrink-0"
      style={{ width: size, height: size, background: PALETTE[hash(creator.id) % PALETTE.length], fontSize: size * 0.4 }}
    >
      {creator.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")}
    </span>
  );
}

function FollowButton({ followed, onClick, plus = false }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "font-mono text-[11px] font-bold tracking-widest uppercase transition-colors",
        followed ? "text-muted-foreground" : "text-primary hover:text-accent"
      )}
    >
      {followed ? "Following" : plus ? "+ Follow" : "Follow"}
    </button>
  );
}

/** Swipeable carousel of a post's photos/videos with dots and a mute toggle. */
function MediaCarousel({ items, title }) {
  const scrollerRef = useRef(null);
  const wrapRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [inView, setInView] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRefs = useRef({});

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Only the visible slide of an on-screen post plays.
  useEffect(() => {
    items.forEach((m, i) => {
      const v = videoRefs.current[m.assetItemId];
      if (!v) return;
      if (inView && i === index) v.play().catch(() => {});
      else v.pause();
    });
  }, [inView, index, items]);

  const current = items[index];
  return (
    <div ref={wrapRef} className="relative bg-muted">
      <div
        ref={scrollerRef}
        onScroll={(e) => setIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((m, i) => (
          <div key={m.assetItemId} className="relative shrink-0 w-full snap-center aspect-[4/5] bg-black">
            {m.type === "video" ? (
              <video
                ref={(el) => (videoRefs.current[m.assetItemId] = el)}
                src={m.url}
                className="absolute inset-0 w-full h-full object-cover"
                loop
                muted={muted}
                playsInline
                preload="metadata"
              />
            ) : (
              <Image
                src={m.url}
                alt={`${title} ${i + 1}`}
                fill
                sizes="(max-width: 448px) 100vw, 448px"
                className="object-cover"
                unoptimized
              />
            )}
          </div>
        ))}
      </div>
      {items.length > 1 && (
        <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1 pointer-events-none">
          {items.map((m, i) => (
            <span
              key={m.assetItemId}
              className={cn("h-1.5 rounded-full transition-all", i === index ? "w-4 bg-white" : "w-1.5 bg-white/50")}
            />
          ))}
        </div>
      )}
      {current?.type === "video" && (
        <button
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? "Unmute" : "Mute"}
          className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-black/55 text-white flex items-center justify-center"
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
}

function TaggedCard({ product }) {
  return (
    <Link
      href={productHref(product)}
      className="flex items-center gap-2.5 shrink-0 w-[200px] border border-border bg-card p-1.5 hover:border-primary transition-colors"
    >
      <span className="relative h-14 w-14 shrink-0 bg-muted overflow-hidden">
        {product.cover?.type === "image" && product.cover?.url && (
          <Image src={product.cover.url} alt="" fill sizes="56px" className="object-cover" unoptimized />
        )}
        {product.cover?.type === "video" && (
          <video src={product.cover.url} className="absolute inset-0 w-full h-full object-cover" muted playsInline preload="metadata" />
        )}
      </span>
      <span className="min-w-0">
        <span className="block font-serif text-xs font-bold uppercase tracking-tight truncate">{product.title}</span>
        <span className="block font-mono text-xs text-primary font-bold mt-0.5">{product.price}</span>
      </span>
    </Link>
  );
}

function ShopSheet({ open, onOpenChange, products }) {
  const addProductToCart = useAddToCart();
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto rounded-none max-w-md mx-auto">
        <SheetTitle className="font-mono text-xs tracking-[0.3em] uppercase">Shop this post</SheetTitle>
        <SheetDescription className="sr-only">Products featured in this post.</SheetDescription>
        <ul className="mt-4 divide-y divide-border">
          {products.map((p) => (
            <li key={p.collectionId} className="flex items-center gap-3 py-3">
              <Link href={productHref(p)} className="relative h-16 w-16 shrink-0 bg-muted overflow-hidden">
                {p.cover?.type === "image" && p.cover?.url && (
                  <Image src={p.cover.url} alt="" fill sizes="64px" className="object-cover" unoptimized />
                )}
              </Link>
              <Link href={productHref(p)} className="min-w-0 flex-1">
                <span className="block font-serif text-sm font-bold uppercase tracking-tight truncate">{p.title}</span>
                <span className="block font-mono text-sm text-primary font-bold">{p.price}</span>
              </Link>
              <button
                onClick={(e) =>
                  addProductToCart({
                    product: {
                      id: p.collectionId,
                      title: p.title,
                      price: priceNumber(p),
                      image: p.cover?.url || null,
                      type: p.cover?.type || "image",
                    },
                    sourceEl: e.currentTarget,
                  })
                }
                aria-label={`Add ${p.title} to bag`}
                className="h-9 px-3 flex items-center gap-1.5 bg-primary text-primary-foreground font-mono text-[11px] tracking-widest hover:bg-accent transition-colors"
              >
                <ShoppingBag className="h-3.5 w-3.5" /> ADD
              </button>
            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  );
}

function Post({ post, liked, onLike, followed, onFollow, onShare }) {
  const creator = post.creator;
  const [sheetOpen, setSheetOpen] = useState(false);
  const likeCount = post.likes === null ? null : post.likes + (liked ? 1 : 0);

  return (
    <article className="bg-card border-b border-border">
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <Avatar creator={creator} />
        <div className="flex items-center gap-1 min-w-0">
          <span className="font-serif text-sm font-bold truncate">{creator.name}</span>
          {creator.verified && <BadgeCheck className="h-3.5 w-3.5 text-primary shrink-0" />}
        </div>
        <span className="text-muted-foreground">·</span>
        <FollowButton followed={followed} onClick={onFollow} />
        <span className="ml-auto font-mono text-[10px] text-muted-foreground">{timeAgo(post.publishedAt)}</span>
      </div>

      <MediaCarousel items={post.media} title={creator.name} />

      {post.tagged.length > 0 && (
      <div className="flex items-center gap-2 px-3 py-2.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          onClick={() => setSheetOpen(true)}
          className="shrink-0 h-[68px] px-3 border border-primary text-primary font-mono text-[11px] font-bold tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          SHOP ALL
          <span className="block text-[10px] font-normal opacity-80">{post.tagged.length} items</span>
        </button>
        {post.tagged.map((p) => (
          <TaggedCard key={p.collectionId} product={p} />
        ))}
      </div>
      )}

      <div className="flex items-center gap-4 px-3 pb-1">
        <button onClick={onLike} aria-label={liked ? "Unlike" : "Like"} className="flex items-center gap-1.5">
          <Heart className={cn("h-5 w-5 transition-transform active:scale-125", liked && "fill-red-500 text-red-500")} />
          {likeCount !== null && <span className="font-mono text-xs">{likeCount}</span>}
        </button>
        <button onClick={onShare} aria-label="Share" className="flex items-center gap-1.5 text-foreground/80 hover:text-primary">
          <Share2 className="h-5 w-5" />
        </button>
      </div>
      {(post.caption || post.tags.length > 0) && (
        <p className="px-3 pb-3 text-sm leading-snug">
          <span className="font-bold font-serif">{creator.handle}</span> {post.caption}{" "}
          <span className="text-primary">{post.tags.map((t) => `#${t.replace(/^#/, "")}`).join(" ")}</span>
        </p>
      )}

      <ShopSheet open={sheetOpen} onOpenChange={setSheetOpen} products={post.tagged} />
    </article>
  );
}

function Recommended({ creators, follows, onFollow }) {
  if (creators.length === 0) return null;
  return (
    <section className="bg-muted/50 border-b border-border py-3">
      <div className="flex items-center justify-between px-3 mb-2.5">
        <h2 className="font-serif text-sm font-bold">Recommended for you</h2>
      </div>
      <div className="flex gap-2.5 px-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {creators.map((c) => (
          <div key={c.id} className="shrink-0 w-[150px] bg-card border border-border p-3 flex flex-col items-center text-center">
            <Avatar creator={c} size={52} />
            <p className="font-serif text-sm font-bold mt-2 truncate max-w-full">{c.name}</p>
            <p className="text-[11px] text-muted-foreground leading-tight mt-1 line-clamp-3 min-h-[42px]">{c.bio}</p>
            <button
              onClick={() => onFollow(c.id)}
              className={cn(
                "mt-2 w-full py-1.5 border font-mono text-[11px] font-bold tracking-widest transition-colors",
                follows[c.id]
                  ? "border-border text-muted-foreground"
                  : "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              )}
            >
              {follows[c.id] ? "FOLLOWING" : "+ FOLLOW"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export function StudioFeed({ feed }) {
  const [likes, toggleLike] = useLocalSet("studio-likes");
  const [follows, toggleFollow] = useLocalSet("studio-follows");
  const [visibleCount, setVisibleCount] = useState(6);
  const sentinelRef = useRef(null);
  const posts = feed.posts;

  // Infinite scroll: reveal more posts as the sentinel nears the viewport.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisibleCount((c) => Math.min(c + 4, posts.length)),
      { rootMargin: "600px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [posts.length]);

  const share = async (post) => {
    const url = `${window.location.origin}/studio`;
    try {
      if (navigator.share) await navigator.share({ title: `${post.creator.name} on Studio`, url });
      else await navigator.clipboard.writeText(url);
    } catch {}
  };

  return (
    <div>
      {posts.slice(0, visibleCount).map((post, i) => (
        <div key={post.id}>
          <Post
            post={post}
            liked={Boolean(likes[post.id])}
            onLike={() => toggleLike(post.id)}
            followed={Boolean(follows[post.creator.id])}
            onFollow={() => toggleFollow(post.creator.id)}
            onShare={() => share(post)}
          />
          {(i + 1) % 4 === 0 && <Recommended creators={feed.creators} follows={follows} onFollow={toggleFollow} />}
        </div>
      ))}
      <div ref={sentinelRef} className="h-10" />
      {visibleCount >= posts.length && (
        <p className="py-6 text-center font-mono text-[11px] tracking-widest text-muted-foreground">YOU&apos;RE ALL CAUGHT UP</p>
      )}
    </div>
  );
}
