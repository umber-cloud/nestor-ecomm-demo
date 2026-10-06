/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Play } from "lucide-react";
import ProductVideo from "./productVideo";
import ImageView from "../imageView";

/** Large main view area */
const renderMainView = (view) => {
  if (view?.type === "video") {
    return <ProductVideo url={view.url} />;
  }
  return <ImageView cover={view?.url} />;
};

/** Small thumbnail — video shows first frame + play icon overlay */
const ThumbnailItem = ({ image }) => {
  if (image.type === "video") {
    return (
      <div className="relative w-full h-full">
        <video
          src={image.url}
          className="w-full h-full object-cover rounded"
          muted
          preload="metadata"
          onLoadedMetadata={(e) => { e.target.currentTime = 0.1; }}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded">
          <Play className="w-4 h-4 text-white fill-white" />
        </div>
      </div>
    );
  }
  return (
    <img
      src={image?.url}
      alt={image?.name || "product"}
      className="w-full h-full object-contain block rounded"
    />
  );
};

export default function ProductSlider({ images, cover }) {
  const [currentView, setCurrentView] = React.useState(cover || { type: "image", url: "" });

  const allThumbnails =
    images && images.length > 0
      ? images
      : (cover?.url ? [cover] : []);

  return (
    <div className="flex items-center justify-center flex-col w-full">
      {/* Main viewer — fixed aspect-square box so switching between images and
          videos never causes a sudden height jump */}
      <div className="relative w-full aspect-square overflow-hidden rounded-none">
        {renderMainView(currentView)}
      </div>

      {/* Small thumbnail strip */}
      {allThumbnails.length > 0 && (
        <div className="flex gap-2 mt-4 w-full px-6">
          <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
            <CarouselContent className="flex items-center -ml-4">
              {allThumbnails.map((image, index) => (
                <CarouselItem
                  key={index}
                  className="pl-4 basis-1/4 md:basis-1/5"
                >
                  <div onClick={() => setCurrentView(image)}>
                    <Card
                      className={`cursor-pointer rounded-none overflow-hidden aspect-square hover:ring-2 hover:ring-accent transition-all ${
                        currentView.url === image.url ? "ring-2 ring-accent" : ""
                      }`}
                    >
                      <CardContent className="p-1.5 h-full flex items-center justify-center">
                        <ThumbnailItem image={image} />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      )}
    </div>
  );
}
