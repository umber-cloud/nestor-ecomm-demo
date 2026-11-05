// ============================================================================
// File: src/lib/adnService.js
// Purpose: Umber Cloud Asset Delivery Network (ADN) Client & URL Builder
//          Dynamically constructs Virtual Collection (vc) and Virtual Item (vi)
//          URLs from environment variables and transforms edge responses into
//          standardized storefront product representations.
// ============================================================================

/**
 * Retrieves Umber configuration dynamically from environment variables.
 * Ensures no base URLs or domain IDs are exposed or hardcoded in code files.
 * @returns {{ baseUrl: string, domainId: string, envId: string }}
 */
export function getUmberConfig() {
  const rawBaseUrl =
    process.env.NEXT_PUBLIC_UMBER_BASE_URL ||
    process.env.UMBER_BASE_URL ||
    "";
  // Normalize base URL (strip protocol and trailing slashes)
  const baseUrl = rawBaseUrl.replace(/^https?:\/\//i, "").replace(/\/+$/, "");

  const domainId =
    process.env.NEXT_PUBLIC_UMBER_DOMAIN_ID ||
    process.env.UMBER_DOMAIN_ID ||
    "";

  const envId =
    process.env.NEXT_PUBLIC_UMBER_ENV_ID ||
    process.env.UMBER_ENV_ID ||
    "DEV";

  return { baseUrl, domainId, envId };
}

/**
 * Forms the Virtual Collection (vc) metadata API URL.
 * Pattern: https://{baseUrl}/vc/{domainId}/{collectionId}/{envId}
 * Example: https://{baseUrl}/vc/{domainId}/banana-hub-port/DEV
 *
 * @param {string} collectionId - The collection ID passed statically in metadata
 * @returns {string} Fully qualified collection API URL
 */
export function getCollectionUrl(collectionId) {
  if (!collectionId) {
    throw new Error("getCollectionUrl requires a valid collectionId");
  }
  const { baseUrl, domainId, envId } = getUmberConfig();
  return `https://${baseUrl}/vc/${domainId}/${collectionId}/${envId}`;
}

/**
 * Forms the Virtual Item (vi) media stream URL.
 * Pattern: https://{baseUrl}/vi/{domainId}/{collectionId}/{assetItemId}/{envId}/{targetPlatform}
 * Example: https://{baseUrl}/vi/{domainId}/banana-hub-port/78e8926dd0e3/DEV/generic
 *
 * @param {string} collectionId - The collection ID
 * @param {string} assetItemId - The asset item ID received from the collection API
 * @param {string} [targetPlatform='generic'] - Target platform received from the collection API
 * @returns {string|null} Fully qualified media stream URL
 */
export function getItemUrl(collectionId, assetItemId, targetPlatform = "generic") {
  if (!collectionId || !assetItemId) return null;
  const { baseUrl, domainId, envId } = getUmberConfig();
  const platform = targetPlatform || "generic";
  return `https://${baseUrl}/vi/${domainId}/${collectionId}/${assetItemId}/${envId}/${platform}`;
}

/**
 * Backward-compatible helper for resolving media stream URLs.
 * Supports direct asset objects as well as raw download path strings.
 *
 * @param {string|Object} input - Asset object or relative download URL
 * @param {string} [collectionId=null] - Parent collection ID
 * @returns {string|null} Fully qualified CDN media stream URL
 */
export function buildMediaUrl(input, collectionId = null) {
  if (!input) return null;

  if (typeof input === "object" && input.assetItemId && collectionId) {
    return getItemUrl(collectionId, input.assetItemId, input.targetPlatform);
  }

  const raw = typeof input === "string" ? input : input?.downloadUrl;
  if (!raw) return null;

  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw;
  }

  const { baseUrl } = getUmberConfig();
  const normalizedPath = raw.startsWith("/") ? raw : `/${raw}`;
  return `https://${baseUrl}/vi${normalizedPath}`;
}

/**
 * Dynamic configuration object for proxy routes and backward-compatible references.
 */
export const ADN_CONFIG = {
  get domainId() {
    return getUmberConfig().domainId;
  },
  get host() {
    const { baseUrl } = getUmberConfig();
    return `https://${baseUrl.replace(/\/api\/?$/, "")}`;
  },
  get apiBase() {
    const { baseUrl } = getUmberConfig();
    return `https://${baseUrl}`;
  },
  get mediaBase() {
    const { baseUrl } = getUmberConfig();
    return `https://${baseUrl}/vi`;
  },
  get environment() {
    return getUmberConfig().envId;
  },
};

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
    const endpointUrl = getCollectionUrl(collectionId);
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

const MODEL_EXTENSIONS = /\.(glb|gltf|usdz)$/i;

const isModel = (asset) =>
  Boolean(asset) &&
  (asset.mimetype?.startsWith("model/") ||
    MODEL_EXTENSIONS.test(asset.downloadUrl || "") ||
    MODEL_EXTENSIONS.test(asset.assetItemName || ""));

/**
 * Transforms raw Umber ADN collection response into standardized storefront product format
 * dynamically using getItemUrl for all assets.
 *
 * @param {Object} adnData - Raw Umber ADN API response
 * @param {Object} metadata - Catalog product business metadata (title, price, category, etc.)
 * @returns {Object} Hydrated product object with live CDN cover & thumbnails
 */
export function transformADNToProduct(adnData, metadata) {
  const collectionId = metadata.collectionId || adnData?.collectionId;
  const targetPlatform = adnData?.targetPlatform || "generic";

  const isVisual = (asset) =>
    asset?.mimetype?.startsWith("image/") || asset?.mimetype?.startsWith("video/");

  // Select anchor asset as primary cover; fallback to first visual asset if misconfigured
  const coverAsset = isVisual(adnData?.anchorAsset)
    ? adnData.anchorAsset
    : adnData?.assetItemUrls?.find(isVisual) || null;

  const coverUrl = coverAsset
    ? getItemUrl(
        collectionId,
        coverAsset.assetItemId,
        coverAsset.targetPlatform || targetPlatform
      )
    : null;

  const coverType = coverAsset?.mimetype?.startsWith("video/") ? "video" : "image";

  // Build gallery thumbnails dynamically from all image, video and 3D model assets
  const rawItems = Array.isArray(adnData?.assetItemUrls) ? adnData.assetItemUrls : [];
  const thumbnails = rawItems
    .filter((asset) => isVisual(asset) || isModel(asset))
    .map((asset) => {
      const type = isModel(asset)
        ? "model"
        : asset.mimetype?.startsWith("video/")
        ? "video"
        : "image";
      return {
        assetItemId: asset.assetItemId,
        name: asset.assetItemName || "",
        type,
        mimetype: asset.mimetype,
        url: getItemUrl(
          collectionId,
          asset.assetItemId,
          asset.targetPlatform || targetPlatform
        ),
      };
    });

  // Extract optional product spec PDF if present
  const pdfAsset = rawItems.find(
    (asset) =>
      asset.mimetype === "application/pdf" ||
      asset.assetType === "0002" ||
      /\.pdf$/i.test(asset.downloadUrl || asset.assetItemName || "")
  );

  const pdfUrl = pdfAsset
    ? getItemUrl(
        collectionId,
        pdfAsset.assetItemId,
        pdfAsset.targetPlatform || targetPlatform
      )
    : null;

  return {
    id: collectionId || metadata.id,
    collectionId: collectionId || metadata.id,
    title: metadata.title,
    price: metadata.price,
    category: metadata.category,
    description: metadata.description || "",
    features: metadata.features || [],
    suggestion: Boolean(metadata.suggestion),
    featured: Boolean(metadata.featured),
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
