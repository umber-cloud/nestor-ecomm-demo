// ============================================================================
// File: src/data/categoryCatalog.js
// Purpose: Hardware Category Catalog Definitions & Query Helpers
//          Sourced from productMetadata.js.
//          Asset items and media streams are fetched dynamically from Umber ADN
//          via collection APIs without manually passing assetItemIds.
// ============================================================================

import { productMetadata } from "../lib/productMetadata.js";

export const CATEGORY_ITEMS = productMetadata.map((p) => ({
  id: p.collectionId,
  collectionId: p.collectionId,
  title: p.title,
  category: p.category,
  price: p.price,
  description: p.description || "",
  features: p.features || [],
  featured: Boolean(p.featured),
  suggestion: Boolean(p.suggestion),
}));

export function getAllCategoryProducts() {
  return CATEGORY_ITEMS;
}

export function getCategoryProducts(category) {
  if (!category || category.toLowerCase() === "all") {
    return CATEGORY_ITEMS;
  }
  return CATEGORY_ITEMS.filter(
    (item) => item.category?.toLowerCase() === category.toLowerCase()
  );
}

export function getCategoryProductBySlug(slug) {
  if (!slug) return null;
  const decoded = decodeURIComponent(slug).trim().toLowerCase();
  const normalized = decoded.replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");

  return (
    CATEGORY_ITEMS.find((item) => {
      const itemSlug = (item.id || "").toLowerCase();
      const titleSlug = (item.title || "")
        .trim()
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      const colId = (item.collectionId || "").toLowerCase();

      return (
        itemSlug === normalized ||
        itemSlug === decoded ||
        titleSlug === normalized ||
        colId === normalized ||
        colId === decoded
      );
    }) || null
  );
}
