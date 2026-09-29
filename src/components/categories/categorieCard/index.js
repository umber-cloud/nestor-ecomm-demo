import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import React from "react";

const TINTS = {
  Apparel: "from-[#2f4f4a]/70 via-[#2f4f4a]/10 to-transparent",
  Accessories: "from-[#8a4a35]/70 via-[#8a4a35]/10 to-transparent",
};

const CategoryGrid = ({ title, description, cover }) => {
  const tint = TINTS[title] || "from-black/60 via-black/10 to-transparent";

  return (
    <Link
      href={`/categories/${title}`}
      className="group relative block overflow-hidden bg-muted rounded-3xl aspect-[4/3] md:aspect-[16/10]"
    >
      <Image
        fill
        unoptimized
        src={cover}
        alt={title}
        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
      />
      <div className={`absolute inset-0 bg-gradient-to-t ${tint}`} />
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-white">
        <h2 className="text-2xl md:text-3xl font-semibold">{title}</h2>
        <span className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-sm px-4 py-2 text-xs uppercase tracking-[0.1em] group-hover:bg-white/25 transition-colors">
          {description}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
};

export default CategoryGrid;
