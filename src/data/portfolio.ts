export interface Project {
  id: string;
  title: string;
  category: string;
  categorySlug: "fashion" | "hospitality" | "architecture" | "food" | "product" | "film-fashion" | "film-advertising" | "film-documentary" | "film-experimental";
  type: "photography" | "film";
  year: string;
  role: string;
  discipline: string;
  description: string;
  coverImage: string;
  gallery: string[];
  featured?: boolean;
  duration?: string;
  director?: string;
  cinematography?: string;
  editor?: string;
  videoPreview?: string;
}

export const PROJECTS: Project[] = [
  {
    id: "the-silent-form",
    title: "The Silent Form",
    category: "FASHION EDITORIAL",
    categorySlug: "fashion",
    type: "photography",
    year: "2024",
    role: "Photography & Art Direction",
    discipline: "Fashion & Editorial",
    description:
      "A study in form, movement and quiet strength. This editorial explores the relationship between the body, sculptural draped fabric and raw architectural space.",
    coverImage:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85",
    ],
    featured: true,
  },
  {
    id: "cafe-lumiere",
    title: "Café Lumière",
    category: "HOSPITALITY",
    categorySlug: "hospitality",
    type: "photography",
    year: "2024",
    role: "Interior & Atmosphere Photography",
    discipline: "Product",
    description:
      "Capturing the warm afternoon stillness of a brutalist-inspired sanctuary. Natural light filters through botanical textures, limewash walls and handcrafted timber furniture.",
    coverImage:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1400&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85",
    ],
    featured: true,
  },
  {
    id: "landscapes-of-living",
    title: "Landscapes of Living",
    category: "ARCHITECTURE",
    categorySlug: "architecture",
    type: "photography",
    year: "2024",
    role: "Architectural Photographer",
    discipline: "Architecture",
    description:
      "A series exploring the balance between monolithic concrete architecture, reflective water courts, and the untamed coastal horizon.",
    coverImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=85",
    ],
    featured: true,
  },
  {
    id: "the-seasonal-table",
    title: "The Seasonal Table",
    category: "FOOD & STILL LIFE",
    categorySlug: "food",
    type: "photography",
    year: "2024",
    role: "Photography & Creative Direction",
    discipline: "Food & Still Life",
    description:
      "A quiet exploration of seasonal produce, texture and light — where food becomes a study in form, colour and atmosphere.",
    coverImage:
      "https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=1400&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1000&q=85",
    ],
    featured: true,
  },
  {
    id: "in-between",
    title: "A Moving Still / In Between",
    category: "FASHION FILM",
    categorySlug: "film-fashion",
    type: "film",
    year: "2024",
    role: "Director & Cinematographer",
    discipline: "Fashion Films",
    director: "Ajnas",
    cinematography: "Ajnas",
    editor: "Ajnas",
    duration: "02:58",
    description:
      "A visual journey through presence, absence and the spaces in between. Shot on 16mm grain emulator at dusk across old stone courtyards.",
    coverImage:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85",
    ],
    featured: true,
  },
  {
    id: "the-river-between",
    title: "The River Between",
    category: "DOCUMENTARY",
    categorySlug: "film-documentary",
    type: "film",
    year: "2023",
    role: "Director & DP",
    discipline: "Editorial Documentaries",
    director: "Ajnas",
    cinematography: "Ajnas",
    editor: "Ajnas",
    duration: "06:14",
    description:
      "An intimate observational short following river boatmen at first light—documenting rhythm, mist, heritage and quiet resilience.",
    coverImage:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1000&q=85",
    ],
    featured: true,
  },
  {
    id: "vessels-of-earth",
    title: "Vessels of Earth",
    category: "PRODUCT & STILL LIFE",
    categorySlug: "food",
    type: "photography",
    year: "2024",
    role: "Photographer",
    discipline: "Food & Still Life",
    description:
      "Tactile botanical apothecary bottles, hand-thrown ceramics and raw linen captured under directional chiaroscuro lighting.",
    coverImage:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=85",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85",
    ],
    featured: false,
  },
  {
    id: "weight-of-being",
    title: "The Weight of Being",
    category: "ADVERTISING & CAMPAIGN",
    categorySlug: "film-advertising",
    type: "film",
    year: "2024",
    role: "Film Director",
    discipline: "Advertising & Campaign Films",
    director: "Ajnas",
    cinematography: "Ajnas",
    editor: "Ajnas",
    duration: "01:45",
    description:
      "Campaign film crafted for an artisanal luxury label. Set against windswept highland plateaus at golden hour.",
    coverImage:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=85",
    ],
    featured: false,
  },
  {
    id: "solitude-in-stone",
    title: "Solitude in Stone",
    category: "EXPERIMENTAL FILM",
    categorySlug: "film-experimental",
    type: "film",
    year: "2023",
    role: "Director",
    discipline: "Experimental & Art Films",
    director: "Ajnas",
    cinematography: "Ajnas",
    editor: "Ajnas",
    duration: "03:30",
    description:
      "An experimental visual poem examining how shadow, skin, and ancient stone echo memory.",
    coverImage:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1400&q=85",
    gallery: [
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=85",
    ],
    featured: false,
  },
];

