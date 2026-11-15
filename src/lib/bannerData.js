// ============================================================================
// File: src/lib/bannerData.js
// Purpose: Homepage Hero Video Carousel Slides powered dynamically by Umber Cloud ADN
//          Unified Collection: ecom-banner-videos
//          Endpoint: https://{baseUrl}/vc/{domainId}/ecom-banner-videos/{envId}
// ============================================================================

import {
  fetchCollectionAssets,
  getMediaUrlFromDownloadUrl,
  getItemUrl,
} from "./adnService.js";
import { productMetadata } from "./productMetadata.js";

/**
 * Target unified collection ID in Umber Cloud ADN
 */
export const BANNER_COLLECTION_ID = "ecom-banner-videos";

/**
 * Default fallback slides used during SSR and offline network fallback
 */
export const BANNER_VIDEO_SLIDES = [
  {
    id: "banner-iray",
    collectionId: BANNER_COLLECTION_ID,
    tabLabel: "IRay Spectacles",
    tagline: "Multimodal AI Eyewear",
    title1: "Voice & Vision",
    title2: "IRay Spectacles",
    description:
      "Next-gen smart eyewear combining iconic frames with multimodal AI. Stream live POV video, capture 12MP photos, and query surroundings hands-free.",
    primaryBtnText: "Shop Spectacles",
    primaryHref: "/products/IRay-glasses",
    secondaryBtnText: "Learn More",
    secondaryHref: "/products/IRay-glasses",

  },
  {
    id: "banner-sc-bottle",
    collectionId: BANNER_COLLECTION_ID,
    tabLabel: "IClean UV Bottle",
    tagline: "Intelligent UV Hydration",
    title1: "Pure Hydration",
    title2: "IClean UV Bottle",
    description:
      "Intelligent double-wall vacuum insulated smart water bottle. Integrated 280nm UV-C LED in the cap automatically purifies drinking water and eliminates odor every 2 hours.",
    primaryBtnText: "Shop IClean",
    primaryHref: "/products/IClean",
    secondaryBtnText: "Learn More",
    secondaryHref: "/products/IClean",

  },
  {
    id: "banner-air-purifier",
    collectionId: BANNER_COLLECTION_ID,
    tabLabel: "HEPA Air Purifier",
    tagline: "True HEPA H13 Filtration",
    title1: "Pure Atmosphere",
    title2: "HEPA Air Purifier",
    description:
      "Medical-grade True HEPA H13 filtration with real-time laser air diagnostics that cleans up to 500 sq ft in 30 minutes with whisper-quiet 22dB acoustics.",
    primaryBtnText: "Shop Air Purifier",
    primaryHref: "/products/Smart-HEPA-Room-Air-Purifier",
    secondaryBtnText: "View Specs",
    secondaryHref: "/products/Smart-HEPA-Room-Air-Purifier",

  },
];

/**
 * Formats a raw assetItemName into a clean, human-readable display title.
 * Strips file extensions, prefixes, underscores, and preserves standard tech acronyms.
 *
 * Examples:
 * - "smart-drone-pro.mp4" -> "Smart Drone Pro"
 * - "cyber_tactical_hud_v2" -> "Cyber Tactical HUD"
 * - "4k_fpv_action_cam" -> "4K FPV Action Cam"
 *
 * @param {string} rawName - Raw asset name or filename from Umber ADN
 * @returns {string} Properly formatted title
 */
