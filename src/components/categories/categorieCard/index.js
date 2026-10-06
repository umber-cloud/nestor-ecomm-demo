import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import React from "react";

const CategoryGrid = ({ title, description, cover }) => {
  const tint = "from-background via-background/50 to-transparent";

  return (
    <Link
      href={`/categories/${title}`}
      className="group relative block overflow-hidden border border-border hover:border-primary bg-muted aspect-[4/3] md:aspect-[16/10] transition-colors"
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
        <span className="mt-2 inline-flex w-fit items-center gap-1.5 border border-primary bg-background/70 px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          {description}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
};

export default CategoryGrid;
