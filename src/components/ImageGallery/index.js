import React, { useState } from "react";
import Image from "next/image";

const ImageGallery = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    const images = [
        "/images/Chestnut_Carryall_Bag.jpg",
        "/images/Tech_Gear_Pouch.png",
        "/images/Luxury_Evening_Clutch.png",
    ];

    return (
        <div>
            <div className="flex flex-col gap-4 p-4">
                {images.map((src, index) => (
                    <div
                        key={index}
                        className="cursor-pointer"
                        onClick={() => setSelectedImage(src)}
                    >
                        <Image
                            src={src}
                            alt={`Image ${index + 1}`}
                            width={100}
                            height={100}
                            className="rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                ))}
            </div>

            {/* Fullscreen Modal */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
                    {/* Close Button */}
                    <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-red-400"
                    >
                        &times;
                    </button>

                    {/* Image Content */}
                    <div className="relative w-[90vw] h-[90vh]">
                        <Image
                            src={selectedImage}
                            alt="Fullscreen"
                            fill
                            style={{ objectFit: "contain" }}
                            className="rounded-xl"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageGallery;