export function formatBannerTitle(rawName) {
  if (!rawName || typeof rawName !== "string") return "Featured Hardware";

  // 1. Remove file extensions (.mp4, .webm, .mov, etc.)
  let clean = rawName.replace(/\.(mp4|webm|mov|mkv|avi|flv|m4v)$/i, "");

  // 2. Remove common internal prefixes/suffixes (e.g., "banner-", "banner_", "video-", "_v1", etc.)
  clean = clean.replace(/^(banner[-_]|video[-_]|hero[-_]|asset[-_])+/i, "");
  clean = clean.replace(/([-_]v\d+|[-_]final|[-_]draft|[-_]preview)+$/i, "");

  // 3. Replace hyphens, underscores, and dots with spaces
  clean = clean.replace(/[-_.]+/g, " ").trim();

  if (!clean) return "Featured Hardware";

  // 4. Known technical acronyms to preserve in full uppercase
  const ACRONYMS = new Set([
    "AI",
    "UV",
    "HEPA",
    "OLED",
    "LED",
    "RGB",
    "HDR",
    "HD",
    "4K",
    "8K",
    "USB",
    "HUD",
    "ANC",
    "VR",
    "AR",
    "POV",
    "GPS",
    "TWS",
    "FPS",
    "FPV",
    "BT",
    "PC",
    "AMD",
    "APU",
    "CPU",
    "GPU",
  ]);

  // 5. Capitalize words properly
  return clean
    .split(/\s+/)
    .map((word) => {
      const upper = word.toUpperCase();
      if (ACRONYMS.has(upper)) return upper;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

/**
 * Maps a single Umber video asset into a full Banner slide schema.
 * Handles known flagship products (IRay, IClean, HEPA Air Purifier) with curated copy,
 * and dynamically formats any newly added video asset automatically.
 *
 * @param {Object} asset - Umber raw asset object from ecom-banner-videos collection
 * @param {number} index - Index of the item in the collection
 * @param {string} collectionId - Target collection ID (ecom-banner-videos)
 * @returns {Object} Complete hero banner slide object
 */
export function mapAssetToBannerSlide(asset, index, collectionId = BANNER_COLLECTION_ID) {
  const rawName = (asset.assetItemName || asset.assetItemId || "").toLowerCase();

  // Resolve direct media stream URL from Umber ADN
  const videoUrl = asset.downloadUrl
    ? getMediaUrlFromDownloadUrl(asset.downloadUrl)
    : getItemUrl(collectionId, asset.assetItemId, asset.targetPlatform || "generic");

  // ========================================================================
  // 1. IRay Spectacles / Glasses (Flagship #1)
  // ========================================================================
  if (
    rawName.includes("iray") ||
    rawName.includes("spectacle") ||
    rawName.includes("glass") ||
    rawName.includes("ray-ban")
  ) {
    return {
      id: asset.assetItemId || "banner-iray",
      collectionId,
      assetItemId: asset.assetItemId,
      tabLabel: "IRay Spectacles",
      tagline: "Multimodal AI Eyewear",
      title1: "Voice & Vision",
      title2: "IRay Spectacles",
      description:
        "Next-gen smart eyewear combining iconic frames with multimodal AI. Stream live POV video, capture 12MP photos, and query surroundings hands-free.",
      primaryBtnText: "Shop Spectacles",
      primaryHref: "/products/IRay-glasses",
      secondaryBtnText: "Learn More",
      secondaryHref: "/products/IRay-glasses",
      videoUrl,
      orderPriority: 1,
    };
  }

  // ========================================================================
  // 2. IClean Self-Cleaning UV Water Bottle (Flagship #2)
  // ========================================================================
  if (
    rawName.includes("self cleaning") ||
    rawName.includes("self-cleaning") ||
    rawName.includes("sc-bottle") ||
    rawName.includes("bottle") ||
    rawName.includes("iclean")
  ) {
    return {
      id: asset.assetItemId || "banner-sc-bottle",
      collectionId,
      assetItemId: asset.assetItemId,
      tabLabel: "IClean UV Bottle",
      tagline: "Intelligent UV Hydration",
      title1: "Pure Hydration",
      title2: "IClean UV Bottle",
      description:
        "Intelligent double-wall vacuum insulated smart water bottle. Integrated 280nm UV-C LED in the cap automatically purifies drinking water and eliminates odor every 2 hours.",
      primaryBtnText: "Shop IClean",
      primaryHref: "/products/IClean",
      secondaryBtnText: "Learn More",
      secondaryHref: "/products/IClean",
      videoUrl,
      orderPriority: 2,
    };
  }

  // ========================================================================
  // 3. HEPA Air Purifier (Flagship #3)
  // ========================================================================
  if (
    rawName.includes("purifier") ||
    rawName.includes("hepa") ||
    (rawName.includes("air") && !rawName.includes("chair"))
  ) {
    return {
      id: asset.assetItemId || "banner-air-purifier",
      collectionId,
      assetItemId: asset.assetItemId,
      tabLabel: "HEPA Air Purifier",
      tagline: "True HEPA H13 Filtration",
      title1: "Pure Atmosphere",
      title2: "HEPA Air Purifier",
      description:
        "Medical-grade True HEPA H13 filtration with real-time laser air diagnostics that cleans up to 500 sq ft in 30 minutes with whisper-quiet 22dB acoustics.",
      primaryBtnText: "Shop Air Purifier",
      primaryHref: "/products/Smart-HEPA-Room-Air-Purifier",
      secondaryBtnText: "View Specs",
      secondaryHref: "/products/Smart-HEPA-Room-Air-Purifier",
      videoUrl,
      orderPriority: 3,
    };
  }

  // ========================================================================
  // 4. Dynamic Auto-Resolution for Any Newly Added Video
  // ========================================================================
  const cleanTitle = formatBannerTitle(
    asset.assetItemName || asset.assetItemId || `Product ${index + 1}`
  );

  // Try matching against product catalog metadata
  const matchedProduct = Array.isArray(productMetadata)
    ? productMetadata.find((p) => {
      const colMatch = p.collectionId && rawName.includes(p.collectionId.toLowerCase());
      const titleMatch =
        p.title && rawName.includes(p.title.toLowerCase().replace(/[^\w\s]/g, ""));
      return colMatch || titleMatch;
    })
    : null;

  const slug = matchedProduct?.title
    ? matchedProduct.title.trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
    : cleanTitle.trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");

  const productUrl = `/products/${slug}`;

  // Smart splitting into title1 and title2 for cinematic 2-line header display
  const words = cleanTitle.split(" ");
  let title1 = "Next-Gen";
  let title2 = cleanTitle;

  if (words.length > 2) {
    title1 = words.slice(0, Math.ceil(words.length / 2)).join(" ");
    title2 = words.slice(Math.ceil(words.length / 2)).join(" ");
  } else if (matchedProduct?.category) {
    title1 = `Smart ${matchedProduct.category}`;
    title2 = cleanTitle;
  }

  return {
    id: asset.assetItemId || `banner-${index + 1}`,
    collectionId,
    assetItemId: asset.assetItemId,
    tabLabel: cleanTitle,
    tagline: matchedProduct?.category
      ? `${matchedProduct.category} Innovation`
      : "Flagship Hardware",
    title1,
    title2,
    description:
      matchedProduct?.description ||
      "Engineered for unmatched performance, seamless connectivity, and everyday luxury.",
    primaryBtnText: `Shop ${words[0] || "Now"}`,
    primaryHref: productUrl,
    secondaryBtnText: "Learn More",
    secondaryHref: productUrl,
    videoUrl,
    orderPriority: 10 + index,
  };
}

/**
 * Dynamically fetches the unified ecom-banner-videos collection from Umber ADN
 * and maps all video items into banner slides. If new videos are added in the collection,
 * they automatically render as new tabs and slides in the carousel.
 *
 * @returns {Promise<Array<Object>>} Hydrated banner video slides
 */
export async function fetchBannerVideoSlides() {
  try {
    const data = await fetchCollectionAssets(BANNER_COLLECTION_ID);

    // Aggregate all potential video assets
    const rawItems = [];
    if (data?.anchorAsset) {
      rawItems.push(data.anchorAsset);
    }
    if (Array.isArray(data?.assetItemUrls)) {
      rawItems.push(...data.assetItemUrls);
    }

    // Deduplicate by assetItemId
    const seen = new Set();
    const uniqueItems = [];
    for (const item of rawItems) {
      const id = item?.assetItemId || item?.downloadUrl;
      if (id && !seen.has(id)) {
        seen.add(id);
        uniqueItems.push(item);
      }
    }

    // Filter to video assets
    const isVideo = (asset) =>
      Boolean(asset) &&
      (asset.mimetype?.startsWith("video/") ||
        asset.assetType === "0003" ||
        /\.(mp4|webm|mov|mkv)$/i.test(
          asset.downloadUrl || asset.assetItemName || ""
        ));

    const videoAssets = uniqueItems.filter(isVideo);
    const finalAssets = videoAssets.length > 0 ? videoAssets : uniqueItems;

    if (finalAssets.length === 0) {
      console.warn(
        `[Banner] No video items found in collection "${BANNER_COLLECTION_ID}", using fallbacks.`
      );
      return BANNER_VIDEO_SLIDES;
    }

    // Map each asset to a slide
    const slides = finalAssets.map((asset, index) =>
      mapAssetToBannerSlide(asset, index, BANNER_COLLECTION_ID)
    );

    // Sort slides so flagships appear first (IRay -> IClean -> Air Purifier -> New Products)
    slides.sort((a, b) => (a.orderPriority || 99) - (b.orderPriority || 99));

    return slides;
  } catch (err) {
    console.warn(
      `[Banner] Failed to fetch live collection "${BANNER_COLLECTION_ID}", using fallbacks:`,
      err.message
    );
    return BANNER_VIDEO_SLIDES;
  }
}

export default BANNER_VIDEO_SLIDES;
