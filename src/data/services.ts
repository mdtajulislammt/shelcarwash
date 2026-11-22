import type { AddOn, Catalog, Package, Vehicle } from '@/types';

export const VEHICLES: Vehicle[] = [
  {
    id: 'sedan',
    name: 'Sedan / Coupe',
    description: 'Compact cars, sedans, 2-door coupes',
    priceMultiplier: 1.0,
    iconName: 'Car',
  },
  {
    id: 'suv',
    name: 'Crossover / Hatchback',
    description: 'Mid-size & 2-row',
    priceMultiplier: 1.2,
    iconName: 'CarFront',
  },
  {
    id: 'truck',
    name: 'SUV / Truck / Minivan',
    description: '3-Row, Pickup trucks, full-size minivans',
    priceMultiplier: 1.4,
    iconName: 'Truck',
  },
  {
    id: 'exotic',
    name: 'Exotic / Luxury / Vintage',
    description: 'Supercars, rare classics, delicate multi-stage paint',
    priceMultiplier: 1.65,
    iconName: 'Sparkles',
  },
];

export const PACKAGES: Package[] = [
  {
    id: 'exterior-maintenance-wash',
    name: 'Exterior Maintenance Wash',
    tagline: 'High pressure washer, pH-neutral snow foam bath, hand wash & dry',
    description:
      'Quick & thorough exterior cleaning featuring a high pressure washer rinse, pH-neutral snow foam bath, scratch-free hand wash, and hand dry.',
    durationMinutes: 45,
    basePrice: 50,
    category: 'maintenance',
    features: [
      'High pressure washer pre-rinse & foam presoak',
      'pH-neutral snow foam bath',
      'Scratch-free hand wash & dry',
      'Wheel & tire face de-greasing',
      'Streak-free exterior glass polish',
    ],
  },
  {
    id: 'maintenance-clean',
    name: 'Int/Ext. Maintenance Cleaning',
    tagline: 'Ideal for new or slightly messy cars needing a complete maintenance reset',
    description:
      'Designed specifically for new or slightly messy vehicles that need routine care. Includes a pH-neutral foam bath, tire satin shine, spray ceramic booster, plus light interior vacuuming, dash wipe-down, and streak-free glass cleaning.',
    durationMinutes: 75,
    basePrice: 120,
    category: 'maintenance',
    features: [
      'Perfect for new or slightly messy vehicles',
      'pH-neutral snow foam bath & scratch-free hand wash',
      'Wheel barrel & tire de-greasing + satin shine',
      'Hydrophobic spray ceramic booster (30-day shield)',
      'Interior vacuuming, dash wipe & door jamb care',
      'Streak-free interior windows',
    ],
  },
  {
    id: 'interior-deep-clean',
    name: 'Signature Interior Sanctuary',
    tagline: 'Deep steam extraction, leather conditioning & odor elimination',
    description:
      'Comprehensive interior deep cleaning. Heated carpet extraction, leather conditioning, dashboard UV protection, and complete sanitization.',
    durationMinutes: 150,
    basePrice: 150,
    popular: true,
    category: 'interior',
    features: [
      'Hot water carpet & upholstery shampoo extraction',
      'Deep steam sanitization of vents, cupholders & crevices',
      'pH-balanced leather scrub & rich conditioner restoration',
      'Leather conditioner application on dash, doors & trim',
      'Pet hair & fiber detail brushing',
      'Anti-bacterial cabin filter & fresh scent treatment',
    ],
  },
  {
    id: 'signature-detail',
    name: 'Signature Detail Package',
    tagline: 'Complete interior & exterior care with hot steam sanitization & rug shampoo',
    description:
      'Our Signature Detail package combines high-temp hot steam sanitization, deep rug & carpet shampooing, pH-neutral exterior foam bath, and wheel barrel detailing.',
    durationMinutes: 180,
    basePrice: 200,
    popular: true,
    category: 'full',
    features: [
      'Hot steam sanitization for vents, cupholders & interior surfaces',
      'Deep rug shampoo extraction with steam for stubborn stains',
      'pH-neutral snow foam bath & scratch-free hand dry',
      'Leather scrub & interior vinyl conditioning',
      'Wheel barrel de-greasing & satin tire shine',
      'Streak-free interior & exterior glass windows',
    ],
  },
  {
    id: 'executive-full-detail',
    name: 'Apex Executive Full Detail',
    tagline: 'Our flagship complete interior & exterior transformation package',
    description:
      'The ultimate bumper-to-bumper detailing experience. Combines full interior steam sanctuary with single-stage paint gloss enhancement and engine bay detail.',
    durationMinutes: 240,
    basePrice: 299,
    popular: true,
    category: 'full',
    features: [
      'Everything in Interior Sanctuary & Maintenance Cleaning',
      'Single-stage machine paint polishing (30%+ swirl reduction)',
      'Clay bar decontamination for ultra-smooth glass paint',
      '6-Month hydrophobic synthetic paint sealant',
      'Engine bay detail & rubber hose dressing',
      'Exhaust tip metal polishing & restoration',
    ],
  },
  {
    id: 'ceramic-shield-pro',
    name: '9H Ceramic Shield Pro',
    tagline: 'Multi-year ceramic paint coating with multi-stage paint correction',
    description:
      'Professional grade 9H Nano-Ceramic coating for extreme shine, scratch resistance, chemical resistance, and 3+ years of effortless hydrophobic protection.',
    durationMinutes: 360,
    basePrice: 599,
    category: 'ceramic',
    features: [
      '2-Stage machine paint correction (75%+ swirl & scratch removal)',
      '3-Year 9H Nano-Ceramic paint coating application',
      'Hydrophobic ceramic glass & windshield shield',
      'Ceramic wheel face protection against brake dust',
      'Official warranty & digital service certificate after completion',
      'Complimentary 30-day ceramic inspection & wash',
    ],
  },
  {
    id: 'yearly-maintenance-pass',
    name: 'Yearly Exterior Maintenance Package',
    tagline: '26 total Bi-weekly exterior washes for 1 year',
    description:
      'Our ultimate annual maintenance pass. Enjoy bi-weekly (26 total) professional exterior hand washes, snow foam pre-soak, tire shine, and spray sealant all year long.',
    durationMinutes: 60,
    basePrice: 999,
    popular: true,
    category: 'maintenance',
    features: [
      '26 Bi-weekly exterior hand washes over 12 months',
      'pH-neutral snow foam bath & scratch-free hand wash',
      'Wheel barrel & tire de-greasing with satin tire gloss',
      'Hydrophobic spray ceramic booster each session',
      'Crystal-clear exterior glass polish every wash',
      'Annual pass with automatic scheduling',
    ],
  },
];

