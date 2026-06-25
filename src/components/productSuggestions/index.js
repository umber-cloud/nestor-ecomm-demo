import React from 'react'
import Image from 'next/image';
import { Card, CardFooter } from "@/components/ui/card";
import Link from 'next/link';

function ProductSugg({ cover, title, price }) {
    const href = `/products/${title.replace(/\s+/g, '-')}`;

    return (
        <div className='flex items-center m-2'>
            <Link href={href} className='no-underline block'>
                <Card className="border-none w-50 shadow-md hover:scale-105 transition-transform duration-300 cursor-pointer">
                    {cover?.type === 'video' ? (
                        <video
                            src={cover.url}
                            className="w-full h-auto max-w-[300px] object-cover rounded-lg aspect-square"
                            autoPlay
                            loop
                            muted
                            playsInline
                        />
                    ) : (
                        <Image
                            src={cover?.url || cover}
                            width={300}
                            height={300}
                            className='max-w-100 rounded-lg'
                            unoptimized
                            alt={title}
                        />
                    )}
                    <CardFooter>
                        <div className="flex flex-col p-1 m-1">
                            <h3 className='font-semibold text-lg hover:text-blue-600'>{title}</h3>
                            <p>{price}</p>
                        </div>
                    </CardFooter>
                </Card>
            </Link>
        </div>
    )
}

export default ProductSugg;
