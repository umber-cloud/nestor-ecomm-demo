import React from 'react'
import Image from 'next/image';
import Link from 'next/link';

function ProductSugg({ cover, title, price }) {
    const href = `/products/${title.replace(/\s+/g, '-')}`;

    return (
        <Link href={href} className="group block bg-card rounded-none p-3 transition-shadow hover:shadow-lg">
            <div className="image-wrapper">
                {cover?.type === 'video' ? (
                    <video
                        src={cover.url}
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                ) : (
                    <Image
                        src={cover?.url || cover}
                        width={600}
                        height={600}
                        unoptimized
                        className="w-full h-full object-cover"
                        alt={title}
                    />
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