export const ADD_ONS: AddOn[] = [
  {
    id: 'headlight-restoration',
    name: 'Headlight Oxidation Restoration',
    description: 'Wet sanding, compound polish & UV clear seal for crystal clear night visibility',
    price: 20,
    durationMinutes: 45,
    icon: 'Sun',
  },
  {
    id: 'windshield-ceramic',
    name: 'Rain-X Hydrophobic 30 day Coating',
    description: 'Repels heavy rain and dirt for crystal clear visibility without wiper chatter',
    price: 20,
    durationMinutes: 20,
    icon: 'Droplets',
  },
  {
    id: 'pet-hair-removal',
    name: 'Heavy Pet Hair & Fiber Extraction',
    description:
      'Specialized rubber brushes, pneumatic tools & deep vacuuming for stubborn pet hair',
    price: 50,
    durationMinutes: 30,
    icon: 'Dog',
  },
  {
    id: 'engine-bay-detail',
    name: 'Engine Bay Steam & Dressing',
    description: 'Safe steam degreasing, grime removal, and matte protective hose dressing',
    price: 50,
    durationMinutes: 40,
    icon: 'Gauge',
  },
  {
    id: 'ozone-odor-eliminator',
    name: 'Mold, Milk, or food Deep Clean',
    description:
      'Intensive enzymatic extraction, hot steam sanitization, and deep odor neutralization for mold, milk spills, and embedded food residue',
    price: 85,
    durationMinutes: 60,
    icon: 'Wind',
  },
];

/** Default package pre-selected when the booking flow starts. */
export const DEFAULT_PACKAGE_ID = 'interior-deep-clean';

export const CATALOG: Catalog = { vehicles: VEHICLES, packages: PACKAGES, addOns: ADD_ONS };
