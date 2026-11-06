// ============================================================================
// File: src/lib/bannerData.js
// Purpose: Homepage Hero Carousel Slides powered dynamically by Umber Cloud ADN
//          Fetches anchorAsset.downloadUrl from live collection endpoints
//          and renders virtual item (vi) URLs via getMediaUrlFromDownloadUrl.
// ============================================================================

import {
  fetchCollectionAssets,
  getMediaUrlFromDownloadUrl,
  getItemUrl,
} from "./adnService.js";

/**
 * Hero Banner Slide Configurations (3 curated hero showcases)
 * (a) Spectacles (collectionId: "ray-bans")
 * (b) Air Purifier [golden+blue image] (collectionId: "air-purifier")
 * (c) UV Self-Cleaning Bottle (collectionId: "sc-bottle")
 */
export const BANNER_SLIDES_CONFIG = [
  {
    id: 1,
    collectionId: "ray-bans",
    title1: "Multimodal AI",
    title2: "IRay Spectacles",
    description:
      "Next-gen smart eyewear combining iconic frames with multimodal AI. Stream POV video, capture 12MP photos, and ask questions about your surroundings hands-free.",
    buttonText: "Shop Spectacles",
    href: "/products/IRay-glasses",
    imagePreference: "anchor",
    imageSrc: getItemUrl("ray-bans", "0f30507ad6a0", "generic"),
  },
  {
    id: 2,
    collectionId: "air-purifier",
    title1: "Pure Atmosphere",
    title2: "HEPA Air Purifier",
    description:
      "Medical-grade True HEPA H13 filtration with real-time laser air diagnostics that cleans up to 500 sq ft in 30 minutes with whisper-quiet 22dB acoustics.",
    buttonText: "Shop Air Purifier",
    href: "/products/Smart-HEPA-Room-Air-Purifier",
    imagePreference: "golden-blue",
    imageSrc: getItemUrl("air-purifier", "b96391a96607", "generic"),
  },
  {
    id: 3,
    collectionId: "sc-bottle",
    title1: "Pure Hydration",
    title2: "IClean UV Bottle",
    description:
      "Intelligent double-wall vacuum insulated smart water bottle. Integrated 280nm UV-C LED in the cap automatically purifies drinking water and eliminates odor every 2 hours.",
    buttonText: "Shop IClean",
    href: "/products/IClean",
    imagePreference: "anchor",
    imageSrc: getMediaUrlFromDownloadUrl(
      "/6ae094fb1701f00439587797/sc-bottle/6ebf71a98964/DEV/generic"
    ),
  },
];

/**
 * Dynamically resolves anchor images and specialized assets for the 3 hero banner slides
 * by querying collection endpoints directly and rendering anchorAsset.downloadUrl.
 *
 * Example anchorAsset response:
 * {
 *   "downloadUrl": "/6ae094fb1701f00439587797/sc-bottle/6ebf71a98964/DEV/generic",
 *   "assetItemId": "6ebf71a98964",
 *   "targetPlatform": "generic"
 * }
 *
 * Rendered URL: https://{baseUrl}/vi{downloadUrl}
 *
 * @returns {Promise<Array<Object>>} Hydrated banner slides with live CDN URLs
 */
export async function fetchBannerSlides() {
  try {
    const slides = await Promise.all(
      BANNER_SLIDES_CONFIG.map(async (slide) => {
        try {
          const data = await fetchCollectionAssets(slide.collectionId);

          let targetAsset = data?.anchorAsset || null;

          // Special handling for Air Purifier: find golden+blue image if available
          if (slide.imagePreference === "golden-blue" && Array.isArray(data?.assetItemUrls)) {
            const goldenBlue = data.assetItemUrls.find((item) => {
              const name = (item.assetItemName || "").toLowerCase();
              return (
                name.includes("gold") ||
                name.includes("blue") ||
                name.includes("air-purifier-1") ||
                name === "air-purifier-1.jpg" ||
                item.assetItemId === "b96391a96607"
              );
            });
            if (goldenBlue) {
              targetAsset = goldenBlue;
            }
          }

          // Fallback to first visual asset if anchorAsset is somehow null
          if (!targetAsset && Array.isArray(data?.assetItemUrls) && data.assetItemUrls.length > 0) {
            targetAsset = data.assetItemUrls[0];
          }

          // Render anchorAsset.downloadUrl directly into full vi media stream URL
          let imageSrc = null;
          if (targetAsset?.downloadUrl) {
            imageSrc = getMediaUrlFromDownloadUrl(targetAsset.downloadUrl);
          } else if (targetAsset?.assetItemId) {
            imageSrc = getItemUrl(
              slide.collectionId,
              targetAsset.assetItemId,
              targetAsset.targetPlatform || "generic"
            );
          }

          return {
            ...slide,
            imageSrc: imageSrc || slide.imageSrc,
          };
        } catch (collectionErr) {
          console.warn(
            `[Banner] Live collection fetch failed for "${slide.collectionId}", using fallback:`,
            collectionErr.message
          );
          return slide;
        }
      })
    );

    return slides;
  } catch (error) {
    console.error("[Banner] Failed to fetch banner slides from Umber ADN:", error);
    return BANNER_SLIDES_CONFIG;
  }
}

export default BANNER_SLIDES_CONFIG;
