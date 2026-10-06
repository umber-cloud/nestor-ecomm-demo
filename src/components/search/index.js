'use client';
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

function Searchbar() {
    const [isMounted, setIsMounted] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [mobileOpen, setMobileOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleSearch = () => {
        const term = searchTerm.trim();
        if (term) {
            router.push(`/products?search=${encodeURIComponent(term)}`);
            setMobileOpen(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    if (!isMounted) {
        return null;
    }

    return (
        <div className="flex items-center">
            {/* Desktop Search */}
            <div className="relative hidden lg:flex">
                <Input
                    type="search"
                    id="search"
                    placeholder="Search products…"
                    className="w-44 xl:w-64 h-10 rounded-none border-primary/40 bg-background pr-9 font-mono text-xs tracking-wide focus-visible:ring-1 focus-visible:ring-primary"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <Search
                    className="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer w-4 h-4 text-muted-foreground hover:text-accent transition-colors"
                    onClick={handleSearch}
                />
            </div>

            {/* Mobile Search */}
            <div className="lg:hidden">
                {mobileOpen ? (
                    <div className="fixed inset-x-0 top-20 z-40 flex items-center gap-2 bg-background border-b border-border p-3">
                        <Input
                            autoFocus
                            type="search"
                            placeholder="Search for Products..."
                            className="flex-1 h-10 rounded-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button onClick={handleSearch} aria-label="Search" className="p-2">
                            <Search className="w-5 h-5 text-accent" />
                        </button>
                        <button onClick={() => setMobileOpen(false)} aria-label="Close search" className="p-2">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                ) : (
                    <button onClick={() => setMobileOpen(true)} aria-label="Open search" className="p-2">
                        <Search className="w-5 h-5 text-muted-foreground hover:text-accent transition-colors" />
                    </button>
                )}
            </div>
        </div>
    );
}

export default Searchbar;
