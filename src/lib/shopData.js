// Dynamic product data fetching from ADN (Asset Delivery Network)
// Products are now fetched from the API and cached for performance

import { productMetadata } from './productMetadata';
import { fetchAllProducts } from './adnService';

// Cache for products to avoid repeated API calls
let cachedProducts = null;
let cacheTimestamp = null;
const CACHE_DURATION = 60000; // 60 seconds

/**
 * Get all products (with caching)
 * @returns {Promise<Array>} Array of product objects
 */
export async function getProducts() {
  const now = Date.now();
  
  // Return cached products if still valid
  if (cachedProducts && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedProducts;
  }
  
  // Fetch fresh data
  try {
    const products = await fetchAllProducts(productMetadata);
    cachedProducts = products;
    cacheTimestamp = now;
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return cached data even if expired, or empty array
    return cachedProducts || [];
  }
}

/**
 * Get a single product by title slug
 * @param {string} slug - URL-friendly product title (e.g., "sunbeam-tote-jeff")
 * @returns {Promise<Object|null>} Product object or null
 */
export async function getProductBySlug(slug) {
  const products = await getProducts();
  return products.find(p => 
    p.title.replace(/\s+/g, '-') === slug ||
    p.title.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()
  ) || null;
}

/**
 * Get products by category
 * @param {string} category - Category name
 * @returns {Promise<Array>} Filtered products
 */
export async function getProductsByCategory(category) {
  const products = await getProducts();
  return products.filter(p => p.category === category);
}

/**
 * Get products flagged as suggestions (shown in "You May Also Like")
 * @returns {Promise<Array>} Suggestion products
 */
export async function getProductSuggestions() {
  const products = await getProducts();
  return products.filter(p => p.suggestion === true);
}

