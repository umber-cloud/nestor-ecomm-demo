// ============================================================================
// File: src/lib/productMetadata.js
// Purpose: Product Catalog Business Metadata for Nestor E-Commerce Demo
//          Each product references its deployed collectionId in Umber Cloud ADN.
//          Domain ID: 6ae094fb1701f00439587797 | Host: harbour-wren-3226.umberadn.com
// ============================================================================

export const productMetadata = [
  // --------------------------------------------------------------------------
  // Category: FUN
  // --------------------------------------------------------------------------
  {
    collectionId: "steam-deck",
    title: "Steam Deck OLED",
    category: "Fun",
    price: "$649.00",
    description: "Handheld gaming powerhouse featuring a custom AMD APU, 7.4-inch 90Hz HDR OLED display, premium haptics, and full PC gaming library compatibility on the go.",
    features: [
      "7.4-inch 90Hz HDR OLED display (1000 nits peak)",
      "Custom 6nm AMD APU (Zen 2 + RDNA 2)",
      "50Wh battery with 3-12 hours of gameplay",
      "Full SteamOS with desktop Linux environment"
    ],
  },
  {
    collectionId: "gaming-consoles",
    title: "Modular Gaming Console",
    category: "Fun",
    price: "$499.00",
    description: "Dual-architecture hybrid entertainment system with high-refresh graphics, low-latency wireless controllers, and multi-platform cloud syncing.",
    features: [
      "4K 120Hz HDMI 2.1 video output with HDR support",
      "Custom ultra-fast NVMe storage expansion",
      "Tactile haptic feedback controllers included",
      "Whisper-quiet liquid cooling chamber"
    ],
  },

  // --------------------------------------------------------------------------
  // Category: AI
  // --------------------------------------------------------------------------
  {
    collectionId: "sp-speaker",
    title: "Spherical Magnetic Fluid Audio Speaker",
    category: "AI",
    price: "$380.00",
    description: "Futuristic visual acoustic speaker featuring responsive ferrofluid suspended inside a transparent sphere that dances to music frequencies with AI-tuned room acoustics.",
    features: [
      "Pure NASA-grade black magnetic ferrofluid visualization",
      "AI audio frequency separation & responsive electromagnet control",
      "360-degree high-fidelity neodymium audio drivers",
      "Bluetooth 5.3 + lossless wireless streaming"
    ],
  },
  {
    collectionId: "ray-bans",
    title: "IRay glasses",
    category: "AI",
    price: "$299.00",
    featured: true,
    description: "Next-gen smart eyewear combining iconic frames with multimodal AI. Stream POV video, capture 12MP photos, and ask questions about your surroundings hands-free.",
    features: [
      "Ultra-wide 12MP camera for hands-free 1080p video recording",
      "Open-ear custom directional speakers with 5-mic array",
      "Multimodal AI assistant for visual and voice inquiries",
      "Charging case providing up to 36 hours of battery life"
    ],
  },
  {
    collectionId: "headphones",
    title: "Soly",
    category: "AI",
    price: "$399.00",
    featured: true,
    description: "Next-generation industry-benchmark wireless noise-canceling headphones. Equipped with custom carbon fiber composite acoustic drivers, dual noise-canceling processors, and AI spatial audio.",
    features: [
      "Dual HD Noise Canceling Processor with 8 precision microphones",
      "Specially developed 30mm carbon composite precision sound unit",
      "Hi-Res Audio Wireless with LDAC and AI acoustic upscaling",
      "Up to 40 hours battery life with 3-minute quick charge for 3 hours"
    ],
    cover: {
      url: "https://harbour-wren-3226.umberadn.com/api/vi/6ae094fb1701f00439587797/headphones/6aaf980d4fdd/DEV/generic",
      type: "image"
    },
    thumbnails: [
      {
        url: "https://harbour-wren-3226.umberadn.com/api/vi/6ae094fb1701f00439587797/headphones/6aaf980d4fdd/DEV/generic",
        name: "headphone image 1",
        type: "image"
      },
      {
        url: "https://harbour-wren-3226.umberadn.com/api/vi/6ae094fb1701f00439587797/headphones/77c9ad78549e/DEV/generic",
        name: "headphone image 2",
        type: "image"
      },
      {
        url: "https://harbour-wren-3226.umberadn.com/api/vi/6ae094fb1701f00439587797/headphones/cb8e00386d2b/DEV/generic",
        name: "headphone image 3",
        type: "image"
      },
      {
        url: "https://harbour-wren-3226.umberadn.com/api/vi/6ae094fb1701f00439587797/headphones/1595c5e4428e/DEV/generic",
        name: "headphone video",
        type: "video"
      }
    ],
  },
  {
    collectionId: "x-real-ar-glasses",
    title: "XREAL One Pro AR Glasses",
    category: "AI",
    price: "$499.00",
    description: "Spatial computing glasses projecting a massive 120Hz virtual display right before your eyes. Powered by dual Sony Micro-OLED panels with 52-degree field of view.",
    features: [
      "Dual Sony 0.68-inch Micro-OLED displays with 1080p per eye",
      "120Hz refresh rate with 500 nits perceived brightness",
      "Electrochromic dimming lenses for outdoor/indoor adaptability",
      "Direct USB-C DisplayPort support for PC, Mac, consoles and iPhone"
    ],
  },
  {
    collectionId: "headphones",
    title: "EchoBass Studio Headphones",
    category: "AI",
    price: "$349.00",
    description: "Reference-grade over-ear headphones with adaptive AI noise cancellation, tuned for studio-accurate sound whether you're mixing tracks or tuning out the world.",
    features: [
      "Adaptive AI noise cancellation with transparency mode",
      "40mm bio-cellulose drivers for studio-accurate response",
      "Bluetooth 5.3 multipoint with lossless wired fallback",
      "38-hour battery life with 5-minute quick-charge boost"
    ],
  },

  // --------------------------------------------------------------------------
  // Category: PRODUCTIVITY
  // --------------------------------------------------------------------------
  {
    collectionId: "ai-voice-recorder",
    title: "AI Voice Recorder & Transcriber",
    category: "Productivity",
    price: "$159.00",
    description: "Compact titanium smart voice recorder with dual Knowles microphones and onboard LLM acceleration. Transcribes conversations in real time, distinguishes speakers, and exports instant summaries.",
    features: [
      "Dual Knowles beamforming microphones with AGC (Auto Gain Control)",
      "GPT-4o powered automated meeting minutes & action item extraction",
      "64GB onboard encrypted eMMC flash storage (approx 480 hrs audio)",
      "Magnetic clip mounting & continuous 30-hour record battery"
    ],
  },
  {
    collectionId: "rollable-laptop",
    title: "Lenovo ThinkBook Rollable Laptop",
    category: "Productivity",
    price: "$2,899.00",
    description: "Breakthrough concept laptop with an internal motorized rollable OLED screen that expands vertically from 12.7 inches to an expansive 15.3 inches at the tap of a button.",
    features: [
      "Motorized rollable OLED screen extending from 12.7\" (4:3) to 15.3\" (8:9)",
      "Intel Core Ultra 7 processor with dedicated NPU for local AI workloads",
      "Dual-channel LPDDR5X RAM and 1TB PCIe Gen 4 SSD",
      "Dual-pivot chassis with reinforced carbon fiber frame"
    ],
  },
  {
    collectionId: "mx-master-3s",
    title: "MX Master 3S Wireless Mouse",
    category: "Productivity",
    price: "$99.00",
    description: "Industry-standard performance wireless productivity mouse engineered for coders, designers, and power users. Features 8,000 DPI Darkfield sensor tracking on glass, ultra-quiet mechanical clicks, and MagSpeed electromagnetic scrolling.",
    features: [
      "8,000 DPI Darkfield optical sensor that tracks accurately on any surface including glass",
      "MagSpeed electromagnetic scroll wheel shifting from ratchet to hyper-fast 1,000 lines/sec",
      "Quiet Click switches reducing click acoustic noise by 90%",
      "USB-C rechargeable battery lasting up to 70 days per full charge"
    ],
    cover: {
      url: "https://adn.umbercloud.io/api/vi/67a06a45ea8a39c6628c71c3/WorkspaceCraftPro/0adcc9141b11/dev/generic",
      type: "image"
    },
    thumbnails: [
      {
        url: "https://adn.umbercloud.io/api/vi/67a06a45ea8a39c6628c71c3/WorkspaceCraftPro/0adcc9141b11/dev/generic",
        name: "mx-master-1.jpg",
        type: "image"
      }
    ],
  },

  // --------------------------------------------------------------------------
  // Category: WELLNESS
  // --------------------------------------------------------------------------
  {
    collectionId: "air-purifier",
    title: "Smart HEPA Room Air Purifier",
    category: "Wellness",
    price: "$249.00",
    description: "Compact smart room air purifier equipped with laser air-quality diagnostics and a 3-layer medical-grade True HEPA H13 filtration core that cleans up to 500 sq ft in 30 minutes.",
    features: [
      "Medical-grade True HEPA H13 filter capturing 99.97% of PM2.5 particulates",
      "Dual laser particulate sensor reporting real-time AQI metrics",
      "Whisper-quiet sleep cycle at 22dB sound level",
      "App-connected scheduling and automated fan velocity adjustment"
    ],
    suggestion: true,
  },
  {
    collectionId: "sc-bottle",
    title: "IClean",
    category: "Wellness",
    price: "$95.00",
    featured: true,
    description: "IClean intelligent double-wall vacuum insulated stainless steel water bottle. An integrated 280nm UV-C LED in the cap automatically purifies drinking water and eliminates odor every 2 hours.",
    features: [
      "Eradicates up to 99.99% of bio-contaminants with 280nm UV-C LED",
      "Keeps liquids cold for 24 hours or hot for 12 hours",
      "Magnetic USB waterproof charging port with 1-month battery per charge",
      "BPA-free electropolished 18/8 food-grade stainless steel"
    ],
    suggestion: true,
  },
  {
    collectionId: "smart-ring",
    title: "Smart Health & Fitness Ring",
    category: "Wellness",
    price: "$399.00",
    description: "Featherlight titanium smart ring engineered for 24/7 biometric awareness. Monitors sleep debt, resting heart rate, skin temperature, and daily Energy Scores inside an ultra-comfortable ring form factor.",
    features: [
      "Grade 5 concave titanium chassis weighing less than 3 grams",
      "10ATM water resistance and IP68 dust-proof rating",
      "Up to 7 days continuous tracking on a single charge",
      "AI-driven Galaxy AI Energy Score and Sleep Apnea detection"
    ],
    suggestion: true,
  },
  {
    collectionId: "muse-headband",
    title: "Muse S Meditation & Sleep Headband",
    category: "Wellness",
    price: "$399.00",
    description: "Multi-sensor EEG meditation and sleep tracker woven into a soft, flexible fabric headband. Offers real-time audio biofeedback on brainwave activity, heart rate, and movement to cultivate deep restorative sleep.",
    features: [
      "4 electroencephalography (EEG) channels for active brainwave measurement",
      "PPG optical sensor for heart rate and breathing rhythms",
      "Go-to-Sleep responsive sound journeys that quiet mental chatter",
      "10-hour rechargeable battery designed for all-night comfort"
    ],
  },

  // --------------------------------------------------------------------------
  // Category: TRAVEL
  // --------------------------------------------------------------------------
  {
    collectionId: "multiport-charger",
    title: "GaN III 140W Multi-Port Travel Charger",
    category: "Travel",
    price: "$79.00",
    description: "One small brick charges a laptop, phone and tablet simultaneously. Powered by cutting-edge Gallium Nitride (GaN III) semiconductor technology for high-efficiency travel power.",
    features: [
      "One small brick charges a laptop, phone and tablet simultaneously",
      "140W total output delivering full-speed fast charging to laptop and gear",
      "Foldable wall prongs with universal 100V-240V international travel voltage",
      "ActiveShield 2.0 temperature sensor checking heat over 3 million times daily"
    ],
    suggestion: true,
  },
  {
    collectionId: "high-capacity-pb",
    title: "High-Capacity 250W USB-C PD Power Bank",
    category: "Travel",
    price: "$139.00",
    description: "High-capacity power bank keeping laptops going through long days. Features 27,650mAh capacity, 250W multi-device output, and an intelligent digital smart screen.",
    features: [
      "Keeps laptops going through long days with 27,650mAh capacity",
      "250W maximum multi-device output with 140W single-port USB-C PD 3.1",
      "Real-time TFT smart screen reporting battery health, wattage, and recharge time",
      "Airline-approved TSA carry-on battery capacity (99.54Wh)"
    ],
  },
  {
    collectionId: "item-trackers",
    title: "Precision Smart Item Trackers",
    category: "Travel",
    price: "$29.00",
    description: "Precision finding beacons that utilize ultra-wideband radio and global crowd networks to safeguard travel luggage, backpacks, and key gear.",
    features: [
      "Precision Finding with Ultra-Wideband arrow guidance",
      "Global encrypted crowd-sourced Bluetooth mesh find network",
      "IP67 water-resistant up to 1 meter depth for 30 minutes",
      "User-replaceable coin battery lasting over one full year"
    ],
  },
  {
    collectionId: "minion-router",
    title: "Devolink 6G Minion Wi-Fi Mesh Travel Router",
    category: "Travel",
    price: "$189.00",
    description: "Ultra-compact travel-ready wireless router engineered for digital nomads with multi-band carrier failover, captive-portal bypass, and VPN encryption.",
    features: [
      "Wi-Fi 6E/7 dual-band transmission pushing up to 3000Mbps speeds",
      "Pre-installed OpenWrt with one-click WireGuard / Cloudflare WARP tunneling",
      "Hotel & airport captive portal clone and instant multi-device bridge",
      "Gigabit Ethernet WAN/LAN ports + USB-C 5V/3A power input"
    ],
  },
  {
    collectionId: "solar-umb",
    title: "Anix Solix Solar Charging Umbrella",
    category: "Travel",
    price: "$199.00",
    description: "Storm-tested travel umbrella integrated with high-efficiency flexible solar panels across the canopy and a 10,000mAh fast-charging battery inside the ergonomic handle.",
    features: [
      "15W flexible monocrystalline solar cells laminated into waterproof fabric",
      "10,000mAh handle battery with USB-C 20W PD output",
      "Double-canopy inverted wind venting withstanding gusts up to 55 mph",
      "Hydrophobic Teflon coating repelling water instantly with UV50+ block"
    ],
  },
  {
    collectionId: "vaccum-compression",
    title: "Vacuum Compression Travel Luggage",
    category: "Travel",
    price: "$340.00",
    description: "Heavy-duty aerospace-grade polycarbonate carry-on suitcase featuring an internal built-in mechanical ratchet compression divider that maximizes packing volume.",
    features: [
      "Integrated mechanical ratchet compression board expands pack space by 45%",
      "Indestructible 100% German Bayer Makrolon polycarbonate shell",
      "Hinomoto 360-degree silent Japanese dual-caster ball bearing wheels",
      "TSA-approved integrated combination lock with hidden AirTag pocket"
    ],
  },
];