export const PHOTOGRAPHY_SECTIONS = [
  {
    title: "FASHION & EDITORIAL",
    slug: "fashion",
    images: [
      {
        src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85",
        projectId: "the-silent-form",
        caption: "Coastal Reverie — Editorial",
      },
      {
        src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85",
        projectId: "the-silent-form",
        caption: "Chiaroscuro Portrait",
      },
      {
        src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=85",
        projectId: "the-silent-form",
        caption: "The Silent Form",
      },
      {
        src: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=85",
        projectId: "the-silent-form",
        caption: "Study in Linen",
      },
    ],
  },
  {
    title: "PRODUCT",
    slug: "hospitality",
    images: [
      {
        src: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=85",
        projectId: "cafe-lumiere",
        caption: "Courtyard Dining",
      },
      {
        src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85",
        projectId: "cafe-lumiere",
        caption: "Villa Sanctuary",
      },
      {
        src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=85",
        projectId: "cafe-lumiere",
        caption: "Ocean Overlook",
      },
      {
        src: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=900&q=85",
        projectId: "cafe-lumiere",
        caption: "Minimalist Suite",
      },
    ],
  },
  {
    title: "ARCHITECTURE",
    slug: "architecture",
    images: [
      {
        src: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=85",
        projectId: "landscapes-of-living",
        caption: "Concrete & Light",
      },
      {
        src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85",
        projectId: "landscapes-of-living",
        caption: "Shadow Corridor",
      },
      {
        src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=85",
        projectId: "landscapes-of-living",
        caption: "Tactile Ritual",
      },
      {
        src: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=900&q=85",
        projectId: "landscapes-of-living",
        caption: "Monolithic Pavilion",
      },
    ],
  },
  {
    title: "FOOD & STILL LIFE",
    slug: "food",
    images: [
      {
        src: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=85",
        projectId: "the-seasonal-table",
        caption: "Artisanal Harvest",
      },
      {
        src: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=85",
        projectId: "vessels-of-earth",
        caption: "Botanical Essences",
      },
      {
        src: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85",
        projectId: "the-seasonal-table",
        caption: "Evening Decanter",
      },
      {
        src: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=900&q=85",
        projectId: "the-seasonal-table",
        caption: "Figs & Stoneware",
      },
    ],
  },
];

export const FILM_CATEGORIES = [
  {
    title: "FASHION FILMS",
    slug: "film-fashion",
    projectId: "in-between",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "ADVERTISING & CAMPAIGN FILMS",
    slug: "film-advertising",
    projectId: "weight-of-being",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "EDITORIAL DOCUMENTARIES",
    slug: "film-documentary",
    projectId: "the-river-between",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "EXPERIMENTAL & ART FILMS",
    slug: "film-experimental",
    projectId: "solitude-in-stone",
    image:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000&q=85",
  },
];

