"use client";
import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import Searchbar from "../search";
import { ShoppingCart, User, Menu } from "lucide-react";
import { useCart } from "@/lib/cartContext";
import { CartSheet } from "@/components/CartSheet";
import { useCartFlyAnimation } from "@/components/cartFlyAnimation";

const components = [
    { title: "HOME", href: "/" },
    { title: "APPAREL", href: "/categories/Apparel" },
    { title: "ACCESSORIES", href: "/categories/Accessories" },
    { title: "DIGITAL", href: "/categories/Digital" },
];

export default function Header() {
    const [isMounted, setIsMounted] = React.useState(false);
    const [cartOpen, setCartOpen] = React.useState(false);
    const [mobileOpen, setMobileOpen] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    const { getCartItemsCount } = useCart();
    const { cartIconRef, pulseKey } = useCartFlyAnimation();
    const itemCount = isMounted ? getCartItemsCount() : 0;

    if (!isMounted) return null;

    return (
        <>
            <CartSheet isOpen={cartOpen} onClose={() => setCartOpen(false)} />

            <header className="fixed top-0 left-0 w-full z-50 border-b border-primary/40 bg-background/90 backdrop-blur-md">
                <nav className="max-w-7xl mx-auto h-16 px-4 md:px-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 lg:hidden">
                        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                            <SheetTrigger asChild>
                                <button
                                    className="p-2 -ml-2 text-primary hover:text-accent transition-colors"
                                    aria-label="Open menu"
                                >
                                    <Menu className="w-5 h-5" />
                                </button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[85vw] max-w-72 bg-background border-r border-primary/40 rounded-none">
                                <SheetTitle className="sr-only">Site menu</SheetTitle>
                                <SheetDescription className="sr-only">
                                    Browse product categories and site navigation links.
                                </SheetDescription>
                                <nav className="mt-12 flex flex-col gap-1 font-mono">
                                    <span className="px-4 pb-3 text-[11px] tracking-[0.3em] text-secondary">&gt; NAVIGATE</span>
                                    {components.map((component) => (
                                        <Link
                                            key={component.href}
                                            href={component.href}
                                            onClick={() => setMobileOpen(false)}
                                            className="px-4 py-3 border-l-2 border-transparent hover:border-primary hover:bg-muted text-sm tracking-widest transition-colors"
                                        >
                                            [ {component.title} ]
                                        </Link>
                                    ))}
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Link href="/" className="flex items-center gap-3 shrink-0 group">
                        <span className="relative flex h-8 w-8 items-center justify-center border-2 border-primary font-serif text-sm font-bold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            IG
                        </span>
                        <span className="hidden sm:flex flex-col leading-none">
                            <span className="font-serif text-sm font-bold tracking-[0.2em] text-foreground">INFINITY</span>
                            <span className="font-mono text-[10px] tracking-[0.35em] text-secondary">GADGETS_</span>
                        </span>
                    </Link>

                    <div className="hidden lg:flex items-center gap-1 font-mono text-xs tracking-widest">
                        {components.map((component) => (
                            <Link
                                key={component.href}
                                href={component.href}
                                className="px-3 py-2 text-muted-foreground hover:text-primary transition-colors"
                            >
                                [ {component.title} ]
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-1">
                        <Searchbar />

                        <button
                            ref={cartIconRef}
                            onClick={() => setCartOpen(true)}
                            className="relative p-2 text-primary hover:text-accent transition-colors"
                            aria-label="Open cart"
                        >
                            <span
                                key={pulseKey}
                                className={cn("relative block", pulseKey > 0 && "animate-cart-pop")}
                            >
                                <ShoppingCart className="w-5 h-5" />
                                {itemCount > 0 && (
                                    <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 bg-accent text-accent-foreground font-mono text-[10px] font-bold flex items-center justify-center">
                                        {itemCount > 99 ? "99+" : itemCount}
                                    </span>
                                )}
                            </span>
                        </button>

                        <Link
                            href="/profile"
                            className="p-2 text-primary hover:text-accent transition-colors"
                            aria-label="Account"
                        >
                            <User className="w-5 h-5" />
                        </Link>
                    </div>
                </nav>
            </header>
        </>
    );
}
