import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { ImageOff } from 'lucide-react';

function ProductSugg({ cover, title, price }) {
    const href = `/products/${title.replace(/\s+/g, '-')}`;
    const rawUrl = typeof cover === 'string' ? cover : cover?.url;
    const mediaUrl = typeof rawUrl === 'string' && rawUrl.trim().length > 0 ? rawUrl : null;

    return (
        <Link href={href} className="group block bg-card rounded-none p-3 transition-shadow hover:shadow-lg">
            <div className="image-wrapper">
                {cover?.type === 'video' && mediaUrl ? (
                    <video
                        src={mediaUrl}
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                ) : mediaUrl ? (
                    <Image
                        src={mediaUrl}
                        width={600}
                        height={600}
                        unoptimized
                        className="w-full h-full object-cover"
                        alt={title}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground bg-muted min-h-[160px]">
                        <ImageOff className="h-6 w-6" />
                        <span className="text-xs">Coming soon</span>
                    </div>
                )}
            </div>
            <div className="px-1.5 pt-3 pb-1">
                <h3 className="text-sm md:text-base font-medium truncate group-hover:text-accent transition-colors">
                    {title}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">{price}</p>
            </div>
        </Link>
    )
}

export default ProductSugg;
