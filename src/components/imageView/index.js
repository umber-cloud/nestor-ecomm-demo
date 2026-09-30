import React from 'react';
import Image from 'next/image';

function ImageView({ cover }) {
    return (
        <Image
            src={cover}
            fill
            unoptimized
            priority
            className="object-contain"
            alt="Product image"
        />
    )
}
export default ImageView;
