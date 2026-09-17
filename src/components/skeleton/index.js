import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start p-4 space-y-4 md:space-y-0 md:space-x-4">
            {/* Image Skeleton */}
            <div className="w-full md:w-[600px] p-1">
                <div className="flex flex-col space-y-3">
                    <Skeleton className="h-[300px] md:h-[600px] w-full rounded-xl" />
                </div>
            </div>
            
            {/* Content Skeleton */}
            <div className="w-full md:w-[550px] p-1">
                <div className="flex flex-col space-y-3">
                    <Skeleton className="p-4 flex flex-col items-start space-y-4 w-full rounded-xl">
                        <div className="w-full">
                            <h1 className="h-12 w-3/4 bg-gray-300 rounded"></h1>
                            <h2 className="h-8 w-1/4 bg-gray-300 rounded mt-2"></h2>
                        </div>
                        <p className="h-32 w-full bg-gray-300 rounded"></p>
                        <button className="h-12 w-full bg-gray-300 rounded-full"></button>
                    </Skeleton>
                </div>
            </div>
        </div>
    );
}