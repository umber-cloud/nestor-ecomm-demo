// ADN (Asset Delivery Network) Service
// Handles fetching and transforming product assets from Nestor CDN

const ADN_API_BASE = "https://https://adn.umbercloud.io/api";
const ADN_MEDIA_BASE = "https://https://adn.umbercloud.io/api/vi"; // For actual media downloads
const DOMAIN_ID = "67a06a45ea8a39c6628c71c3";

/**
 * Fetch asset collection data from ADN API
 * @param {string} collectionId - The collection identifier (e.g., "SunbeamToteJeff")
 * @returns {Promise<Object>} ADN collection data
 */
export async function fetchCollectionAssets(collectionId) {
  try {
    const response = await fetch(
      `${ADN_API_BASE}/vc/${DOMAIN_ID}/${collectionId}/dev`,
      {
        next: { revalidate: 60 } // Cache for 60 seconds, then revalidate
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch assets for ${collectionId}: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching collection ${collectionId}:`, error);
    throw error;
  }
}

/**
 * Build media URL from download path
 * @param {string} downloadUrl - Relative download URL from API
 * @returns {string} Full media URL
 */
function buildMediaUrl(downloadUrl) {
  // downloadUrl format: /67a06a45ea8a39c6628c71c3/SunbeamToteJeff/39eff1030679/dev/generic
  // Need to convert to: https://https://adn.umbercloud.io/api/vi/67a06a45ea8a39c6628c71c3/SunbeamToteJeff/39eff1030679/dev/generic
  return `${ADN_MEDIA_BASE}${downloadUrl}`;
}

/**
 * Transform ADN asset data to application product format
 * @param {Object} adnData - Raw ADN API response
 * @param {Object} metadata - Product metadata (title, price, category)
 * @returns {Object} Transformed product object
 */
export function transformADNToProduct(adnData, metadata) {
  // Get cover image from anchor asset
  const coverUrl = adnData.anchorAsset
    ? buildMediaUrl(adnData.anchorAsset.downloadUrl)
    : null;
    
  let coverType = 'image';
  if (adnData.anchorAsset && adnData.anchorAsset.mimetype && adnData.anchorAsset.mimetype.startsWith('video/')) {
    coverType = 'video';
  }

  // Build thumbnails from ALL image/video assets (including anchorAsset)
  const thumbnails = adnData.assetItemUrls
    .filter(asset =>
      asset.mimetype &&
      (
        asset.mimetype.startsWith('image/') ||
        asset.mimetype.startsWith('video/')
      )
    )
    .map(asset => {
      const thumbnail = {
        assetItemId: asset.assetItemId,
        name: asset.assetItemName || '',
        url: buildMediaUrl(asset.downloadUrl)
      };

      // Mark videos with type property
      if (asset.mimetype.startsWith('video/')) {
        thumbnail.type = 'video';
      }

      return thumbnail;
    });


  // Find PDF for documentation
  const pdfAsset = adnData.assetItemUrls.find(
    asset => asset.mimetype === 'application/pdf'
  );
  const pdfUrl = pdfAsset ? buildMediaUrl(pdfAsset.downloadUrl) : null;

  return {
    id: metadata.collectionId,
    collectionId: metadata.collectionId,
    title: metadata.title,
    price: metadata.price,
    category: metadata.category,
    suggestion: metadata.suggestion || false,
    cover: {
      url: coverUrl,
      type: coverType
    },
    thumbnails,
    pdfUrl
  };
}

/**
 * Fetch and transform a single product
 * @param {Object} metadata - Product metadata
 * @returns {Promise<Object>} Complete product object
 */
export async function fetchProduct(metadata) {
  try {
    const adnData = await fetchCollectionAssets(metadata.collectionId);
    return transformADNToProduct(adnData, metadata);
  } catch (error) {
    console.error(`Error fetching product ${metadata.title}:`, error);
    // Return product with metadata only (no images) on error
    return {
      id: metadata.collectionId,
      collectionId: metadata.collectionId,
      title: metadata.title,
      price: metadata.price,
      category: metadata.category,
      cover: { url: null },
      thumbnails: [],
      pdfUrl: null,
      error: true
    };
  }
}

/**
 * Fetch all products in parallel
 * @param {Array} metadataArray - Array of product metadata
 * @returns {Promise<Array>} Array of complete product objects
 */
export async function fetchAllProducts(metadataArray) {
  const productPromises = metadataArray.map(metadata => fetchProduct(metadata));
  return await Promise.all(productPromises);
}

/**
 * Fetch a single product by collection ID
 * @param {string} collectionId - The collection identifier
 * @param {Array} metadataArray - Array of all product metadata
 * @returns {Promise<Object|null>} Product object or null if not found
 */
export async function fetchProductByCollectionId(collectionId, metadataArray) {
  const metadata = metadataArray.find(m => m.collectionId === collectionId);
  if (!metadata) {
    return null;
  }
  return await fetchProduct(metadata);
}

/**
 * Fetch a product by title slug (e.g., "sunbeam-tote-jeff")
 * @param {string} titleSlug - URL-friendly product title
 * @param {Array} metadataArray - Array of all product metadata
 * @returns {Promise<Object|null>} Product object or null if not found
 */
export async function fetchProductBySlug(titleSlug, metadataArray) {
  const metadata = metadataArray.find(m => 
    m.title.replace(/\s+/g, '-') === titleSlug ||
    m.title.toLowerCase().replace(/\s+/g, '-') === titleSlug.toLowerCase()
  );
  
  if (!metadata) {
    return null;
  }
  
  return await fetchProduct(metadata);
}
