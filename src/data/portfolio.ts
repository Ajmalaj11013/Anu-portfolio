export type CategorySlug =
  | "fashion"
  | "hospitality"
  | "architecture"
  | "food"
  | "product"
  | "documentary"
  | "film-fashion"
  | "film-advertising"
  | "film-documentary"
  | "film-experimental";

export interface Project {
  id: string;
  title: string;
  category: string;
  categorySlug: CategorySlug;
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
  videoUrl?: string;
}

export interface PhotographyImageItem {
  src: string;
  projectId: string;
  caption: string;
}

export interface PhotographySection {
  title: string;
  slug: string;
  images: PhotographyImageItem[];
}

export interface FilmCategoryItem {
  title: string;
  slug: string;
  projectId: string;
  image: string;
}

export interface ResponsiveImageConfig {
  desktopSrc?: string;
  mobileSrc?: string;
  sourceSrc?: string;
  mobileSourceSrc?: string;
  desktopWidth?: number;
  desktopHeight?: number;
  mobileWidth?: number;
  mobileHeight?: number;
  desktopZoom?: number;
  desktopPanX?: number;
  desktopPanY?: number;
  mobileZoom?: number;
  mobilePanX?: number;
  mobilePanY?: number;
  desktopFit?: "cover" | "contain";
  mobileFit?: "cover" | "contain";
  offsetY?: number;
}

export interface SiteContent {
  brandName: string;
  brandSubtitle: string;
  imageSettings?: Record<string, ResponsiveImageConfig>;
  hero: {
    image: string;
    videoUrl?: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    description: string;
    ctaText: string;
  };
  homeCards: {
    photographyTitle: string;
    photographyDesc: string;
    photographyImage: string;
    filmsTitle: string;
    filmsDesc: string;
    filmsImage: string;
    filmsSideLabel: string;
  };
  photographyPage: {
    title: string;
    subtitle: string;
    bannerImage: string;
  };
  filmsPage: {
    title: string;
    subtitle: string;
    bannerImage: string;
  };
  aboutPage: {
    title: string;
    portraitImage: string;
    availabilityNote: string;
    leadBio: string;
    bodyBio: string;
    disciplinesTitle: string;
    disciplines: string[];
    signatureName: string;
    signatureRole: string;
  };
  contactPage: {
    title: string;
    subtitle: string;
    locationTitle: string;
    locationSub: string;
    cities: string;
    email: string;
    instagramUrl: string;
    vimeoUrl: string;
  };
  projects: Project[];
  photographySections: PhotographySection[];
  filmCategories: FilmCategoryItem[];
}

export const PROJECTS: Project[] = [];

export const PHOTOGRAPHY_SECTIONS: PhotographySection[] = [
  {
    title: "FASHION & EDITORIAL",
    slug: "fashion",
    images: [],
  },
  {
    title: "PRODUCT",
    slug: "hospitality",
    images: [],
  },
  {
    title: "ARCHITECTURE",
    slug: "architecture",
    images: [],
  },
  {
    title: "ADVERTISING",
    slug: "food",
    images: [],
  },
  {
    title: "DOCUMENTARY",
    slug: "documentary",
    images: [],
  },
];

export const FILM_CATEGORIES: FilmCategoryItem[] = [
  {
    title: "FASHION FILMS",
    slug: "film-fashion",
    projectId: "",
    image: "",
  },
  {
    title: "ADVERTISING & CAMPAIGN FILMS",
    slug: "film-advertising",
    projectId: "",
    image: "",
  },
  {
    title: "EDITORIAL DOCUMENTARIES",
    slug: "film-documentary",
    projectId: "",
    image: "",
  },
  {
    title: "EXPERIMENTAL & ART FILMS",
    slug: "film-experimental",
    projectId: "",
    image: "",
  },
];

export const DEFAULT_SITE_CONTENT: SiteContent = {
  brandName: "AJNAS",
  brandSubtitle: "PHOTOGRAPHER & FILM DIRECTOR",
  hero: {
    image: "",
    titleLine1: "Images with",
    titleLine2: "a point of view.",
    subtitle: "PHOTOGRAPHER & FILM DIRECTOR",
    description:
      "Fashion, spaces, objects and stories — explored through editorial photography and moving image.",
    ctaText: "EXPLORE SELECTED WORK",
  },
  homeCards: {
    photographyTitle: "PHOTOGRAPHY",
    photographyDesc:
      "Fashion, hospitality, architecture, food, product and portraiture.",
    photographyImage: "",
    filmsTitle: "FILMS",
    filmsDesc:
      "Fashion films, advertising films, editorial documentaries and visual narratives.",
    filmsImage: "",
    filmsSideLabel: "ADVERTISING",
  },
  photographyPage: {
    title: "Photography",
    subtitle:
      "FASHION & EDITORIAL • PRODUCT • ARCHITECTURE • ADVERTISING • DOCUMENTARY",
    bannerImage: "",
  },
  filmsPage: {
    title: "Films",
    subtitle:
      "FASHION FILMS • ADVERTISING FILMS • EDITORIAL DOCUMENTARIES • EXPERIMENTAL & ART FILMS",
    bannerImage: "",
  },
  aboutPage: {
    title: "About",
    portraitImage: "",
    availabilityNote:
      "Available for selected commissions and creative collaborations worldwide.",
    leadBio:
      "I am an independent image-maker and film director working across fashion, still life, architecture, hospitality and moving image.",
    bodyBio:
      "My practice explores the relationship between form, atmosphere and storytelling, bringing an editorial sensibility to both still and moving images. Working closely with designers, architects, hospitality brands and publications across Bangalore, Calicut and internationally.",
    disciplinesTitle: "CREATIVE DISCIPLINES",
    disciplines: [
      "Fashion Editorial",
      "Product & Campaign Imagery",
      "Architecture & Spaces",
      "Advertising",
      "Documentary",
      "Fashion Films",
      "Advertising Films",
      "Editorial Documentaries",
    ],
    signatureName: "Ajnas",
    signatureRole: "PHOTOGRAPHER & FILM DIRECTOR",
  },
  contactPage: {
    title: "Let's work together.",
    subtitle: "For commissions, collaborations and project enquiries.",
    locationTitle: "Based in India.",
    locationSub: "Available for international projects.",
    cities: "BANGALORE / CALICUT",
    email: "hello@ajnas.studio",
    instagramUrl: "#instagram",
    vimeoUrl: "#vimeo",
  },
  projects: PROJECTS,
  photographySections: PHOTOGRAPHY_SECTIONS,
  filmCategories: FILM_CATEGORIES,
};
