// ============================================================================
// File: src/lib/bannerData.js
// Purpose: Homepage Hero Video Carousel Slides powered dynamically by Umber Cloud ADN
//          Collections: banner-iray, banner-sc-bottle, banner-air-purifier
// ============================================================================

import {
  fetchCollectionAssets,
  getMediaUrlFromDownloadUrl,
} from "./adnService.js";

/**
 * 3 Flagship Hero Video Slides
 * (a) Spectacles: banner-iray
 * (b) UV Self-Cleaning Bottle: banner-sc-bottle
 * (c) Air Purifier: banner-air-purifier
 */
export const BANNER_VIDEO_SLIDES = [
  {
    id: "banner-iray",
    collectionId: "banner-iray",
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
    fallbackVideoUrl:
      "https://harbour-wren-3226.umberadn.com/api/vi/6ae094fb1701f00439587797/banner-iray/21bb3f07de38/DEV/generic",
  },
  {
    id: "banner-sc-bottle",
    collectionId: "banner-sc-bottle",
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
    fallbackVideoUrl:
      "https://harbour-wren-3226.umberadn.com/api/vi/6ae094fb1701f00439587797/banner-sc-bottle/5ce23ab12b1a/DEV/generic",
  },
  {
    id: "banner-air-purifier",
    collectionId: "banner-air-purifier",
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
    fallbackVideoUrl:
      "https://harbour-wren-3226.umberadn.com/api/vi/6ae094fb1701f00439587797/banner-air-purifier/54c55cb255e2/DEV/generic",
  },
];

/**
 * Dynamically resolves live video stream URLs for the 3 hero banner slides
 * from their respective Umber collections (banner-iray, banner-sc-bottle, banner-air-purifier).
 *
 * @returns {Promise<Array<Object>>} Hydrated banner video slides
 */
export async function fetchBannerVideoSlides() {
  try {
    const slides = await Promise.all(
      BANNER_VIDEO_SLIDES.map(async (slide) => {
        try {
          const data = await fetchCollectionAssets(slide.collectionId);

          // Find video asset (either anchorAsset or first video in assetItemUrls)
          const isVideo = (asset) =>
            asset?.mimetype?.startsWith("video/") ||
            asset?.assetType === "0003" ||
            /\.(mp4|webm|mov)$/i.test(asset?.downloadUrl || asset?.assetItemName || "");

          let videoAsset = isVideo(data?.anchorAsset) ? data.anchorAsset : null;

          if (!videoAsset && Array.isArray(data?.assetItemUrls)) {
            videoAsset = data.assetItemUrls.find(isVideo) || data.assetItemUrls[0];
          }

          const videoUrl = videoAsset?.downloadUrl
            ? getMediaUrlFromDownloadUrl(videoAsset.downloadUrl)
            : slide.fallbackVideoUrl;

          return {
            ...slide,
            videoUrl: videoUrl || slide.fallbackVideoUrl,
          };
        } catch (collectionErr) {
          console.warn(
            `[Banner] Failed to fetch live video collection "${slide.collectionId}", using fallback:`,
            collectionErr.message
          );
          return {
            ...slide,
            videoUrl: slide.fallbackVideoUrl,
          };
        }
      })
    );

    return slides;
  } catch (err) {
    console.error("[Banner] Failed to fetch banner video slides from Umber:", err);
    return BANNER_VIDEO_SLIDES;
  }
}

export default BANNER_VIDEO_SLIDES;

/* ============================================================================
 * old hero banner
 * ============================================================================
 *
 * export const BANNER_SLIDES_CONFIG = [
 *   {
 *     id: 1,
 *     collectionId: "ray-bans",
 *     title1: "Multimodal AI",
 *     title2: "IRay Spectacles",
 *     description: "Next-gen smart eyewear combining iconic frames with multimodal AI.",
 *     buttonText: "Shop Spectacles",
 *     href: "/products/IRay-glasses",
 *     imagePreference: "anchor",
 *   },
 *   {
 *     id: 2,
 *     collectionId: "air-purifier",
 *     title1: "Pure Atmosphere",
 *     title2: "HEPA Air Purifier",
 *     description: "Medical-grade True HEPA H13 filtration with real-time laser air diagnostics.",
 *     buttonText: "Shop Air Purifier",
 *     href: "/products/Smart-HEPA-Room-Air-Purifier",
 *     imagePreference: "golden-blue",
 *   },
 *   {
 *     id: 3,
 *     collectionId: "sc-bottle",
 *     title1: "Pure Hydration",
 *     title2: "IClean UV Bottle",
 *     description: "Intelligent double-wall vacuum insulated smart water bottle.",
 *     buttonText: "Shop IClean",
 *     href: "/products/IClean",
 *     imagePreference: "anchor",
 *   },
 * ];
 *
 * export async function fetchBannerSlides() { ... }
 * ============================================================================
 */
