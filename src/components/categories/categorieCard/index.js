import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import React from "react";

const CategoryGrid = ({ title, description, cover }) => {
  return (
    <Card className="overflow-hidden border-none shadow-none">
      {/* Image Wrapper */}
      <div className="image-wrapper">
        {/* Image */}
        <Image width={500} unoptimized height={450} src={cover} alt={title} />
        {/* Overlay */}
        <div className="image-overlay"></div>
      </div>

      <CardContent className="p-2 py-2">
        <h2 className="text-2xl font-medium">{title}</h2>
        <p>{description}</p>
      </CardContent>
    </Card>
  );
};

export default CategoryGrid;
