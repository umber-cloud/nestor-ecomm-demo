/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Play, Box, FileText } from "lucide-react";
import ProductVideo from "./productVideo";
import ProductModel3D from "./productModel3D";
import ProductPdfViewer from "./productPdfViewer";
import ImageView from "../imageView";

/** Large main view area */
const renderMainView = (view) => {
  if (view?.type === "video") {
    return <ProductVideo url={view.url} />;
  }
  if (view?.type === "model") {
    return <ProductModel3D url={view.url} />;
  }
  if (view?.type === "pdf") {
    return <ProductPdfViewer url={view.url} />;
  }
  return <ImageView cover={view?.url} />;
};

/** Small thumbnail — video shows play icon, 3D shows 3D badge, PDF shows red PDF badge */
const ThumbnailItem = ({ image }) => {
  if (image.type === "pdf") {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center gap-1 bg-red-950/20 text-red-500 border border-red-500/30 rounded-xs select-none">
        <FileText className="w-5 h-5 text-red-500" />
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-red-500">
          PDF
        </span>
      </div>
    );
  }
  if (image.type === "model") {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center gap-1 bg-muted text-primary rounded-xs">
        <Box className="w-5 h-5" />
        <span className="font-mono text-[9px] uppercase tracking-widest font-bold">3D</span>
      </div>
    );
  }
  if (image.type === "video") {
    return (
      <div className="relative w-full h-full">
        <video
          src={image.url}
          className="w-full h-full object-cover rounded-xs"
          muted
          preload="metadata"
          onLoadedMetadata={(e) => {
            e.target.currentTime = 0.1;
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xs">
          <Play className="w-4 h-4 text-white fill-white" />
        </div>
      </div>
    );
  }
  return (
    <img
      src={image?.url}
      alt={image?.name || "product"}
      className="w-full h-full object-contain block rounded-xs"
    />
  );
};

export default function ProductSlider({ images, cover, pdfUrl }) {
  const [currentView, setCurrentView] = useState(cover || { type: "image", url: "" });

  // Ensure PDF is included in thumbnails if product has a pdfUrl
  const hasPdf = images?.some((img) => img.type === "pdf");
  const pdfItem = pdfUrl && !hasPdf ? [{ type: "pdf", url: pdfUrl, name: "User Manual (PDF)" }] : [];

  const allThumbnails = [
    ...(images && images.length > 0 ? images : cover?.url ? [cover] : []),
    ...pdfItem,
  ];

  const isCurrentActive = (item) => {
    if (!currentView || !item) return false;
    return currentView.url === item.url && currentView.type === item.type;
  };

  return (
    <div className="flex items-center justify-center flex-col w-full">
      {/* Main viewer */}
      <div className="relative w-full aspect-square overflow-hidden rounded-none bg-card">
        {renderMainView(currentView)}
      </div>

      {/* Small thumbnail strip */}
      {allThumbnails.length > 0 && (
        <div className="flex gap-2 mt-4 w-full px-6">
          <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
            <CarouselContent className="flex items-center -ml-4">
              {allThumbnails.map((image, index) => (
                <CarouselItem key={index} className="pl-4 basis-1/4 md:basis-1/5">
                  <div onClick={() => setCurrentView(image)}>
                    <Card
                      className={`cursor-pointer rounded-none overflow-hidden aspect-square hover:ring-2 hover:ring-primary transition-all ${
                        isCurrentActive(image) ? "ring-2 ring-primary border-primary" : "border-border"
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
