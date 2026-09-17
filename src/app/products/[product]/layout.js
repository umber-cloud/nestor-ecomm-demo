// This file should be named layout.js in your [product] directory
import { getProductBySlug } from "@/lib/shopData";

// Generate metadata for the product page
export async function generateMetadata({ params }) {
  // Get the product ID from the URL
  const { product } = await params;

  // Find the product in your data
  const _product = await getProductBySlug(product);

  // If no product is found, return basic metadata
  if (!_product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Generate the metadata for this product
  return {
    title: _product.title,
    description: `${_product.title} - ${_product.price} - Shop now!`,
    openGraph: {
      title: _product.title,
      description: `${_product.title} - ${_product.price} - Shop now!`,
      images: [
        {
          url: _product.cover.url,
          width: 1200,
          height: 630,
          alt: _product.title,
        },
      ],
      locale: "en_US",
      type: "website",
      url: `${baseUrl}/products/${product}`,
    },
    twitter: {
      card: "summary_large_image",
      title: _product.title,
      description: `${_product.title} - ${_product.price} - Shop now!`,
      images: [_product.cover.url],
    },
  };
}

export default function ProductLayout({ children }) {
  return children;
}

