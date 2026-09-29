import React from 'react';
import Image from 'next/image';

function ImageView({ cover }) {
    return (
        <div className="relative w-full aspect-square overflow-hidden rounded-3xl">
            <Image
                src={cover}
                fill
                unoptimized
                priority
                className="object-contain"
                alt="Product image"
            />
        </div>
    )
}
export default ImageView;
