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
import Searchbar from "../search";
import { ShoppingCart, User } from "lucide-react";
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

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    const { getCartItemsCount } = useCart();
    const itemCount = isMounted ? getCartItemsCount() : 0;

    if (!isMounted) return null;

    return (
        <>
            {/* Cart drawer — available from header on every page */}
            <CartSheet isOpen={cartOpen} onClose={() => setCartOpen(false)} />

            <header>
                <nav className="w-full fixed h-16 bg-white shadow-md px-6 flex justify-between items-center z-50">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
                        <Image
                            src="https://https://adn.umbercloud.io/api/va/67a06a45ea8a39c6628c71c3/nestorlogo/dev/generic"
                            alt="Logo"
                            className="object-contain"
                            width={40}
                            height={40}
                        />
                        <h2 className="font-bold text-lg">InfinityGadgets</h2>
                    </Link>

                    {/* Nav links */}
                    <NavigationMenu className="hidden md:flex">
                        <NavigationMenuList className="flex gap-1">
                            {components.map((component, index) => (
                                <NavigationMenuItem key={index}>
                                    <NavigationMenuLink
                                        href={component.href}
                                        className={cn(
                                            "hover:bg-gray-100 transition-all font-base px-4 py-2 rounded-md"
                                        )}
                                    >
                                        {component.title}
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>

                    {/* Right side: search + cart + profile */}
                    <div className="flex items-center gap-3">
                        <Searchbar />

                        {/* Cart icon with badge */}
                        <button
                            onClick={() => setCartOpen(true)}
                            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Open cart"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-xs rounded-full flex items-center justify-center font-semibold">
                                    {itemCount > 99 ? '99+' : itemCount}
                                </span>
                            )}
                        </button>

                        {/* Profile */}
                        <Link href="/profile" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <User className="w-5 h-5" />
                        </Link>
                    </div>
                </nav>
            </header>
        </>
    );
}
