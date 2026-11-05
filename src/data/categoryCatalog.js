// ============================================================================
// File: src/data/categoryCatalog.js
// Purpose: Curated Hardware Category Catalog for Nestor E-Commerce Demo
//          Contains full specifications and live Umber ADN cover & gallery URLs.
//          Domain: 6ae094fb1701f00439587797 | Host: harbour-wren-3226.umberadn.com
// ============================================================================

const CDN_BASE = "https://harbour-wren-3226.umberadn.com/api/vi/6ae094fb1701f00439587797";

export const CATEGORY_ITEMS = [
  // ==========================================
  // 1. FUN
  // ==========================================
  {
    id: "steam-deck",
    collectionId: "steam-deck",
    title: "Steam Deck OLED",
    category: "Fun",
    price: "$649.00",
    description: "Handheld gaming powerhouse featuring a custom AMD APU, 7.4-inch 90Hz HDR OLED display, premium haptics, and full PC gaming library compatibility on the go.",
    cover: {
      url: `${CDN_BASE}/steam-deck/9d9efd2d0b90/DEV/generic`,
      type: "image",
    },
    thumbnails: [
      { url: `${CDN_BASE}/steam-deck/9d9efd2d0b90/DEV/generic`, name: "steam-1.jpg", type: "image" },
      { url: `${CDN_BASE}/steam-deck/f6f7d0d61489/DEV/generic`, name: "steam-2.jpg", type: "image" },
      { url: `${CDN_BASE}/steam-deck/f12414dd7794/DEV/generic`, name: "steam-3.jpg", type: "image" },
      { url: `${CDN_BASE}/steam-deck/231ed0880e4e/DEV/generic`, name: "steam-4.jpg", type: "image" },
    ],
    features: [
      "7.4-inch 90Hz HDR OLED display (1000 nits peak)",
      "Custom 6nm AMD APU (Zen 2 + RDNA 2)",
      "50Wh battery with 3-12 hours of gameplay",
      "Full SteamOS with desktop Linux environment",
    ],
    pdfUrl: null,
  },
  {
    id: "modular-gaming-console",
    collectionId: "gaming-consoles",
    title: "Modular Gaming Console",
    category: "Fun",
    price: "$499.00",
    description: "Dual-architecture hybrid entertainment system with high-refresh graphics, low-latency wireless controllers, and multi-platform cloud syncing.",
    cover: {
      url: `${CDN_BASE}/gaming-consoles/48ecb825ca4e/DEV/generic`,
      type: "image",
    },
    thumbnails: [
      { url: `${CDN_BASE}/gaming-consoles/48ecb825ca4e/DEV/generic`, name: "console-1", type: "image" },
      { url: `${CDN_BASE}/gaming-consoles/01e65cd4456e/DEV/generic`, name: "console-2", type: "image" },
      { url: `${CDN_BASE}/gaming-consoles/83627cb041bd/DEV/generic`, name: "console-3", type: "image" },
      { url: `${CDN_BASE}/gaming-consoles/21b42373a13c/DEV/generic`, name: "console-4", type: "image" },
      { url: `${CDN_BASE}/gaming-consoles/40e57e94e0a2/DEV/generic`, name: "console-5", type: "image" },
    ],
    features: [
      "4K 120Hz HDMI 2.1 video output with HDR support",
      "Custom ultra-fast NVMe storage expansion",
      "Tactile haptic feedback controllers included",
      "Whisper-quiet liquid cooling chamber",
    ],
    pdfUrl: null,
  },

  // ==========================================
  // 2. AI
  // ==========================================
  {
    id: "spherical-magnetic-fluid-audio-speaker",
    collectionId: "sp-speaker",
    title: "Spherical Magnetic Fluid Audio Speaker",
    category: "AI",
    price: "$380.00",
    description: "Futuristic visual acoustic speaker featuring responsive ferrofluid suspended inside a transparent sphere that dances to music frequencies with AI-tuned room acoustics.",
    cover: {
      url: `${CDN_BASE}/sp-speaker/4d58a2f43ba2/DEV/generic`,
      type: "image",
    },
    thumbnails: [
      { url: `${CDN_BASE}/sp-speaker/4d58a2f43ba2/DEV/generic`, name: "speaker-1", type: "image" },
      { url: `${CDN_BASE}/sp-speaker/2cc8b86041a0/DEV/generic`, name: "speaker-2", type: "image" },
      { url: `${CDN_BASE}/sp-speaker/ac80c9b45d1f/DEV/generic`, name: "speaker-3", type: "image" },
      { url: `${CDN_BASE}/sp-speaker/bde26301957a/DEV/generic`, name: "speaker-4", type: "image" },
    ],
    features: [
      "Pure NASA-grade black magnetic ferrofluid visualization",
      "AI audio frequency separation & responsive electromagnet control",
      "360-degree high-fidelity neodymium audio drivers",
      "Bluetooth 5.3 + lossless wireless streaming",
    ],
    pdfUrl: null,
  },
  {
    id: "iray-glasses",
    collectionId: "ray-bans",
    title: "IRay glasses",
    category: "AI",
    price: "$299.00",
    featured: true,
    aliases: ["meta-ray-bans", "ray-bans", "meta-ray-ban"],
    description: "Next-gen smart eyewear combining iconic frames with multimodal AI. Stream POV video, capture 12MP photos, and ask questions about your surroundings hands-free.",
    cover: {
      url: `${CDN_BASE}/ray-bans/b23cdee905e6/DEV/generic`,
      type: "image",
    },
    thumbnails: [
      { url: `${CDN_BASE}/ray-bans/b23cdee905e6/DEV/generic`, name: "ray-bans-1", type: "image" },
      { url: `${CDN_BASE}/ray-bans/26a3f506160b/DEV/generic`, name: "ray-bans-2", type: "image" },
      { url: `${CDN_BASE}/ray-bans/90de79806778/DEV/generic`, name: "ray-bans-3", type: "image" },
    ],
    features: [
      "Ultra-wide 12MP camera for hands-free 1080p video recording",
      "Open-ear custom directional speakers with 5-mic array",
      "Multimodal AI assistant for visual and voice inquiries",
      "Charging case providing up to 36 hours of battery life",
    ],
    pdfUrl: null,
  },
  {
    id: "soly",
    collectionId: "soly-headphones",
    title: "Soly",
    category: "AI",
    price: "$399.00",
    featured: true,
    aliases: ["sony-headphones", "sony-xm6-headphone", "echobassheadphones", "soly-headphones"],
    description: "Next-generation industry-benchmark wireless noise-canceling headphones. Equipped with custom carbon fiber composite acoustic drivers, dual noise-canceling processors, and AI spatial audio.",
    cover: {
      url: "https://adn.umbercloud.io/api/vi/67a06a45ea8a39c6628c71c3/EchoBassHeadphones/7226f7b4e309/dev/generic",
      type: "image",
    },
    thumbnails: [
      {
        url: "https://adn.umbercloud.io/api/vi/67a06a45ea8a39c6628c71c3/EchoBassHeadphones/7226f7b4e309/dev/generic",
        name: "soly-1.jpg",
        type: "image",
      },
    ],
    features: [
      "Dual HD Noise Canceling Processor with 8 precision microphones",
      "Specially developed 30mm carbon composite precision sound unit",
      "Hi-Res Audio Wireless with LDAC and AI acoustic upscaling",
      "Up to 40 hours battery life with 3-minute quick charge for 3 hours",
    ],
    pdfUrl: null,
  },
  {
    id: "xreal-one-pro-ar-glasses",
    collectionId: "x-real-ar-glasses",
    title: "XREAL One Pro AR Glasses",
    category: "AI",
    price: "$499.00",
    description: "Spatial computing glasses projecting a massive 120Hz virtual display right before your eyes. Powered by dual Sony Micro-OLED panels with 52-degree field of view.",
    cover: {
      url: `${CDN_BASE}/x-real-ar-glasses/3a4ac18317bc/DEV/generic`,
      type: "image",
    },
    thumbnails: [
      { url: `${CDN_BASE}/x-real-ar-glasses/3a4ac18317bc/DEV/generic`, name: "ar-2", type: "image" },
      { url: `${CDN_BASE}/x-real-ar-glasses/2011abc77b9f/DEV/generic`, name: "ar-3", type: "image" },
      { url: `${CDN_BASE}/x-real-ar-glasses/f5fc8fb63566/DEV/generic`, name: "ar-1", type: "image" },
    ],
    features: [
      "Dual Sony 0.68-inch Micro-OLED displays with 1080p per eye",
      "120Hz refresh rate with 500 nits perceived brightness",
      "Electrochromic dimming lenses for outdoor/indoor adaptability",
      "Direct USB-C DisplayPort support for PC, Mac, consoles and iPhone",
    ],
    pdfUrl: null,
  },
  {
    id: "echobass-studio-headphones",
    collectionId: "headphones",
    title: "EchoBass Studio Headphones",
    category: "AI",
    price: "$349.00",
    description: "Reference-grade over-ear headphones with adaptive AI noise cancellation, tuned for studio-accurate sound whether you're mixing tracks or tuning out the world.",
    cover: {
      url: `${CDN_BASE}/headphones/6aaf980d4fdd/DEV/generic`,
      type: "image",
    },
    thumbnails: [
      { url: `${CDN_BASE}/headphones/6aaf980d4fdd/DEV/generic`, name: "headphone image 1", type: "image" },
      { url: `${CDN_BASE}/headphones/77c9ad78549e/DEV/generic`, name: "headphone image 2", type: "image" },
      { url: `${CDN_BASE}/headphones/cb8e00386d2b/DEV/generic`, name: "headphone image 3", type: "image" },
      { url: `${CDN_BASE}/headphones/1595c5e4428e/DEV/generic`, name: "headphone video", type: "video" },
    ],
    features: [
      "Adaptive AI noise cancellation with transparency mode",
      "40mm bio-cellulose drivers for studio-accurate response",
      "Bluetooth 5.3 multipoint with lossless wired fallback",
      "38-hour battery life with 5-minute quick-charge boost",
    ],
    pdfUrl: null,
  },

  // ==========================================
  // 3. PRODUCTIVITY
  // ==========================================
  {
    id: "ai-voice-recorder",
    collectionId: "ai-voice-recorder",
    title: "AI Voice Recorder & Transcriber",
    category: "Productivity",
    price: "$159.00",
    description: "Compact titanium smart voice recorder with dual Knowles microphones and onboard LLM acceleration. Transcribes conversations in real time, distinguishes speakers, and exports instant summaries.",
    cover: {
      url: `${CDN_BASE}/ai-voice-recorder/8acb69768b99/DEV/generic`,
      type: "image",
    },
    thumbnails: [
      { url: `${CDN_BASE}/ai-voice-recorder/8acb69768b99/DEV/generic`, name: "ai-1", type: "image" },
      { url: `${CDN_BASE}/ai-voice-recorder/01260a51dca4/DEV/generic`, name: "ai-2", type: "image" },
    ],
    features: [
      "Dual Knowles beamforming microphones with AGC (Auto Gain Control)",
      "GPT-4o powered automated meeting minutes & action item extraction",
      "64GB onboard encrypted eMMC flash storage (approx 480 hrs audio)",
      "Magnetic clip mounting & continuous 30-hour record battery",
    ],
    pdfUrl: null,
  },
  {
    id: "lenovo-thinkbook-plus-gen-6-rollable-laptop",
    collectionId: "rollable-laptop",
    title: "Lenovo ThinkBook Rollable Laptop",
    category: "Productivity",
    price: "$2,899.00",
    description: "Breakthrough concept laptop with an internal motorized rollable OLED screen that expands vertically from 12.7 inches to an expansive 15.3 inches at the tap of a button.",
    cover: {
      url: `${CDN_BASE}/rollable-laptop/10bcbd38708f/DEV/generic`,
      type: "image",
    },
    thumbnails: [
      { url: `${CDN_BASE}/rollable-laptop/10bcbd38708f/DEV/generic`, name: "rollable-1", type: "image" },
      { url: `${CDN_BASE}/rollable-laptop/5c8d2b596b32/DEV/generic`, name: "rollable-2", type: "image" },
    ],
    features: [
      "Motorized rollable OLED screen extending from 12.7\" (4:3) to 15.3\" (8:9)",
      "Intel Core Ultra 7 processor with dedicated NPU for local AI workloads",
      "Dual-channel LPDDR5X RAM and 1TB PCIe Gen 4 SSD",
      "Dual-pivot chassis with reinforced carbon fiber frame",
    ],
    pdfUrl: null,
  },
  {
    id: "mx-master-3s",
    collectionId: "mx-master-3s",
    title: "MX Master 3S Wireless Mouse",
    category: "Productivity",
    price: "$99.00",
    aliases: ["mx-master-3s", "logitech-mx-creative-console", "mx-master", "mx-master-3s-wireless-mouse"],
    description: "Industry-standard performance wireless productivity mouse engineered for coders, designers, and power users. Features 8,000 DPI Darkfield sensor tracking on glass, ultra-quiet mechanical clicks, and MagSpeed electromagnetic scrolling.",
    cover: {
      url: "https://adn.umbercloud.io/api/vi/67a06a45ea8a39c6628c71c3/WorkspaceCraftPro/0adcc9141b11/dev/generic",
      type: "image",
    },
    thumbnails: [
      {
        url: "https://adn.umbercloud.io/api/vi/67a06a45ea8a39c6628c71c3/WorkspaceCraftPro/0adcc9141b11/dev/generic",
        name: "mx-master-1.jpg",
        type: "image",
      },
    ],
    features: [
      "8,000 DPI Darkfield optical sensor that tracks accurately on any surface including glass",
      "MagSpeed electromagnetic scroll wheel shifting from ratchet to hyper-fast 1,000 lines/sec",
      "Quiet Click switches reducing click acoustic noise by 90%",
      "USB-C rechargeable battery lasting up to 70 days per full charge",
    ],
    pdfUrl: null,
  },

  // ==========================================
  // 4. WELLNESS
  // ==========================================
  {
    id: "iclean",
    collectionId: "sc-bottle",
    title: "IClean",
    category: "Wellness",
    price: "$95.00",
    featured: true,
    aliases: ["self-cleaning-bottle", "sc-bottle", "self-cleaning-uv-c-smart-water-bottle"],
    description: "IClean intelligent double-wall vacuum insulated stainless steel water bottle. An integrated 280nm UV-C LED in the cap automatically purifies drinking water and eliminates odor every 2 hours.",
    cover: {
      url: `${CDN_BASE}/sc-bottle/6ebf71a98964/DEV/generic`,
      type: "image",
    },
    thumbnails: [
      { url: `${CDN_BASE}/sc-bottle/6ebf71a98964/DEV/generic`, name: "bottle-1", type: "image" },
      { url: `${CDN_BASE}/sc-bottle/05c23a316d4c/DEV/generic`, name: "bottle-2", type: "image" },
      { url: `${CDN_BASE}/sc-bottle/eec5876aea03/DEV/generic`, name: "bottle-3", type: "image" },
    ],
    features: [
      "Eradicates up to 99.99% of bio-contaminants with 280nm UV-C LED",
      "Keeps liquids cold for 24 hours or hot for 12 hours",
      "Magnetic USB waterproof charging port with 1-month battery per charge",
      "BPA-free electropolished 18/8 food-grade stainless steel",
    ],
    pdfUrl: null,
  },
  {
    id: "air-purifier",
    collectionId: "air-purifier",
    title: "Smart HEPA Room Air Purifier",
    category: "Wellness",
    price: "$249.00",
    description: "Compact smart room air purifier equipped with laser air-quality diagnostics and a 3-layer medical-grade True HEPA H13 filtration core that cleans up to 500 sq ft in 30 minutes.",
    cover: {
      url: `${CDN_BASE}/air-purifier/e0acf7014109/DEV/generic`,
      type: "image",
    },
    thumbnails: [
      { url: `${CDN_BASE}/air-purifier/e0acf7014109/DEV/generic`, name: "air-purifier-2", type: "image" },
      { url: `${CDN_BASE}/air-purifier/3a12bf5a4f5b/DEV/generic`, name: "air-purifier-3", type: "image" },
      { url: `${CDN_BASE}/air-purifier/9d5b4bd26a68/DEV/generic`, name: "air-purifier-4", type: "image" },
      { url: `${CDN_BASE}/air-purifier/b96391a96607/DEV/generic`, name: "air-purifier-1", type: "image" },
    ],
    features: [
      "Medical-grade True HEPA H13 filter capturing 99.97% of PM2.5 particulates",
      "Dual laser particulate sensor reporting real-time AQI metrics",
      "Whisper-quiet sleep cycle at 22dB sound level",
      "App-connected scheduling and automated fan velocity adjustment",
    ],
    pdfUrl: null,
  },
  {
    id: "samsung-galaxy-ring",
    collectionId: "smart-ring",
    title: "Smart Health & Fitness Ring",
    category: "Wellness",
    price: "$399.00",
    description: "Featherlight titanium smart ring engineered for 24/7 biometric awareness. Monitors sleep debt, resting heart rate, skin temperature, and daily Energy Scores inside an ultra-comfortable ring form factor.",
    cover: {
      url: `${CDN_BASE}/smart-ring/7f6c99698c08/DEV/generic`,
      type: "image",
    },
    thumbnails: [
      { url: `${CDN_BASE}/smart-ring/7f6c99698c08/DEV/generic`, name: "ring-1", type: "image" },
      { url: `${CDN_BASE}/smart-ring/d8a21fc13bc8/DEV/generic`, name: "ring-2", type: "image" },
      { url: `${CDN_BASE}/smart-ring/2bc470ec9d86/DEV/generic`, name: "ring-3", type: "image" },
    ],
    features: [
      "Grade 5 concave titanium chassis weighing less than 3 grams",
      "10ATM water resistance and IP68 dust-proof rating",
      "Up to 7 days continuous tracking on a single charge",
      "AI-driven Galaxy AI Energy Score and Sleep Apnea detection",
    ],
    pdfUrl: null,
  },
  {
    id: "muse-s-headband",
    collectionId: "muse-headband",
    title: "Muse S Meditation & Sleep Headband",
    category: "Wellness",
    price: "$399.00",
    description: "Multi-sensor EEG meditation and sleep tracker woven into a soft, flexible fabric headband. Offers real-time audio biofeedback on brainwave activity, heart rate, and movement to cultivate deep restorative sleep.",
    cover: {
      url: `${CDN_BASE}/muse-headband/bdc24548e18c/DEV/generic`,
      type: "image",
    },
    thumbnails: [
      { url: `${CDN_BASE}/muse-headband/bdc24548e18c/DEV/generic`, name: "headband-1", type: "image" },
      { url: `${CDN_BASE}/muse-headband/45bdee2bc958/DEV/generic`, name: "headband-2", type: "image" },
    ],
    features: [
      "4 electroencephalography (EEG) channels for active brainwave measurement",
      "PPG optical sensor for heart rate and breathing rhythms",
      "Go-to-Sleep responsive sound journeys that quiet mental chatter",
      "10-hour rechargeable battery designed for all-night comfort",
    ],
    pdfUrl: null,
  },

  // ==========================================
  // 5. TRAVEL
  // ==========================================
  {
    id: "gan-multi-port-charger",
    collectionId: "multiport-charger",
    title: "GaN III 140W Multi-Port Travel Charger",
    category: "Travel",
    price: "$79.00",
    description: "One small brick charges a laptop, phone and tablet simultaneously. Powered by cutting-edge Gallium Nitride (GaN III) semiconductor technology for high-efficiency travel power.",
    cover: {
      url: `${CDN_BASE}/multiport-charger/c663aa30dd57/DEV/generic`,
      type: "image",
    },
    thumbnails: [
      { url: `${CDN_BASE}/multiport-charger/c663aa30dd57/DEV/generic`, name: "charger-1", type: "image" },
      { url: `${CDN_BASE}/multiport-charger/f6d7322af643/DEV/generic`, name: "charger-2", type: "image" },
      { url: `${CDN_BASE}/multiport-charger/a98a368b25e8/DEV/generic`, name: "charger-3", type: "image" },
    ],
    features: [
      "One small brick charges a laptop, phone and tablet simultaneously",
      "140W total output delivering full-speed fast charging to laptop and gear",
      "Foldable wall prongs with universal 100V-240V international travel voltage",
      "ActiveShield 2.0 temperature sensor checking heat over 3 million times daily",
    ],
    pdfUrl: null,
  },
  {
    id: "high-capacity-power-bank",
    collectionId: "high-capacity-pb",
    title: "High-Capacity 250W USB-C PD Power Bank",
    category: "Travel",
    price: "$139.00",
    description: "High-capacity power bank keeping laptops going through long days. Features 27,650mAh capacity, 250W multi-device output, and an intelligent digital smart screen.",
    cover: {
      url: `${CDN_BASE}/high-capacity-pb/988a7dfc7081/DEV/generic`,
      type: "image",
    },
    thumbnails: [
      { url: `${CDN_BASE}/high-capacity-pb/988a7dfc7081/DEV/generic`, name: "powerbank-1", type: "image" },
      { url: `${CDN_BASE}/high-capacity-pb/d02870e38284/DEV/generic`, name: "powerbank-2", type: "image" },
      { url: `${CDN_BASE}/high-capacity-pb/c9b92d068be2/DEV/generic`, name: "powerbank-3", type: "image" },
    ],
    features: [
      "Keeps laptops going through long days with 27,650mAh capacity",
      "250W maximum multi-device output with 140W single-port USB-C PD 3.1",
      "Real-time TFT smart screen reporting battery health, wattage, and recharge time",
      "Airline-approved TSA carry-on battery capacity (99.54Wh)",
    ],
    pdfUrl: null,
  },
  {
    id: "item-trackers",
    collectionId: "item-trackers",
    title: "Precision Smart Item Trackers",
    category: "Travel",
    price: "$29.00",
    description: "Precision finding beacons that utilize ultra-wideband radio and global crowd networks to safeguard travel luggage, backpacks, and key gear.",
    cover: {
      url: `${CDN_BASE}/item-trackers/e0bd2125f439/DEV/generic`,
      type: "image",
    },
    thumbnails: [
      { url: `${CDN_BASE}/item-trackers/e0bd2125f439/DEV/generic`, name: "tracker-1", type: "image" },
      { url: `${CDN_BASE}/item-trackers/dc445484cc21/DEV/generic`, name: "tracker-2", type: "image" },
      { url: `${CDN_BASE}/item-trackers/d76b0b23bfe4/DEV/generic`, name: "tracker-3", type: "image" },
    ],
    features: [
      "Precision Finding with Ultra-Wideband arrow guidance",
      "Global encrypted crowd-sourced Bluetooth mesh find network",
      "IP67 water-resistant up to 1 meter depth for 30 minutes",
      "User-replaceable coin battery lasting over one full year",
    ],
    pdfUrl: null,
  },
  {
    id: "devolinks-6g-minion-router",
    collectionId: "minion-router",
    title: "Devolink 6G Minion Wi-Fi Mesh Travel Router",
    category: "Travel",
    price: "$189.00",
    description: "Ultra-compact travel-ready wireless router engineered for digital nomads with multi-band carrier failover, captive-portal bypass, and VPN encryption.",
    cover: {
      url: `${CDN_BASE}/minion-router/4f103e017fdd/DEV/generic`,
      type: "image",
    },
    thumbnails: [
      { url: `${CDN_BASE}/minion-router/4f103e017fdd/DEV/generic`, name: "router-1", type: "image" },
      { url: `${CDN_BASE}/minion-router/166e76317d81/DEV/generic`, name: "router-2", type: "image" },
      { url: `${CDN_BASE}/minion-router/4e59066ce704/DEV/generic`, name: "router-3", type: "image" },
    ],
    features: [
      "Wi-Fi 6E/7 dual-band transmission pushing up to 3000Mbps speeds",
      "Pre-installed OpenWrt with one-click WireGuard / Cloudflare WARP tunneling",
      "Hotel & airport captive portal clone and instant multi-device bridge",
      "Gigabit Ethernet WAN/LAN ports + USB-C 5V/3A power input",
    ],
    pdfUrl: null,
  },
  {
    id: "compression-travel-luggage",
    collectionId: "vaccum-compression",
    title: "Vacuum Compression Travel Luggage",
    category: "Travel",
    price: "$340.00",
    description: "Heavy-duty aerospace-grade polycarbonate carry-on suitcase featuring an internal built-in mechanical ratchet compression divider that maximizes packing volume.",
    cover: {
      url: `${CDN_BASE}/vaccum-compression/f93085123d78/DEV/generic`,
      type: "image",
    },
    thumbnails: [
      { url: `${CDN_BASE}/vaccum-compression/f93085123d78/DEV/generic`, name: "luggage-1", type: "image" },
      { url: `${CDN_BASE}/vaccum-compression/e9699a53113e/DEV/generic`, name: "luggage-2", type: "image" },
      { url: `${CDN_BASE}/vaccum-compression/4e4981a78e7f/DEV/generic`, name: "luggage-3", type: "image" },
    ],
    features: [
      "Integrated mechanical ratchet compression board expands pack space by 45%",
      "Indestructible 100% German Bayer Makrolon polycarbonate shell",
      "Hinomoto 360-degree silent Japanese dual-caster ball bearing wheels",
      "TSA-approved integrated combination lock with hidden AirTag pocket",
    ],
    pdfUrl: null,
  },
  {
    id: "anix-solix-solar-umbrella",
    collectionId: "solar-umb",
    title: "Anix Solix Solar Charging Umbrella",
    category: "Travel",
    price: "$199.00",
    description: "Storm-tested travel umbrella integrated with high-efficiency flexible solar panels across the canopy and a 10,000mAh fast-charging battery inside the ergonomic handle.",
    cover: {
      url: `${CDN_BASE}/solar-umb/88222ec3d265/DEV/generic`,
      type: "image",
    },
    thumbnails: [
      { url: `${CDN_BASE}/solar-umb/88222ec3d265/DEV/generic`, name: "umbrella-1", type: "image" },
      { url: `${CDN_BASE}/solar-umb/762f0be235e5/DEV/generic`, name: "umbrella-2", type: "image" },
      { url: `${CDN_BASE}/solar-umb/4bb3a9e37239/DEV/generic`, name: "umbrella-3", type: "image" },
      { url: `${CDN_BASE}/solar-umb/571ffe9c07ce/DEV/generic`, name: "umbrella-4", type: "image" },
    ],
    features: [
      "15W flexible monocrystalline solar cells laminated into waterproof fabric",
      "10,000mAh handle battery with USB-C 20W PD output",
      "Double-canopy inverted wind venting withstanding gusts up to 55 mph",
      "Hydrophobic Teflon coating repelling water instantly with UV50+ block",
    ],
    pdfUrl: null,
  },
];

// Helper queries
export function getAllCategoryProducts() {
  return CATEGORY_ITEMS;
}

export function getCategoryProducts(category) {
  if (!category || category.toLowerCase() === "all") {
    return CATEGORY_ITEMS;
  }
  return CATEGORY_ITEMS.filter(
    (item) => item.category.toLowerCase() === category.toLowerCase()
  );
}

export function getCategoryProductBySlug(slug) {
  if (!slug) return null;
  const decoded = decodeURIComponent(slug).trim().toLowerCase();
  const normalized = decoded.replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
  return (
    CATEGORY_ITEMS.find((item) => {
      const itemSlug = (item.id || "").toLowerCase();
      const titleSlug = (item.title || "").trim().toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
      const colId = (item.collectionId || "").toLowerCase();
      const matchesAlias = Array.isArray(item.aliases) && item.aliases.some((a) => a.toLowerCase() === normalized || a.toLowerCase() === decoded);
      return (
        itemSlug === normalized ||
        itemSlug === decoded ||
        titleSlug === normalized ||
        colId === normalized ||
        colId === decoded ||
        matchesAlias
      );
    }) || null
  );
}
