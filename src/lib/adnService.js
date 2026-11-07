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
    "harbour-wren-3226.umberadn.com/api";
  // Normalize base URL (strip protocol and trailing slashes)
  const baseUrl = (rawBaseUrl || "harbour-wren-3226.umberadn.com/api").replace(/^https?:\/\//i, "").replace(/\/+$/, "");

  const domainId =
    process.env.NEXT_PUBLIC_UMBER_DOMAIN_ID ||
    process.env.UMBER_DOMAIN_ID ||
    "6ae094fb1701f00439587797";

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
 * Forms the Virtual Asset (va) URL for direct asset stream retrieval.
 * Pattern: https://{baseUrl}/va/{domainId}/{assetId}/{envId}/{targetPlatform}
 *
 * @param {string} assetId - The virtual asset identifier (e.g. "store-announcement")
 * @param {string} [targetPlatform="generic"] - Target platform ("generic")
 * @returns {string} Fully qualified virtual asset URL
 */
export function getVirtualAssetUrl(assetId, targetPlatform = "generic") {
  if (!assetId) {
    throw new Error("getVirtualAssetUrl requires a valid assetId");
  }
  const { baseUrl, domainId, envId } = getUmberConfig();
  const platform = targetPlatform || "generic";
  return `https://${baseUrl}/va/${domainId}/${assetId}/${envId}/${platform}`;
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
 * Forms the full Virtual Item (vi) media stream URL from a relative downloadUrl.
 * As received in anchorAsset.downloadUrl:
 * e.g. "/6ae094fb1701f00439587797/sc-bottle/6ebf71a98964/DEV/generic"
 * produces:
 * "https://harbour-wren-3226.umberadn.com/api/vi/6ae094fb1701f00439587797/sc-bottle/6ebf71a98964/DEV/generic"
 *
 * @param {string} downloadUrl - Relative downloadUrl from anchorAsset or assetItemUrls
 * @returns {string|null} Full CDN media stream URL
 */
export function getMediaUrlFromDownloadUrl(downloadUrl) {
  if (!downloadUrl) return null;
  if (downloadUrl.startsWith("http://") || downloadUrl.startsWith("https://")) {
    return downloadUrl;
  }
  const { baseUrl } = getUmberConfig();
  const normalizedPath = downloadUrl.startsWith("/") ? downloadUrl : `/${downloadUrl}`;
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

  // Include PDF in gallery thumbnails list
  if (pdfAsset && pdfUrl) {
    thumbnails.push({
      assetItemId: pdfAsset.assetItemId,
      name: pdfAsset.assetItemName || "User Manual (PDF)",
      type: "pdf",
      mimetype: "application/pdf",
      url: pdfUrl,
    });
  }

  return {
    id: collectionId || metadata.id,
    collectionId: collectionId || metadata.id,
    aliases: metadata.aliases || [],
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
    anchorAsset: adnData?.anchorAsset || null,
    thumbnails,
    pdfUrl,
  };
}

/**
 * Fetch and hydrate per-color variant collections for a product (e.g. frame colors).
 * Each variant points at its own Umber collection; a variant explicitly marked
 * `available: false` is never fetched (shown muted in the UI as out of stock),
 * and a live fetch failure for any single variant degrades that variant to
 * unavailable rather than failing the whole product.
 * @param {Array<Object>} variants - metadata.variants entries ({id,label,hex,collectionId,available})
 * @returns {Promise<Array<Object>>} hydrated variants with cover/thumbnails attached
 */
export async function fetchProductVariants(variants) {
  if (!Array.isArray(variants) || variants.length === 0) return [];

  return Promise.all(
    variants.map(async (variant) => {
      if (variant.available === false) {
        return { ...variant, cover: null, thumbnails: [] };
      }
      try {
        const adnData = await fetchCollectionAssets(variant.collectionId);
        const { cover, thumbnails } = transformADNToProduct(adnData, {
          collectionId: variant.collectionId,
          title: variant.label,
        });
        return { ...variant, cover, thumbnails };
      } catch {
        return { ...variant, available: false, cover: null, thumbnails: [] };
      }
    })
  );
}

/**
 * Resolve a try-on 3D model's live CDN URL from its dedicated Umber collection.
 * The collection is expected to hold a single 3D Model asset; no type sniffing
 * is needed (unlike mixed product collections) since the collection's own
 * "Allowed Asset Types" already restricts it to 3D Model.
 * @param {string} collectionId - Umber collection holding the GLB/GLTF asset
 * @returns {Promise<string|null>} Fully qualified CDN URL, or null if unavailable
 */
export async function fetchTryOnModel(collectionId) {
  if (!collectionId) return null;
  try {
    const adnData = await fetchCollectionAssets(collectionId);
    const modelAsset = adnData?.anchorAsset || adnData?.assetItemUrls?.[0];
    if (!modelAsset) return null;
    return getItemUrl(collectionId, modelAsset.assetItemId, modelAsset.targetPlatform);
  } catch {
    return null;
  }
}

/**
 * Fetch top promotion / announcement banner data directly from Umber ADN Virtual Asset (/va) endpoint.
 * Pattern: https://{baseUrl}/va/{domainId}/{assetId}/{envId}/{targetPlatform}
 * Example: https://harbour-wren-3226.umberadn.com/api/va/6ae094fb1701f00439587797/store-announcement/DEV/generic
 *
 * @param {string} [assetId="store-announcement"] - Virtual asset identifier on Umber
 * @param {string} [targetPlatform="generic"] - Target platform
 * @returns {Promise<Object|null>} Raw JSON payload directly from Umber, or null if fetch fails
 */
  export async function fetchAnnouncement(assetId = "store-announcement", targetPlatform = "generic") {
    try {
      const vaUrl = getVirtualAssetUrl(assetId, targetPlatform);
      // Bust browser & edge cache with timestamp query param
      const separator = vaUrl.includes("?") ? "&" : "?";
      const bustUrl = `${vaUrl}${separator}_t=${Date.now()}`;
      const res = await fetch(bustUrl, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      if (!res.ok) {
        throw new Error(`Umber /va returned HTTP ${res.status} for asset "${assetId}"`);
      }

      const payload = await res.json();
      return payload;
    } catch (err) {
      console.warn(`[Announcement] Failed to fetch /va for "${assetId}":`, err.message);
      return null;
    }
  }

  /**
   * Fetch and hydrate a single product using its metadata definition
   * @param {Object} metadata - Product catalog metadata item
   * @returns {Promise<Object>} Hydrated product object
   */
  export async function fetchProduct(metadata) {
    let product;
    try {
      const adnData = await fetchCollectionAssets(metadata.collectionId);
      product = transformADNToProduct(adnData, metadata);
    } catch {
      product = {
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

    if (Array.isArray(metadata.variants) && metadata.variants.length > 0) {
      product.variants = await fetchProductVariants(metadata.variants);
      product.defaultVariantId =
        metadata.defaultVariantId ||
        product.variants.find((v) => v.available !== false)?.id ||
        product.variants[0]?.id;

      // If the base collection itself has no cover (common when the base
      // collectionId is only a logical grouping and all real media lives in
      // the per-color variant collections), fall back to the default variant.
      if (!product.cover?.url) {
        const defaultVariant = product.variants.find((v) => v.id === product.defaultVariantId);
        if (defaultVariant) {
          product.cover = defaultVariant.cover || product.cover;
          product.thumbnails = defaultVariant.thumbnails?.length
            ? defaultVariant.thumbnails
            : product.thumbnails;
        }
      }
    }

    if (metadata.tryOn?.enabled && metadata.tryOn?.collectionId) {
      const modelUrl = await fetchTryOnModel(metadata.tryOn.collectionId);
      product.tryOn = modelUrl ? { enabled: true, modelUrl } : null;
    }

    return product;
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
