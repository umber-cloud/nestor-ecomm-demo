'use client';
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, ShoppingBag, User2Icon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function Searchbar() {
    const [isMounted, setIsMounted] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleSearch = () => {
        if (searchTerm.trim()) {
            const formattedTerm = searchTerm.trim().charAt(0).toUpperCase() + searchTerm.trim().slice(1).toLowerCase();
            router.push(`/categories/${formattedTerm}`);
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
            <div className="relative hidden md:flex">
                <Input
                    type="search"
                    id="search"
                    placeholder="Search for Products..."
                    className="text-black w-60 md:w-72 lg:w-80 h-9 border-gray-300 p-3 shadow-sm rounded-none border bg-white focus-visible:ring-1 focus-visible:ring-black"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <Search
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer w-4 h-4 text-gray-500"
                    onClick={handleSearch}
                />
            </div>

            {/* Mobile Search Icon */}
            <div className="md:hidden">
                <Search className="cursor-pointer text-gray-500 hover:text-black w-5 h-5" />
            </div>
        </div>
    );
}

export default Searchbar;
