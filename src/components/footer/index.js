"use client"
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const emailSchema = z.object({
    email: z.string().email("Invalid email address"),
});

const linkColumns = [
    {
        heading: "Shop",
        links: [
            { label: "Apparel", href: "/categories/Apparel" },
            { label: "Accessories", href: "/categories/Accessories" },
            { label: "Digital", href: "/categories/Digital" },
        ],
    },
    {
        heading: "Support",
        links: [
            { label: "Contact Us", href: "/contactus" },
            { label: "Your Cart", href: "/cart" },
            { label: "Account", href: "/profile" },
        ],
    },
];

function Footer() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const { toast } = useToast();

    const handleSubmit = (e) => {
        e.preventDefault();

        const result = emailSchema.safeParse({ email });

        if (!result.success) {
            setError(result.error.errors[0].message);
            return;
        }

        setError("");
        toast({
            title: "Subscribed",
            description: `We'll send updates to ${email}`,
        });
        setEmail("");
    };

    return (
        <footer className="w-full mt-16 px-3 pb-3">
            <div className="max-w-7xl mx-auto rounded-[2rem] bg-primary text-primary-foreground">
                <div className="px-6 md:px-14 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="md:col-span-1 flex flex-col gap-4">
                        <span className="font-semibold text-xl">InfinityGadgets</span>
                        <p className="text-sm text-primary-foreground/60 max-w-xs">
                            A curated collection of apparel, accessories, and everyday
                            essentials — <em className="font-serif not-italic md:italic">thoughtfully made.</em>
                        </p>
                        <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Your email"
                                className="h-11 rounded-full bg-primary-foreground/10 border-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/50"
                            />
                            <Button type="submit" className="h-11 bg-accent text-accent-foreground hover:bg-accent/90 shrink-0">
                                Join
                            </Button>
                        </form>
                        {error && <span className="text-red-300 text-sm">{error}</span>}
                    </div>

                    <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-2 gap-10">
                        {linkColumns.map((col) => (
                            <div key={col.heading}>
                                <h4 className="font-medium text-sm tracking-wide uppercase mb-4 text-primary-foreground/50">
                                    {col.heading}
                                </h4>
                                <ul className="space-y-2.5 text-sm text-primary-foreground/80">
                                    {col.links.map((link) => (
                                        <li key={link.label}>
                                            <a href={link.href} className="hover:text-accent transition-colors">
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-primary-foreground/10 py-6 px-6 md:px-14 text-xs text-primary-foreground/50">
                    © {new Date().getFullYear()} InfinityGadgets. Commerce for everyone.
                </div>
            </div>
        </footer>
    );
}

export default Footer;
