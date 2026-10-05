import React from 'react';
import Image from 'next/image';
import { ImageOff } from 'lucide-react';

function ImageView({ cover }) {
    if (!cover) {
        return (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <ImageOff className="h-8 w-8" />
                <span className="text-sm">Image coming soon</span>
            </div>
        );
    }

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
