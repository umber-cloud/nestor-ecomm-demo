"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

export default function BreadCrumb() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    ...pathSegments.map((segment, index) => ({
      label: decodeURIComponent(segment).charAt(0).toUpperCase() + decodeURIComponent(segment).slice(1),
      href: `/${pathSegments.slice(0, index + 1).join("/")}`,
    })),
  ];

  return (
    <nav className="flex items-center flex-wrap text-xs uppercase tracking-wide text-muted-foreground mb-4">
      {breadcrumbItems.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && <ChevronRight className="h-3 w-3 mx-2" />}
          {index === breadcrumbItems.length - 1 ? (
            <span className="text-foreground">
              {item.label.replace(/-/g, " ")}
            </span>
          ) : (
            <Link href={item.href} className="hover:text-accent transition-colors">
              {item.label.replace(/-/g, " ")}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
