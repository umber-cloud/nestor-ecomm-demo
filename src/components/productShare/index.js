import React, { useEffect, useRef, useState } from "react";
import {
    Share,
    Mail,
    MessageCircleMore,
    Facebook,
    Twitter,
    Link as LinkIcon,
    Check
} from "lucide-react";

// Pinterest SVG (Lucide doesn't support it natively)
const PinterestIcon = () => (
    <svg
        className="w-4 h-4 mr-2"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
    >
        <path d="M12 0C5.373 0 0 5.372 0 12c0 4.991 3.657 9.128 8.438 10.243-.117-.87-.222-2.204.046-3.154.243-.83 1.561-5.29 1.561-5.29s-.397-.793-.397-1.963c0-1.838 1.067-3.214 2.394-3.214 1.127 0 1.671.846 1.671 1.858 0 1.133-.721 2.827-1.093 4.401-.312 1.319.661 2.393 1.96 2.393 2.353 0 3.927-3.018 3.927-6.585 0-2.72-1.833-4.754-5.144-4.754-3.748 0-6.09 2.799-6.09 5.937 0 1.082.417 2.245.937 2.875.104.125.119.234.088.36-.096.394-.312 1.25-.355 1.423-.055.222-.18.27-.416.163-1.552-.723-2.52-2.99-2.52-4.813 0-3.92 2.848-7.521 8.217-7.521 4.312 0 7.66 3.073 7.66 7.183 0 4.284-2.7 7.728-6.455 7.728-1.26 0-2.447-.656-2.85-1.435l-.775 2.954c-.28 1.072-1.038 2.41-1.547 3.228A12.004 12.004 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
);

export default function ProductShare({ productUrl, productImageUrl }) {
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    const handleCopy = () => {
        navigator.clipboard.writeText(productUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const options = [
        {
            label: "WhatsApp",
            icon: <MessageCircleMore className="w-4 h-4 mr-2" />,
            link: `https://wa.me/?text=${encodeURIComponent(`${productUrl}`)}`
        },
        {
            label: "Email",
            icon: <Mail className="w-4 h-4 mr-2" />,
            link: `mailto:?subject=Check this product&body=${encodeURIComponent(`${productUrl}\n${productImageUrl}`)}`
        },
        {
            label: "Facebook",
            icon: <Facebook className="w-4 h-4 mr-2" />,
            link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`
        },
        {
            label: "Twitter",
            icon: <Twitter className="w-4 h-4 mr-2" />,
            link: `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(productImageUrl)}`
        },
        {
            label: "Pinterest",
            icon: <PinterestIcon />,
            link: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(productUrl)}&media=${encodeURIComponent(productImageUrl)}`
        }
    ];

    return (
        <div ref={containerRef} className="relative inline-block text-left">
            {/* Main Share Icon */}
            <button
                onClick={() => setOpen(!open)}
                className="p-2 text-muted-foreground hover:text-accent transition-colors"
                aria-label="Share product"
            >
                <Share className="w-5 h-5" />
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 mt-2 w-48 bg-card rounded-none border border-border shadow-lg overflow-hidden z-10">
                    {options.map((opt) => (
                        <a
                            key={opt.label}
                            href={opt.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center px-4 py-2.5 text-sm hover:bg-muted hover:text-accent transition-colors"
                        >
                            {opt.icon}
                            {opt.label}
                        </a>
                    ))}

                    {/* Copy Link Option */}
                    <button
                        onClick={handleCopy}
                        className="flex items-center w-full px-4 py-2.5 text-sm hover:bg-muted hover:text-accent transition-colors"
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4 mr-2 text-green-500" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <LinkIcon className="w-4 h-4 mr-2" />
                                Copy Link
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
