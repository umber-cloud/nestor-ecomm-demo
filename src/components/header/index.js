"use client";
import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import Searchbar from "../search";
import { ShoppingCart, User, Menu } from "lucide-react";
import { useCart } from "@/lib/cartContext";
import { CartSheet } from "@/components/CartSheet";

const components = [
    { title: "Home", href: "/" },
    { title: "Apparel", href: "/categories/Apparel" },
    { title: "Accessories", href: "/categories/Accessories" },
    { title: "Digital", href: "/categories/Digital" },
];

export default function Header() {
    const [isMounted, setIsMounted] = React.useState(false);
    const [cartOpen, setCartOpen] = React.useState(false);
    const [mobileOpen, setMobileOpen] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    const { getCartItemsCount } = useCart();
    const itemCount = isMounted ? getCartItemsCount() : 0;

    if (!isMounted) return null;

    return (
        <>
            <CartSheet isOpen={cartOpen} onClose={() => setCartOpen(false)} />

            <header className="fixed top-0 left-0 w-full z-50 px-3 pt-3">
                <nav className="max-w-7xl mx-auto h-16 px-4 md:px-6 flex justify-between items-center rounded-full bg-card/90 backdrop-blur-md border border-border shadow-sm">
                    <div className="flex items-center gap-1 md:hidden">
                        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                            <SheetTrigger asChild>
                                <button
                                    className="p-2 -ml-2 hover:text-accent transition-colors"
                                    aria-label="Open menu"
                                >
                                    <Menu className="w-5 h-5" />
                                </button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-72 bg-background rounded-r-3xl">
                                <nav className="mt-10 flex flex-col gap-1">
                                    {components.map((component, index) => (
                                        <Link
                                            key={index}
                                            href={component.href}
                                            onClick={() => setMobileOpen(false)}
                                            className="px-4 py-3 rounded-full text-base hover:bg-muted hover:text-accent transition-colors"
                                        >
                                            {component.title}
                                        </Link>
                                    ))}
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                        <Image
                            src="https://adn.umbercloud.io/api/va/67a06a45ea8a39c6628c71c3/nestorlogo/dev/generic"
                            alt="InfinityGadgets"
                            className="object-contain rounded-full"
                            width={30}
                            height={30}
                        />
                        <span className="font-semibold text-lg tracking-tight hidden sm:inline">
                            InfinityGadgets
                        </span>
                    </Link>

                    <NavigationMenu className="hidden md:flex">
                        <NavigationMenuList className="flex gap-1">
                            {components.map((component, index) => (
                                <NavigationMenuItem key={index}>
                                    <NavigationMenuLink
                                        href={component.href}
                                        className="rounded-full font-medium text-sm px-4 py-2 transition-colors hover:bg-muted hover:text-accent"
                                    >
                                        {component.title}
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>

                    <div className="flex items-center gap-1">
                        <Searchbar />

                        <button
                            onClick={() => setCartOpen(true)}
                            className="relative p-2 hover:bg-muted hover:text-accent rounded-full transition-colors"
                            aria-label="Open cart"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 min-w-[18px] px-1 bg-accent text-accent-foreground text-[10px] rounded-full flex items-center justify-center font-semibold">
                                    {itemCount > 99 ? "99+" : itemCount}
                                </span>
                            )}
                        </button>

                        <Link
                            href="/profile"
                            className="p-2 hover:bg-muted hover:text-accent rounded-full transition-colors"
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
