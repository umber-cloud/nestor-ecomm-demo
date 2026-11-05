// ============================================================================
// File: src/lib/shopData.js
// Purpose: Storefront Product Data Aggregator & In-Memory Cache
//          Orchestrates calls to Umber Cloud ADN and provides query helpers.
// ============================================================================

import { productMetadata } from './productMetadata.js';
import { fetchAllProducts } from './adnService.js';
import { getCategoryProductBySlug } from '../data/categoryCatalog.js';

// In-memory cache for fetched products to eliminate redundant edge queries
let cachedProducts = null;
let cacheTimestamp = null;
const CACHE_DURATION = 60000; // 60 seconds

/**
 * Retrieves all catalog products hydrated with live Umber ADN media assets
 * @returns {Promise<Array<Object>>} Hydrated product array
 */
export async function getProducts() {
  const now = Date.now();

  // Return cached products if within TTL
  if (cachedProducts && cacheTimestamp && now - cacheTimestamp < CACHE_DURATION) {
    return cachedProducts;
  }

  try {
    const products = await fetchAllProducts(productMetadata);
    cachedProducts = products;
    cacheTimestamp = now;
    return products;
  } catch (error) {
    console.error('[ShopData Error] Failed to fetch products from ADN:', error);
    return cachedProducts || [];
  }
}

/**
 * Resolves a single product by URL slug, collectionId, or title
 * @param {string} slug - Raw or formatted URL slug
 * @returns {Promise<Object|null>} Matching product or null
 */
export async function getProductBySlug(slug) {
  if (!slug) return null;

  const decodedSlug = decodeURIComponent(slug).trim().toLowerCase();
  const normalizedSlug = decodedSlug.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

  const products = await getProducts();

  const found = products.find((p) => {
    if (!p) return false;
    const titleSlug = p.title?.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    const rawTitle = p.title?.toLowerCase().replace(/\s+/g, '-');
    const colId = p.collectionId?.toLowerCase();
    const pId = p.id?.toLowerCase();

    return (
      titleSlug === normalizedSlug ||
      rawTitle === decodedSlug ||
      colId === decodedSlug ||
      colId === normalizedSlug ||
      pId === decodedSlug
    );
  });

  if (found) return found;

  // Fallback to static category catalog specs
  return getCategoryProductBySlug(slug);
}

/**
 * Filters hydrated catalog by category name
 * @param {string} category - Target category (e.g., "Fun", "AI", "Wellness")
 * @returns {Promise<Array<Object>>} Matching product list
 */
export async function getProductsByCategory(category) {
  if (!category || category.toLowerCase() === 'all') {
    return await getProducts();
  }
  const products = await getProducts();
  return products.filter(
    (p) => p.category?.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Returns products flagged for the "Related Gear" suggestion strip
 * @returns {Promise<Array<Object>>} Suggested products
 */
export async function getProductSuggestions() {
  const products = await getProducts();
  const suggestions = products.filter((p) => p.suggestion === true);
  // If fewer than 4 suggestions flagged, backfill with first few products
  if (suggestions.length < 4) {
    return products.slice(0, 4);
  }
  return suggestions;
}

/**
 * Returns the 3 curated Featured Products for the homepage showcase:
 * 1. IRay glasses
 * 2. Soly
 * 3. IClean
 * @returns {Promise<Array<Object>>} The 3 featured products
 */
export async function getFeaturedProducts() {
  const products = await getProducts();
  
  // Specific target order
  const targetKeys = ['ray-bans', 'headphones', 'sc-bottle'];
  const orderedFeatured = [];

  for (const key of targetKeys) {
    const item = products.find(
      (p) =>
        p.collectionId?.toLowerCase() === key ||
        p.id?.toLowerCase() === key ||
        (key === 'ray-bans' && p.title?.toLowerCase().includes('iray')) ||
        (key === 'headphones' && (p.title?.toLowerCase().includes('soly') || p.collectionId === 'headphones' || p.collectionId === 'soly-headphones')) ||
        (key === 'sc-bottle' && p.title?.toLowerCase().includes('iclean'))
    );
    if (item) {
      orderedFeatured.push(item);
    }
  }

  // Fallback to static catalog if any missing
  if (orderedFeatured.length < 3) {
    const fallbackKeys = ['iray-glasses', 'soly', 'iclean'];
    for (const fbKey of fallbackKeys) {
      if (!orderedFeatured.some((p) => p.id === fbKey || p.title?.toLowerCase() === fbKey)) {
        const fbItem = getCategoryProductBySlug(fbKey);
        if (fbItem) orderedFeatured.push(fbItem);
      }
    }
  }

  return orderedFeatured.slice(0, 3);
}
