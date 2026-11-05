// ============================================================================
// File: src/lib/adnService.js
// Purpose: Umber Cloud Asset Delivery Network (ADN) Client & Transformer
//          Fetches live edge collection metadata and maps media streams
//          into clean storefront product representations.
// ============================================================================

// Umber Cloud Edge ADN CDN Configuration
export const ADN_CONFIG = {
  domainId: "6ae094fb1701f00439587797",
  host: "https://harbour-wren-3226.umberadn.com",
  apiBase: "https://harbour-wren-3226.umberadn.com/api",
  mediaBase: "https://harbour-wren-3226.umberadn.com/api/vi",
  environment: "DEV",
};

const ADN_API_BASE = ADN_CONFIG.apiBase;
const ADN_MEDIA_BASE = ADN_CONFIG.mediaBase;
const DOMAIN_ID = ADN_CONFIG.domainId;
const ENV_ID = ADN_CONFIG.environment;

/**
 * Fetch asset collection metadata from Umber ADN Edge CDN
 * @param {string} collectionId - The collection identifier (e.g., "steam-deck", "air-purifier")
 * @returns {Promise<Object>} Raw ADN collection payload
 */
export async function fetchCollectionAssets(collectionId) {
  if (!collectionId) {
    throw new Error("fetchCollectionAssets requires a valid collectionId");
  }

  try {
    const endpointUrl = `${ADN_API_BASE}/vc/${DOMAIN_ID}/${collectionId}/${ENV_ID}`;
    const response = await fetch(endpointUrl, {
      next: { revalidate: 60 }, // ISR edge revalidation every 60s
    });

    if (!response.ok) {
      throw new Error(`ADN returned HTTP ${response.status} for collection "${collectionId}"`);
    }

    return await response.json();
  } catch (error) {
    console.warn(`[ADN Warning] Collection "${collectionId}" unavailable: ${error.message}`);
    throw error;
  }
}

/**
 * Constructs an absolute public media stream URL from Umber's download path
 * @param {string} downloadUrl - Relative path (e.g. "/6ae.../item/DEV/generic") or absolute URL
 * @returns {string} Fully qualified CDN media stream URL
 */
export function buildMediaUrl(downloadUrl) {
  if (!downloadUrl) return null;
  if (downloadUrl.startsWith("http://") || downloadUrl.startsWith("https://")) {
    return downloadUrl;
  }
  // Ensure leading slash formatting
  const normalizedPath = downloadUrl.startsWith("/") ? downloadUrl : `/${downloadUrl}`;
  return `${ADN_MEDIA_BASE}${normalizedPath}`;
}

/**
 * Transforms raw Umber ADN collection response into standardized storefront product format
 * @param {Object} adnData - Raw Umber ADN API response
 * @param {Object} metadata - Catalog product business metadata (title, price, category, etc.)
 * @returns {Object} Hydrated product object with live CDN cover & thumbnails
 */
const MODEL_EXTENSIONS = /\.(glb|gltf|usdz)$/i;

// 3D assets may arrive as model/gltf-binary, model/gltf+json, model/vnd.usdz+zip,
// or as application/octet-stream with a .glb/.gltf/.usdz filename — CDNs often
// don't set a precise mimetype for binary 3D formats, so check both.
const isModel = (asset) =>
  Boolean(asset) &&
  (asset.mimetype?.startsWith("model/") ||
    MODEL_EXTENSIONS.test(asset.downloadUrl || "") ||
    MODEL_EXTENSIONS.test(asset.assetItemName || ""));

export function transformADNToProduct(adnData, metadata) {
  const isVisual = (asset) =>
    asset?.mimetype?.startsWith("image/") || asset?.mimetype?.startsWith("video/");

  // Select anchor asset as primary cover; fallback to first visual asset if misconfigured
  const coverAsset = isVisual(adnData?.anchorAsset)
    ? adnData.anchorAsset
    : adnData?.assetItemUrls?.find(isVisual) || null;

  const coverUrl = coverAsset ? buildMediaUrl(coverAsset.downloadUrl) : null;
  const coverType = coverAsset?.mimetype?.startsWith("video/") ? "video" : "image";

  // Build gallery thumbnails from all image, video and 3D model assets
  const rawItems = Array.isArray(adnData?.assetItemUrls) ? adnData.assetItemUrls : [];
  const thumbnails = rawItems
    .filter((asset) => isVisual(asset) || isModel(asset))
    .map((asset) => {
      const type = isModel(asset) ? "model" : asset.mimetype?.startsWith("video/") ? "video" : "image";
      return {
        assetItemId: asset.assetItemId,
        name: asset.assetItemName || "",
        url: buildMediaUrl(asset.downloadUrl),
        type,
        mimetype: asset.mimetype,
      };
    });

  // Extract optional product spec PDF if present
  const pdfAsset = rawItems.find(
    (asset) => asset.mimetype === "application/pdf" || /\.pdf$/i.test(asset.downloadUrl || "")
  );
  const pdfUrl = pdfAsset ? buildMediaUrl(pdfAsset.downloadUrl) : null;

  return {
    id: metadata.collectionId || metadata.id,
    collectionId: metadata.collectionId || metadata.id,
    title: metadata.title,
    price: metadata.price,
    category: metadata.category,
    description: metadata.description || "",
    features: metadata.features || [],
    suggestion: Boolean(metadata.suggestion),
    cover: {
      url: coverUrl,
      type: coverType,
    },
    thumbnails,
    pdfUrl,
  };
}

/**
 * Fetch and hydrate a single product using its metadata definition
 * @param {Object} metadata - Product catalog metadata item
 * @returns {Promise<Object>} Hydrated product object
 */
export async function fetchProduct(metadata) {
  try {
    const adnData = await fetchCollectionAssets(metadata.collectionId);
    return transformADNToProduct(adnData, metadata);
  } catch {
    // Live ADN fetch failed (collection not uploaded yet, etc). Some catalog
    // entries carry their own hardcoded cover/thumbnails as a manual
    // fallback for exactly this case — use them instead of a blank
    // placeholder when present.
    return {
      id: metadata.collectionId || metadata.id,
      collectionId: metadata.collectionId || metadata.id,
      title: metadata.title,
      price: metadata.price,
      category: metadata.category,
      description: metadata.description || "",
      features: metadata.features || [],
      cover: metadata.cover || { url: null, type: "image" },
      thumbnails: metadata.thumbnails || [],
      pdfUrl: metadata.pdfUrl || null,
      error: true,
    };
  }
}

/**
 * Concurrently fetches and hydrates all catalog products
 * @param {Array<Object>} metadataArray - Array of product catalog metadata
 * @returns {Promise<Array<Object>>} Hydrated product array
 */
export async function fetchAllProducts(metadataArray) {
  if (!Array.isArray(metadataArray)) return [];
  const productPromises = metadataArray.map((metadata) => fetchProduct(metadata));
  return await Promise.all(productPromises);
}
