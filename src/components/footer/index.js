"use client"
import React, { useState } from 'react';
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const emailSchema = z.object({
    email: z.string().email("Invalid email address"),
});

const linkColumns = [
    {
        heading: "SHOP",
        links: [
            { label: "Apparel", href: "/categories/Apparel" },
            { label: "Accessories", href: "/categories/Accessories" },
            { label: "Digital", href: "/categories/Digital" },
        ],
    },
    {
        heading: "SUPPORT",
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
            description: `Signal locked. Updates to ${email}`,
        });
        setEmail("");
    };

    return (
        <footer className="relative w-full mt-24 mb-4">
            <div className="relative border border-border bg-card/80 backdrop-blur-sm">
                <div className="absolute -top-px -left-px h-4 w-4 border-t-2 border-l-2 border-primary" />
                <div className="absolute -top-px -right-px h-4 w-4 border-t-2 border-r-2 border-primary" />
                <div className="absolute -bottom-px -left-px h-4 w-4 border-b-2 border-l-2 border-primary" />
                <div className="absolute -bottom-px -right-px h-4 w-4 border-b-2 border-r-2 border-primary" />

                <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                    <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                        SYS.ONLINE
                    </span>
                    <span className="hidden sm:inline">BUILD 2.0 {"//"} ARCADE-GRADE GADGETS</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 px-5 md:px-10 py-12">
                    <div className="md:col-span-5 flex flex-col gap-5">
                        <span className="font-serif text-2xl font-bold tracking-wider text-primary">
                            INFINITY<span className="text-accent">{"//"}</span>GADGETS
                        </span>
                        <p className="font-mono text-sm text-muted-foreground max-w-sm leading-relaxed">
                            Curated tech for the tinkerers, night-shift coders and retro-futurists.
                        </p>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-2 max-w-md">
                            <label htmlFor="footer-email" className="font-mono text-xs uppercase tracking-widest text-secondary">
                                $ subscribe --feed
                            </label>
                            <div className="flex items-stretch border border-border bg-background">
                                <span className="flex items-center px-3 font-mono text-primary">&gt;</span>
                                <input
                                    id="footer-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@domain.tld"
                                    className="flex-1 min-w-0 bg-transparent py-3 pr-3 font-mono text-sm outline-none placeholder:text-muted-foreground/60"
                                />
                                <button
                                    type="submit"
                                    className="px-5 font-mono text-xs font-bold uppercase tracking-widest bg-primary text-primary-foreground hover:bg-accent transition-colors"
                                >
                                    Join
                                </button>
                            </div>
                            {error && <span className="font-mono text-xs text-destructive">{error}</span>}
                        </form>
                    </div>

                    <div className="md:col-span-7 grid grid-cols-2 gap-10">
                        {linkColumns.map((col) => (
                            <div key={col.heading}>
                                <h4 className="font-mono text-xs font-bold tracking-[0.25em] text-secondary mb-5">
                                    &gt; {col.heading}
                                </h4>
                                <ul className="space-y-3 font-sans text-sm">
                                    {col.links.map((link) => (
                                        <li key={link.label}>
                                            <a href={link.href} className="group inline-flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors">
                                                <span className="font-mono text-primary opacity-0 group-hover:opacity-100 transition-opacity">{'>'}</span>
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-border px-5 md:px-10 py-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                    <span>© {new Date().getFullYear()} INFINITYGADGETS {"//"} ALL SYSTEMS NOMINAL</span>
                    <span>[ EST. 2026 ]</span>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
