// ============================================================================
// File: src/lib/productMetadata.js
// Purpose: Product Catalog Business Metadata for Nestor E-Commerce Demo
//          Each product references its deployed collectionId in Umber Cloud ADN.
//          Asset URLs, thumbnails, and covers are fetched and formed dynamically
//          via Umber Cloud ADN APIs using environment variables.
// ============================================================================

export const productMetadata = [
  // ==========================================================================
  // Category: FUN
  // ==========================================================================
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
      "Full SteamOS with desktop Linux environment",
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
      "Whisper-quiet liquid cooling chamber",
    ],
  },
  {
    collectionId: "emoji-alarm-clock",
    title: "Emoji Expression Smart Alarm Clock",
    category: "Fun",
    price: "$39.00",
    description: "Interactive desktop digital clock with animated pixel emoji facial reactions, voice-activated nightlight, and temperature sensor.",
    features: [
      "Expressive retro pixel LED screen with over 20 animated mood expressions",
      "Voice and clap-activated soft ambient nightlight with step-less dimming",
      "Dual programmable alarms with weekend snooze and graduated wake tones",
      "Onboard ambient temperature and humidity sensors with real-time display",
    ],
  },
  {
    collectionId: "gameboy-mug",
    title: "Retro Game Boy Heat-Sensitive Ceramic Mug",
    category: "Fun",
    price: "$19.00",
    description: "Nostalgic retro gaming mug that reveals a classic 8-bit game screen when filled with hot coffee, tea, or cocoa.",
    features: [
      "Thermo-chromatic ink coating reveals game scene when hot liquid is poured",
      "Authentic D-Pad and action button detailing embossed on high-grade ceramic",
      "12oz (350ml) volume capacity with ergonomic comfort handle",
      "Durable glazed finish preserves retro artwork through countless brews",
    ],
  },
  {
    collectionId: "led-glasses",
    title: "Cyberpunk Programmable LED Party Glasses",
    category: "Fun",
    price: "$45.00",
    description: "Futuristic illuminated eyewear featuring customizable LED text, dynamic animations, and music-rhythm equalizer visualization.",
    features: [
      "Full-frame high-density RGB LED array with wide-angle see-through visibility",
      "Smartphone app integration for custom text scrolling and pixel doodles",
      "Built-in acoustic sensor for real-time music audio spectrum visualization",
      "Lightweight ergonomic frame with rechargeable 5-hour continuous battery",
    ],
  },
  {
    collectionId: "retro-gramophone",
    title: "Retro Acoustic Gramophone Bluetooth Speaker",
    category: "Fun",
    price: "$129.00",
    description: "Vintage brass-horn acoustic amplifier combined with modern Bluetooth 5.3 wireless lossless audio streaming and wood-grain base.",
    features: [
      "Precision-crafted resonant brass horn passively amplifies high frequencies",
      "Subwoofer base driver delivering warm, room-filling bass response",
      "Bluetooth 5.3 wireless connection plus 3.5mm AUX and micro-SD playback",
      "Vintage rotary brass volume dial with tactile feedback",
    ],
  },
  {
    collectionId: "runaway-alarm-clock",
    title: "Clocky Runaway Wheeled Alarm Clock",
    category: "Fun",
    price: "$35.00",
    description: "The notorious runaway alarm clock that jumps off your nightstand and rolls away beeping to force deep sleepers out of bed.",
    features: [
      "Twin all-terrain shock-absorbing rubber wheels leap up to 3 feet safely",
      "Randomized directional obstacle-avoidance algorithm runs and hides",
      "Extra-loud 85dB robotic beeping sequence guarantees instant wakefulness",
      "One-snooze grace period option before the runaway sequence triggers",
    ],
  },

  // ==========================================================================
  // Category: AI
  // ==========================================================================
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
      "Up to 40 hours battery life with 3-minute quick charge for 3 hours",
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
      "Charging case providing up to 36 hours of battery life",
    ],
    variants: [
      { id: "matte-black", label: "Matte Black", hex: "#1a1a1a", collectionId: "ray-bans", available: true },
      { id: "tortoise-brown", label: "Tortoise Brown", hex: "#6b4423", collectionId: "ray-bans-brown", available: true },
    ],
    defaultVariantId: "matte-black",
    tryOn: {
      enabled: true,
      collectionId: "ray-bans-model",
    },
  },
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
      "Bluetooth 5.3 + lossless wireless streaming",
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
      "Direct USB-C DisplayPort support for PC, Mac, consoles and iPhone",
    ],
  },
  {
    collectionId: "ai-agent-dispatcher",
    title: "AI Agent Dispatcher Hub",
    category: "AI",
    price: "$189.00",
    description: "Physical desktop terminal for autonomous AI agent dispatching, workflow monitoring, and multimodal task delegation.",
    features: [
      "Dedicated dual-display task monitoring and priority dispatching interface",
      "Hardware kill-switch and local agent execution authorization keys",
      "Wi-Fi 6E + Bluetooth 5.3 low-latency agent mesh synchronizer",
      "Universal API bridge compatible with major LLM agent frameworks",
    ],
  },
  {
    collectionId: "magic-ai-glasses",
    title: "Magic AI Vision Glasses",
    category: "AI",
    price: "$329.00",
    description: "Ultra-lightweight smart eyeglasses featuring real-time visual AI recognition, live translation heads-up display, and spatial audio.",
    features: [
      "MicroLED optical waveguide display projecting floating heads-up text",
      "Instant foreign language translation and contextual scene comprehension",
      "Directional bone-conduction audio transducers with zero sound leakage",
      "Featherlight 42g titanium frame styled for all-day prescription lens wear",
    ],
  },
  {
    collectionId: "self-flying-pocket-cam",
    title: "Hover Self-Flying AI Pocket Camera",
    category: "AI",
    price: "$299.00",
    description: "Enclosed-propeller autonomous palm-launch pocket drone with AI visual person tracking, hands-free 4K video recording, and auto-return.",
    features: [
      "Zero-controller palm launch and auto-land with AI optical hand tracking",
      "Fully enclosed carbon-fiber propeller cage safe for indoor and group use",
      "4K UHD HDR video stabilization with AI face and body follow modes",
      "Foldable pocket-sized form factor weighing less than 125 grams (no FAA cert required)",
    ],
  },

  // ==========================================================================
  // Category: PRODUCTIVITY
  // ==========================================================================
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
      "Magnetic clip mounting & continuous 30-hour record battery",
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
      "Dual-pivot chassis with reinforced carbon fiber frame",
    ],
  },
  {
    collectionId: "banana-hub-port",
    title: "Banana Hub 4-Port USB Expander",
    category: "Productivity",
    price: "$24.00",
    description: "Playful silicone 4-port high-speed USB 3.0 data hub shaped like a banana, offering flexible plug angles and 5Gbps transfer rates.",
    features: [
      "4 high-speed USB-A 3.0 ports with up to 5Gbps data transfer speeds",
      "Shock-absorbing food-grade silicone casing with bendable trunk",
      "Plug-and-play driverless support for Windows, macOS, Linux, and Android",
      "Integrated over-current and surge protection on all ports",
    ],
  },
  {
    collectionId: "night-vision-camera",
    title: "Infrared Tactical Night Vision Camera",
    category: "Productivity",
    price: "$149.00",
    description: "Full HD pocket night-vision camera with 850nm infrared illuminator, 5x digital zoom, and ultra-low-light starlight sensor.",
    features: [
      "High-sensitivity starlight sensor captures vivid detail in complete darkness",
      "Stealth 850nm infrared spotlight beam with up to 200 meters night reach",
      "1080p Full HD video recording and 12MP high-resolution snapshot capture",
      "Pocket-sized ruggedized body with universal 1/4-inch tripod thread",
    ],
  },

  // ==========================================================================
  // Category: WELLNESS
  // ==========================================================================
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
      "BPA-free electropolished 18/8 food-grade stainless steel",
    ],
    suggestion: true,
  },
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
      "App-connected scheduling and automated fan velocity adjustment",
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
      "AI-driven Galaxy AI Energy Score and Sleep Apnea detection",
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
      "10-hour rechargeable battery designed for all-night comfort",
    ],
  },
  {
    collectionId: "train-humidifier",
    title: "Steam Locomotive Ultrasonic Train Humidifier",
    category: "Wellness",
    price: "$49.00",
    description: "Whimsical vintage steam train tabletop ultrasonic cool mist humidifier with realistic puffing chimney steam and LED warm nightlight.",
    features: [
      "Ultrasonic cold atomization emits puffing steam rings from the train chimney",
      "Warm vintage LED headlamp doubles as a soothing bedside nightlight",
      "Whisper-quiet 20dB operation with auto-shutoff when water level runs dry",
      "Large 350ml water reservoir provides up to 8 hours of continuous mist",
    ],
  },
  {
    collectionId: "volcano-humidifier",
    title: "Erupting Volcano Flame Mist Humidifier",
    category: "Wellness",
    price: "$54.00",
    description: "Volcanic eruption aroma diffuser and ultrasonic humidifier featuring pulsating ring mist puffs and realistic flame glow ambient effects.",
    features: [
      "Dual mist eruption modes: realistic continuous volcanic flame and pulsating smoke rings",
      "Ambient warm amber and cool glacier blue LED lighting modes",
      "Aromatherapy essential oil compatible tank with whisper-silent oscillation",
      "Intelligent smart timer (2h/8h) with dry-burn auto power-off protection",
    ],
  },

  // ==========================================================================
  // Category: TRAVEL
  // ==========================================================================
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
      "ActiveShield 2.0 temperature sensor checking heat over 3 million times daily",
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
      "Airline-approved TSA carry-on battery capacity (99.54Wh)",
    ],
  },
  {
    collectionId: "cargo-container-powerbank",
    title: "Cargo Container Heavy-Duty Powerbank",
    category: "Travel",
    price: "$79.00",
    description: "Industrial miniature intermodal shipping container design packing a rugged 20,000mAh battery with multi-protocol USB-C fast charging.",
    features: [
      "20,000mAh high-density Li-ion cell inside an all-metal die-cast container shell",
      "Dual 65W USB-C Power Delivery 3.0 ports + 22.5W USB-A QC 4.0 port",
      "Intelligent LED charge level and temperature status gauge",
      "Shockproof corrugated corners engineered for rigorous travel",
    ],
  },
  {
    collectionId: "pocket-powerbank",
    title: "Ultra-Slim Magnetic Pocket Powerbank",
    category: "Travel",
    price: "$39.00",
    description: "Credit-card sized magnetic wireless powerbank engineered for effortless everyday carry and fast wireless phone topping-off.",
    features: [
      "Ultra-thin 8.8mm aerospace aluminum profile slips into any wallet or pocket",
      "Strong N52 neodymium magnetic ring locks firmly onto compatible phones",
      "15W MagSafe-compatible wireless fast charging + 20W bidirectional USB-C",
      "Smart thermal regulation prevents device heating during high-speed top-offs",
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
      "User-replaceable coin battery lasting over one full year",
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
      "Gigabit Ethernet WAN/LAN ports + USB-C 5V/3A power input",
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
      "Hydrophobic Teflon coating repelling water instantly with UV50+ block",
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
      "TSA-approved integrated combination lock with hidden AirTag pocket",
    ],
  },
];
