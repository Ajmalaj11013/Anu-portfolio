"use client";

import React, { useState, useEffect } from "react";
import {
  PROJECTS,
  PHOTOGRAPHY_SECTIONS,
  FILM_CATEGORIES,
  Project,
} from "@/data/portfolio";
import {
  ArrowRight,
  ArrowLeft,
  Play,
  Menu,
  X,
  Instagram,
  Film,
  Mail,
  CheckCircle2,
  Maximize2,
} from "lucide-react";

type ViewState =
  | "home"
  | "photography"
  | "films"
  | "project"
  | "about"
  | "contact";

export default function PortfolioApp() {
  const [view, setView] = useState<ViewState>("home");
  const [activeProjectId, setActiveProjectId] = useState<string>(
    "the-seasonal-table"
  );
  const [homeCategoryFilter, setHomeCategoryFilter] = useState<string>("all");
  const [photoFilter, setPhotoFilter] = useState<string>("all");
  const [filmFilter, setFilmFilter] = useState<string>("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [activeVideoModal, setActiveVideoModal] = useState<Project | null>(
    null
  );

  // Contact form state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "",
    brief: "",
    budget: "",
    timeline: "",
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMobileMenuOpen(false);
  }, [view, activeProjectId]);

  const navigateToProject = (projectId: string) => {
    setActiveProjectId(projectId);
    setView("project");
  };

  const navigateToCategory = (
    targetView: "photography" | "films",
    slug: string = "all"
  ) => {
    if (targetView === "photography") {
      setPhotoFilter(slug);
    } else {
      setFilmFilter(slug);
    }
    setView(targetView);
  };

  const currentProject =
    PROJECTS.find((p) => p.id === activeProjectId) || PROJECTS[3];
  const currentProjectIndex = PROJECTS.findIndex(
    (p) => p.id === currentProject.id
  );
  const prevProject =
    PROJECTS[
    (currentProjectIndex - 1 + PROJECTS.length) % PROJECTS.length
    ];
  const nextProject =
    PROJECTS[(currentProjectIndex + 1) % PROJECTS.length];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#EDE8DF] text-[#2A2A26] editorial-paper-surface relative">
      {/* Authentic Film Grain & Tactile Paper Fiber Overlay across the entire viewport */}
      <div className="film-grain-overlay" aria-hidden="true" />

      {/* TOP NAVIGATION BAR (#EDE8DF Ivory Beige background, #2A2A26 Charcoal headings & navigation, #4A3B2F Deep Brown lines) */}
      <header className="sticky top-0 z-40 bg-[#EDE8DF]/95 backdrop-blur-sm border-b border-[#C9BBA7] transition-colors">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10 h-16 sm:h-20 flex items-center justify-between">
          <button
            onClick={() => setView("home")}
            className="font-serif text-xl sm:text-2xl tracking-[0.22em] text-[#2A2A26] hover:text-[#4A3B2F] transition-colors uppercase"
          >
            AJNAS
          </button>

          {/* Desktop Navigation (#2A2A26 Charcoal & #6B6A56 Olive Grey) */}
          <nav className="hidden md:flex items-center space-x-8 lg:space-x-10 text-[10px] tracking-[0.24em] uppercase font-normal text-[#6B6A56]">
            <button
              onClick={() => {
                if (view !== "home") {
                  setView("home");
                  setTimeout(() => {
                    document
                      .getElementById("selected-work")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                } else {
                  document
                    .getElementById("selected-work")
                    ?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className={`hover:text-[#2A2A26] transition-colors py-1 ${view === "home"
                  ? "text-[#2A2A26] font-medium border-b border-[#4A3B2F]"
                  : ""
                }`}
            >
              WORK
            </button>
            <button
              onClick={() => navigateToCategory("photography", "all")}
              className={`hover:text-[#2A2A26] transition-colors py-1 ${view === "photography" ||
                  (view === "project" && currentProject.type === "photography")
                  ? "text-[#2A2A26] font-medium border-b border-[#4A3B2F]"
                  : ""
                }`}
            >
              PHOTOGRAPHY
            </button>
            <button
              onClick={() => navigateToCategory("films", "all")}
              className={`hover:text-[#2A2A26] transition-colors py-1 ${view === "films" ||
                  (view === "project" && currentProject.type === "film")
                  ? "text-[#2A2A26] font-medium border-b border-[#4A3B2F]"
                  : ""
                }`}
            >
              FILMS
            </button>
            <button
              onClick={() => setView("about")}
              className={`hover:text-[#2A2A26] transition-colors py-1 ${view === "about"
                  ? "text-[#2A2A26] font-medium border-b border-[#4A3B2F]"
                  : ""
                }`}
            >
              ABOUT
            </button>
            <button
              onClick={() => setView("contact")}
              className={`hover:text-[#2A2A26] transition-colors py-1 ${view === "contact"
                  ? "text-[#2A2A26] font-medium border-b border-[#4A3B2F]"
                  : ""
                }`}
            >
              CONTACT
            </button>
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open Navigation Menu"
            className="md:hidden p-2 text-[#2A2A26] hover:text-[#4A3B2F] transition-colors"
          >
            <Menu className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>
      </header>

      {/* DARK MOBILE OVERLAY DRAWER (#0E0E0E Pure Black contrast surface as specified in Colour Palette) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#0E0E0E] text-[#EDE8DF] flex flex-col justify-between p-6 sm:p-10">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setView("home");
                setMobileMenuOpen(false);
              }}
              className="font-serif text-xl tracking-[0.22em] text-[#EDE8DF] uppercase"
            >
              AJNAS
            </button>
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close Navigation Menu"
              className="p-2 text-[#C9BBA7] hover:text-[#EDE8DF]"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          <div className="my-auto space-y-6 py-8">
            <div>
              <button
                onClick={() => {
                  setView("home");
                  setMobileMenuOpen(false);
                }}
                className="block text-sm tracking-[0.25em] uppercase text-[#EDE8DF] hover:text-[#C9BBA7] transition-colors mb-4"
              >
                WORK
              </button>
              <div className="pl-5 space-y-3 border-l border-[#4A3B2F]">
                <button
                  onClick={() => navigateToCategory("photography", "all")}
                  className="block text-xs tracking-[0.22em] uppercase text-[#C9BBA7] hover:text-[#EDE8DF] transition-colors"
                >
                  PHOTOGRAPHY
                </button>
                <button
                  onClick={() => navigateToCategory("films", "all")}
                  className="block text-xs tracking-[0.22em] uppercase text-[#C9BBA7] hover:text-[#EDE8DF] transition-colors"
                >
                  FILMS
                </button>
              </div>
            </div>

            <button
              onClick={() => setView("about")}
              className="block text-sm tracking-[0.25em] uppercase text-[#EDE8DF] hover:text-[#C9BBA7] transition-colors"
            >
              ABOUT
            </button>

            <button
              onClick={() => setView("contact")}
              className="block text-sm tracking-[0.25em] uppercase text-[#EDE8DF] hover:text-[#C9BBA7] transition-colors"
            >
              CONTACT
            </button>
          </div>

          <div className="pt-6 border-t border-[#4A3B2F]/60 space-y-3 text-xs text-[#C9BBA7]">
            <div className="flex items-center space-x-6 tracking-wider">
              <a
                href="#instagram"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                }}
                className="hover:text-[#EDE8DF] transition-colors"
              >
                Instagram
              </a>
              <a
                href="#vimeo"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                }}
                className="hover:text-[#EDE8DF] transition-colors"
              >
                Vimeo
              </a>
            </div>
            <p className="tracking-wide text-[#6B6A56]">ajnas@studio.com</p>
          </div>
        </div>
      )}

      {/* MAIN VIEW CONTENT */}
      <main className="flex-grow">
        {/* ==================== 1. HOME VIEW ==================== */}
        {view === "home" && (
          <div className="max-w-[1400px] mx-auto px-5 sm:px-10 pb-20">
            {/* Hero Banner with warm plaster shadow & #4A3B2F / #0E0E0E atmospheric overlay */}
            <section className="relative w-full h-[520px] sm:h-[600px] lg:h-[680px] overflow-hidden mt-3 sm:mt-6 border border-[#C9BBA7]">
              <img
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2000&q=85"
                alt="Editorial fashion portrait in sculptural drapery against textured plaster wall"
                className="w-full h-full object-cover object-center editorial-image-grade"
              />
              {/* Warm Earthy & Cinematic Gradient matching the design's sun-drenched shadow wall */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(100deg, rgba(14,14,14,0.82) 0%, rgba(74,59,47,0.58) 48%, rgba(42,42,38,0.45) 100%)",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 65% 35%, rgba(201,187,167,0.18) 0%, rgba(14,14,14,0.55) 85%)",
                }}
              />

              <div className="absolute inset-0 p-6 sm:p-12 lg:p-16 flex flex-col justify-end sm:justify-between">
                <div className="hidden sm:flex items-center justify-between text-[10px] tracking-[0.24em] uppercase text-[#C9BBA7]/80">
                  <span>STILL &amp; MOVING IMAGE</span>
                  <span>01 / 06</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
                  {/* Left Hero Copy */}
                  <div className="max-w-lg text-[#EDE8DF] space-y-4">
                    <h1 className="font-serif text-4xl sm:text-5xl lg:text-[62px] leading-[1.08] tracking-tight font-normal text-[#EDE8DF]">
                      Images with
                      <br />a point of view.
                    </h1>
                    <p className="text-[10px] sm:text-[11px] tracking-[0.26em] uppercase text-[#C9BBA7] font-medium pt-1">
                      PHOTOGRAPHER &amp; FILM DIRECTOR
                    </p>
                    <p className="text-xs sm:text-sm text-[#EDE8DF]/85 leading-relaxed max-w-sm font-light">
                      Fashion, spaces, objects and stories — explored through
                      editorial photography and moving image.
                    </p>
                    <div className="pt-3">
                      <button
                        onClick={() => {
                          document
                            .getElementById("selected-work")
                            ?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="inline-flex items-center space-x-3 text-[10px] tracking-[0.24em] uppercase text-[#EDE8DF] border-b border-[#C9BBA7]/60 pb-1.5 hover:border-[#EDE8DF] hover:text-[#C9BBA7] transition-all group"
                      >
                        <span>EXPLORE SELECTED WORK</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>

                  {/* Right Hero Discipline List (Desktop) */}
                  <div className="hidden md:flex flex-col space-y-2.5 text-[10px] tracking-[0.24em] uppercase text-[#C9BBA7] border-l border-[#C9BBA7]/35 pl-6 py-1">
                    <button
                      onClick={() => navigateToCategory("photography", "fashion")}
                      className="text-left hover:text-[#EDE8DF] transition-colors"
                    >
                      FASHION
                    </button>
                    <button
                      onClick={() =>
                        navigateToCategory("photography", "architecture")
                      }
                      className="text-left hover:text-[#EDE8DF] transition-colors"
                    >
                      ARCHITECTURE
                    </button>
                    <button
                      onClick={() =>
                        navigateToCategory("photography", "hospitality")
                      }
                      className="text-left hover:text-[#EDE8DF] transition-colors"
                    >
                      HOSPITALITY
                    </button>
                    <button
                      onClick={() => navigateToCategory("photography", "food")}
                      className="text-left hover:text-[#EDE8DF] transition-colors"
                    >
                      FOOD
                    </button>
                    <button
                      onClick={() => navigateToCategory("photography", "food")}
                      className="text-left hover:text-[#EDE8DF] transition-colors"
                    >
                      STILL LIFE
                    </button>
                    <button
                      onClick={() => navigateToCategory("films", "all")}
                      className="text-left hover:text-[#EDE8DF] transition-colors"
                    >
                      MOVING IMAGE
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Mobile Discipline Strip below hero */}
            <div className="md:hidden flex flex-wrap gap-x-5 gap-y-2 py-4 border-b border-[#C9BBA7] text-[10px] tracking-[0.2em] uppercase text-[#6B6A56]">
              <button onClick={() => navigateToCategory("photography", "fashion")}>
                FASHION
              </button>
              <button
                onClick={() => navigateToCategory("photography", "architecture")}
              >
                ARCHITECTURE
              </button>
              <button
                onClick={() => navigateToCategory("photography", "hospitality")}
              >
                HOSPITALITY
              </button>
              <button onClick={() => navigateToCategory("photography", "food")}>
                STILL LIFE
              </button>
              <button onClick={() => navigateToCategory("films", "all")}>
                MOVING IMAGE
              </button>
            </div>

            {/* SELECTED WORK STRIP (6-column desktop grid + filter tabs from Design Sheet 2) */}
            <section id="selected-work" className="pt-14 sm:pt-20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 pb-3 border-b border-[#4A3B2F]/20">
                <div className="flex items-center space-x-6">
                  <h2 className="text-[11px] tracking-[0.24em] uppercase text-[#2A2A26] font-medium">
                    SELECTED WORK
                  </h2>
                  <div className="hidden lg:flex items-center space-x-5 text-[9px] tracking-[0.22em] uppercase text-[#6B6A56]">
                    {[
                      { label: "ALL", val: "all" },
                      { label: "FASHION", val: "fashion" },
                      { label: "ARCHITECTURE", val: "architecture" },
                      { label: "HOSPITALITY", val: "hospitality" },
                      { label: "FOOD", val: "food" },
                    ].map((cat) => (
                      <button
                        key={cat.val}
                        onClick={() => setHomeCategoryFilter(cat.val)}
                        className={`transition-colors ${homeCategoryFilter === cat.val
                            ? "text-[#2A2A26] font-medium underline underline-offset-4 decoration-[#4A3B2F]"
                            : "hover:text-[#2A2A26]"
                          }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => navigateToCategory("photography", "all")}
                  className="inline-flex items-center space-x-2 text-[10px] tracking-[0.22em] uppercase text-[#6B6A56] hover:text-[#2A2A26] transition-colors group"
                >
                  <span>VIEW ALL</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-3.5">
                {PROJECTS.filter((item) =>
                  homeCategoryFilter === "all"
                    ? true
                    : item.categorySlug === homeCategoryFilter
                )
                  .slice(0, 6)
                  .map((item) => (
                    <div
                      key={item.id}
                      onClick={() => navigateToProject(item.id)}
                      className="group cursor-pointer flex flex-col p-2 -m-2 rounded-sm hover:bg-[#C9BBA7]/35 transition-colors duration-300"
                    >
                      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#C9BBA7] border border-[#C9BBA7] mb-3">
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          className="w-full h-full object-cover editorial-image-grade group-hover:scale-105"
                        />
                        {item.type === "film" && (
                          <div className="absolute inset-0 flex items-center justify-center bg-[#0E0E0E]/25 group-hover:bg-[#0E0E0E]/40 transition-colors">
                            <div className="w-9 h-9 rounded-full border border-[#EDE8DF]/80 flex items-center justify-center bg-[#0E0E0E]/40 backdrop-blur-[2px]">
                              <Play className="w-3.5 h-3.5 text-[#EDE8DF] fill-[#EDE8DF] ml-0.5" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-[10px] tracking-[0.18em] uppercase text-[#2A2A26] font-medium group-hover:text-[#4A3B2F] transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-[9px] tracking-[0.15em] uppercase text-[#6B6A56] mt-0.5">
                            {item.category} / {item.year}
                          </p>
                        </div>
                        <ArrowRight className="w-3 h-3 text-[#6B6A56] sm:hidden mt-0.5" />
                      </div>
                    </div>
                  ))}
              </div>
            </section>

            {/* TWO-COLUMN PHOTOGRAPHY & FILMS FEATURE CARDS (Using #C9BBA7 Sand card texture & hover state as specified in Colour Palette) */}
            <section className="pt-16 sm:pt-24 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Photography Card */}
              <div className="border border-[#C9BBA7] p-6 sm:p-9 stone-plaster-texture hover:bg-[#C9BBA7]/35 transition-colors duration-500 flex flex-col justify-between">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="font-serif text-xl sm:text-2xl tracking-[0.08em] uppercase text-[#2A2A26]">
                      PHOTOGRAPHY
                    </h2>
                    <p className="text-xs text-[#6B6A56] mt-2 max-w-xs leading-relaxed">
                      Fashion, hospitality, architecture, food, product and
                      portraiture.
                    </p>
                  </div>
                  <button
                    onClick={() => navigateToCategory("photography", "all")}
                    className="inline-flex items-center space-x-1.5 text-[10px] tracking-[0.2em] uppercase text-[#6B6A56] hover:text-[#2A2A26] transition-colors"
                  >
                    <span>VIEW ALL</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div
                  onClick={() => navigateToCategory("photography", "all")}
                  className="relative aspect-[16/9] w-full overflow-hidden cursor-pointer group border border-[#C9BBA7]"
                >
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85"
                    alt="Photography showcase"
                    className="w-full h-full object-cover editorial-image-grade group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E]/40 to-transparent" />
                </div>
              </div>

              {/* Films Card */}
              <div className="border border-[#C9BBA7] p-6 sm:p-9 stone-plaster-texture hover:bg-[#C9BBA7]/35 transition-colors duration-500 flex flex-col justify-between">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="font-serif text-xl sm:text-2xl tracking-[0.08em] uppercase text-[#2A2A26]">
                      FILMS
                    </h2>
                    <p className="text-xs text-[#6B6A56] mt-2 max-w-xs leading-relaxed">
                      Fashion films, advertising films, editorial documentaries
                      and visual narratives.
                    </p>
                  </div>
                  <button
                    onClick={() => navigateToCategory("films", "all")}
                    className="inline-flex items-center space-x-1.5 text-[10px] tracking-[0.2em] uppercase text-[#6B6A56] hover:text-[#2A2A26] transition-colors"
                  >
                    <span>VIEW ALL</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                  <div
                    onClick={() => navigateToCategory("films", "all")}
                    className="sm:col-span-8 relative aspect-[16/9] w-full overflow-hidden cursor-pointer group border border-[#C9BBA7]"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85"
                      alt="Films showcase"
                      className="w-full h-full object-cover editorial-image-grade group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[#0E0E0E]/30 flex items-center justify-center group-hover:bg-[#0E0E0E]/45 transition-colors">
                      <div className="w-11 h-11 rounded-full border border-[#EDE8DF]/85 flex items-center justify-center bg-[#0E0E0E]/45">
                        <Play className="w-4 h-4 text-[#EDE8DF] fill-[#EDE8DF] ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-4 space-y-2 border-l border-[#C9BBA7] pl-4">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#2A2A26] font-medium">
                      FOOD &amp; STILL LIFE
                    </p>
                    <button
                      onClick={() => navigateToCategory("photography", "food")}
                      className="inline-flex items-center space-x-1.5 text-[11px] text-[#6B6A56] hover:text-[#4A3B2F] transition-colors"
                    >
                      <span>View projects</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* MORE ABOUT LINK */}
            <section className="pt-12 sm:pt-16">
              <div className="border-t border-[#C9BBA7] pt-8 flex justify-end">
                <button
                  onClick={() => setView("about")}
                  className="inline-flex items-center space-x-2 text-[10px] tracking-[0.22em] uppercase text-[#2A2A26] border-b border-[#4A3B2F] pb-1 hover:text-[#4A3B2F] transition-colors group"
                >
                  <span>MORE ABOUT</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </section>
          </div>
        )}

        {/* ==================== 2. PHOTOGRAPHY VIEW ==================== */}
        {view === "photography" && (
          <div className="max-w-[1400px] mx-auto px-5 sm:px-10 pb-20">
            {/* Photography Hero Banner */}
            <section className="relative w-full h-[280px] sm:h-[360px] lg:h-[400px] overflow-hidden mt-3 sm:mt-6 border border-[#C9BBA7]">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=2000&q=85"
                alt="Photography Header"
                className="w-full h-full object-cover object-center editorial-image-grade"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(95deg, rgba(14,14,14,0.82) 0%, rgba(74,59,47,0.52) 55%, rgba(14,14,14,0.25) 100%)",
                }}
              />
              <div className="absolute inset-0 p-6 sm:p-12 lg:p-16 flex flex-col justify-end">
                <h1 className="font-serif text-3xl sm:text-5xl text-[#EDE8DF] font-normal mb-3">
                  Photography
                </h1>
                <p className="text-[10px] sm:text-[11px] tracking-[0.24em] uppercase text-[#C9BBA7]">
                  FASHION &bull; HOSPITALITY &bull; ARCHITECTURE &bull; FOOD
                  &amp; STILL LIFE &bull; PRODUCT
                </p>
              </div>
            </section>

            {/* Category Filter Bar */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-8 py-6 border-b border-[#C9BBA7] text-[10px] tracking-[0.22em] uppercase">
              {[
                { label: "ALL", value: "all" },
                { label: "FASHION & EDITORIAL", value: "fashion" },
                { label: "PRODUCT", value: "hospitality" },
                { label: "ARCHITECTURE", value: "architecture" },
                { label: "FOOD & STILL LIFE", value: "food" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setPhotoFilter(tab.value)}
                  className={`py-1 transition-colors ${photoFilter === tab.value
                      ? "text-[#2A2A26] font-medium border-b border-[#4A3B2F]"
                      : "text-[#6B6A56] hover:text-[#2A2A26]"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Category Rows (4-column horizontal galleries matching Photography mockup) */}
            <div className="space-y-14 sm:space-y-16 pt-10">
              {PHOTOGRAPHY_SECTIONS.filter(
                (sec) => photoFilter === "all" || sec.slug === photoFilter
              ).map((section) => (
                <section key={section.slug}>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-[11px] tracking-[0.24em] uppercase text-[#2A2A26] font-medium">
                      {section.title}
                    </h2>
                    <button
                      onClick={() => {
                        const firstProj = section.images[0]?.projectId;
                        if (firstProj) navigateToProject(firstProj);
                      }}
                      className="inline-flex items-center space-x-1.5 text-[10px] tracking-[0.18em] text-[#6B6A56] hover:text-[#4A3B2F] transition-colors group"
                    >
                      <span>View projects</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                    {section.images.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => navigateToProject(img.projectId)}
                        className="group cursor-pointer relative aspect-[4/3] overflow-hidden bg-[#C9BBA7] border border-[#C9BBA7]"
                      >
                        <img
                          src={img.src}
                          alt={img.caption}
                          className="w-full h-full object-cover editorial-image-grade group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-[#0E0E0E]/0 group-hover:bg-[#0E0E0E]/35 transition-colors flex items-end p-4">
                          <span className="text-[10px] tracking-[0.2em] uppercase text-[#EDE8DF] opacity-0 group-hover:opacity-100 transition-opacity">
                            {img.caption} &rarr;
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        )}

        {/* ==================== 3. FILMS VIEW ==================== */}
        {view === "films" && (
          <div className="max-w-[1400px] mx-auto px-5 sm:px-10 pb-20">
            {/* Films Hero Banner */}
            <section className="relative w-full h-[300px] sm:h-[380px] lg:h-[440px] overflow-hidden mt-3 sm:mt-6 border border-[#C9BBA7]">
              <img
                src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2000&q=85"
                alt="Films Header"
                className="w-full h-full object-cover object-center editorial-image-grade"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(95deg, rgba(14,14,14,0.85) 0%, rgba(74,59,47,0.55) 55%, rgba(14,14,14,0.35) 100%)",
                }}
              />
              <div className="absolute inset-0 p-6 sm:p-12 lg:p-16 flex flex-col justify-end">
                <h1 className="font-serif text-3xl sm:text-5xl text-[#EDE8DF] font-normal mb-3">
                  Films
                </h1>
                <p className="text-[10px] sm:text-[11px] tracking-[0.24em] uppercase text-[#C9BBA7]">
                  FASHION FILMS &bull; ADVERTISING FILMS &bull; EDITORIAL
                  DOCUMENTARIES &bull; EXPERIMENTAL &amp; ART FILMS
                </p>
              </div>
            </section>

            {/* 4-Column Film Category Grid */}
            <section className="pt-10 sm:pt-14">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {FILM_CATEGORIES.map((cat) => (
                  <div
                    key={cat.slug}
                    onClick={() => navigateToProject(cat.projectId)}
                    className="group cursor-pointer p-2.5 -m-2.5 hover:bg-[#C9BBA7]/35 transition-colors"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0E0E0E] border border-[#C9BBA7] mb-3.5">
                      <img
                        src={cat.image}
                        alt={cat.title}
                        className="w-full h-full object-cover opacity-90 editorial-image-grade group-hover:scale-105 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-[#0E0E0E]/30 flex items-center justify-center group-hover:bg-[#0E0E0E]/45 transition-colors">
                        <div className="w-11 h-11 rounded-full border border-[#EDE8DF]/80 flex items-center justify-center bg-[#0E0E0E]/40 backdrop-blur-[2px] group-hover:scale-110 transition-transform">
                          <Play className="w-4 h-4 text-[#EDE8DF] fill-[#EDE8DF] ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <h3 className="text-[10px] tracking-[0.2em] uppercase text-[#2A2A26] font-medium">
                      {cat.title}
                    </h3>
                    <span className="inline-flex items-center space-x-1.5 text-[10px] text-[#6B6A56] mt-1 group-hover:text-[#4A3B2F] transition-colors">
                      <span>View projects</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Selected Motion Reel List */}
            <section className="pt-16 sm:pt-20 border-t border-[#C9BBA7] mt-14">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <h2 className="text-[11px] tracking-[0.24em] uppercase text-[#2A2A26] font-medium">
                  FEATURED MOTION ARCHIVE
                </h2>
                <div className="flex flex-wrap gap-5 text-[10px] tracking-[0.2em] uppercase">
                  {[
                    { label: "ALL", value: "all" },
                    { label: "FASHION FILMS", value: "film-fashion" },
                    { label: "ADVERTISING", value: "film-advertising" },
                    { label: "DOCUMENTARIES", value: "film-documentary" },
                    { label: "EXPERIMENTAL", value: "film-experimental" },
                  ].map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => setFilmFilter(tab.value)}
                      className={
                        filmFilter === tab.value
                          ? "text-[#2A2A26] font-medium border-b border-[#4A3B2F] pb-0.5"
                          : "text-[#6B6A56] hover:text-[#2A2A26]"
                      }
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {PROJECTS.filter(
                  (p) =>
                    p.type === "film" &&
                    (filmFilter === "all" || p.categorySlug === filmFilter)
                ).map((film) => (
                  <div
                    key={film.id}
                    onClick={() => navigateToProject(film.id)}
                    className="group cursor-pointer border border-[#C9BBA7] p-4 sm:p-6 stone-plaster-texture hover:bg-[#C9BBA7]/40 transition-colors"
                  >
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#0E0E0E] mb-4">
                      <img
                        src={film.coverImage}
                        alt={film.title}
                        className="w-full h-full object-cover editorial-image-grade group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-[#0E0E0E]/30 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full border border-[#EDE8DF]/80 flex items-center justify-center bg-[#0E0E0E]/45 group-hover:scale-110 transition-transform">
                          <Play className="w-4 h-4 text-[#EDE8DF] fill-[#EDE8DF] ml-0.5" />
                        </div>
                      </div>
                      {film.duration && (
                        <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-[#0E0E0E]/80 text-[#EDE8DF] text-[10px] tracking-widest">
                          {film.duration}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xs tracking-[0.2em] uppercase text-[#2A2A26] font-medium">
                          {film.title}
                        </h3>
                        <p className="text-[10px] tracking-[0.18em] uppercase text-[#6B6A56] mt-1">
                          {film.category} / {film.year}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#6B6A56] group-hover:text-[#4A3B2F] group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ==================== 4. PROJECT DETAIL VIEW ("The Seasonal Table", "The Silent Form", etc.) ==================== */}
        {view === "project" && (
          <div className="max-w-[1400px] mx-auto px-5 sm:px-10 pt-6 pb-20">
            {/* Back Link */}
            <button
              onClick={() =>
                setView(
                  currentProject.type === "film" ? "films" : "photography"
                )
              }
              className="inline-flex items-center space-x-2 text-[10px] tracking-[0.22em] uppercase text-[#6B6A56] hover:text-[#2A2A26] transition-colors mb-6"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>
                {currentProject.type === "film"
                  ? "ALL FILMS"
                  : "BACK TO WORK"}
              </span>
            </button>

            {/* Project Title & Subtitle */}
            <div className="mb-8">
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#2A2A26] font-normal">
                {currentProject.title}
              </h1>
              <p className="text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-[#6B6A56] mt-2">
                {currentProject.category} / {currentProject.year}
              </p>
            </div>

            {/* Asymmetric Two-Column Project Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Left 8 Columns: Main Feature Image/Film + Bottom 3-Up Grid */}
              <div className="lg:col-span-8 space-y-4">
                <div
                  onClick={() => {
                    if (currentProject.type === "film") {
                      setActiveVideoModal(currentProject);
                    } else {
                      setLightboxImage(currentProject.coverImage);
                    }
                  }}
                  className="relative aspect-[16/11] w-full overflow-hidden bg-[#0E0E0E] border border-[#C9BBA7] cursor-pointer group"
                >
                  <img
                    src={currentProject.coverImage}
                    alt={currentProject.title}
                    className="w-full h-full object-cover editorial-image-grade group-hover:scale-[1.02]"
                  />
                  {currentProject.type === "film" ? (
                    <div className="absolute inset-0 bg-[#0E0E0E]/30 flex items-center justify-center group-hover:bg-[#0E0E0E]/45 transition-colors">
                      <div className="w-16 h-16 rounded-full border border-[#EDE8DF] flex items-center justify-center bg-[#0E0E0E]/45 backdrop-blur-sm group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-[#EDE8DF] fill-[#EDE8DF] ml-1" />
                      </div>
                    </div>
                  ) : (
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0E0E0E]/70 text-[#EDE8DF] p-2">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Bottom 3-Column Stills Row */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  {currentProject.gallery.slice(1, 4).map((imgUrl, idx) => (
                    <div
                      key={idx}
                      onClick={() => setLightboxImage(imgUrl)}
                      className="aspect-square overflow-hidden bg-[#C9BBA7] border border-[#C9BBA7] cursor-pointer group"
                    >
                      <img
                        src={imgUrl}
                        alt={`${currentProject.title} still ${idx + 1}`}
                        className="w-full h-full object-cover editorial-image-grade group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right 4 Columns: Editorial Notes, Role, Discipline & Side Gallery */}
              <div className="lg:col-span-4 flex flex-col justify-between space-y-8">
                <div className="space-y-6">
                  <p className="text-xs sm:text-sm text-[#2A2A26] leading-relaxed font-light">
                    {currentProject.description}
                  </p>

                  <div className="border-t border-[#C9BBA7] pt-4 space-y-4">
                    <div>
                      <p className="text-[9px] tracking-[0.22em] uppercase text-[#6B6A56]">
                        ROLE
                      </p>
                      <p className="text-xs text-[#2A2A26] mt-1">
                        {currentProject.role}
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] tracking-[0.22em] uppercase text-[#6B6A56]">
                        DISCIPLINE
                      </p>
                      <p className="text-xs text-[#2A2A26] mt-1">
                        {currentProject.discipline}
                      </p>
                    </div>

                    {/* Film specific credits */}
                    {currentProject.type === "film" && (
                      <div className="pt-3 border-t border-[#C9BBA7] space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-[#6B6A56]">Director</span>
                          <span className="text-[#2A2A26]">
                            {currentProject.director || "Ajnas"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#6B6A56]">Cinematography</span>
                          <span className="text-[#2A2A26]">
                            {currentProject.cinematography || "Ajnas"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#6B6A56]">Editor</span>
                          <span className="text-[#2A2A26]">
                            {currentProject.editor || "Ajnas"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#6B6A56]">Duration</span>
                          <span className="text-[#2A2A26]">
                            {currentProject.duration || "02:58"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column 2x2 Thumbnail Gallery */}
                  <div className="pt-2">
                    <p className="text-[9px] tracking-[0.22em] uppercase text-[#6B6A56] mb-3">
                      GALLERY
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {currentProject.gallery.slice(0, 4).map((gImg, i) => (
                        <div
                          key={i}
                          onClick={() => setLightboxImage(gImg)}
                          className="aspect-[4/3] overflow-hidden bg-[#C9BBA7] border border-[#C9BBA7] cursor-pointer group"
                        >
                          <img
                            src={gImg}
                            alt={`${currentProject.title} thumbnail ${i + 1}`}
                            className="w-full h-full object-cover editorial-image-grade group-hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Previous / Next Project Pagination Footer */}
            <div className="mt-16 pt-6 border-t border-[#C9BBA7] flex items-center justify-between text-[10px] tracking-[0.22em] uppercase text-[#6B6A56]">
              <button
                onClick={() => navigateToProject(prevProject.id)}
                className="inline-flex items-center space-x-2 hover:text-[#2A2A26] transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                <span>PREVIOUS PROJECT</span>
              </button>

              <button
                onClick={() => navigateToProject(nextProject.id)}
                className="inline-flex items-center space-x-2 hover:text-[#2A2A26] transition-colors group"
              >
                <span>NEXT PROJECT</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* ==================== 5. ABOUT VIEW ==================== */}
        {view === "about" && (
          <div className="max-w-[1200px] mx-auto px-5 sm:px-10 pt-8 sm:pt-14 pb-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              {/* Left Column Portrait + Availability Note */}
              <div className="lg:col-span-5 space-y-6">
                <div className="aspect-[4/5] w-full overflow-hidden bg-[#C9BBA7] border border-[#C9BBA7]">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85"
                    alt="Ajnas — Photographer and Film Director"
                    className="w-full h-full object-cover editorial-image-grade"
                  />
                </div>
                <p className="text-[11px] text-[#6B6A56] leading-relaxed">
                  Available for selected commissions
                  <br />
                  and creative collaborations worldwide.
                </p>
              </div>

              {/* Right Column Editorial Bio & Disciplines */}
              <div className="lg:col-span-7 space-y-7">
                <h1 className="font-serif text-3xl sm:text-4xl text-[#2A2A26] font-normal">
                  About
                </h1>

                <p className="font-serif text-xl sm:text-2xl leading-[1.4] text-[#2A2A26] font-normal">
                  I am an independent image-maker and film director working
                  across fashion, still life, architecture, hospitality and
                  moving image.
                </p>

                <p className="text-xs sm:text-sm text-[#6B6A56] leading-relaxed max-w-lg">
                  My practice explores the relationship between form, atmosphere
                  and storytelling, bringing an editorial sensibility to both
                  still and moving images. Working closely with designers,
                  architects, hospitality brands and publications across
                  Bangalore, Calicut and internationally.
                </p>

                <div className="pt-5 border-t border-[#C9BBA7]">
                  <h2 className="text-[10px] tracking-[0.24em] uppercase text-[#6B6A56] mb-4">
                    CREATIVE DISCIPLINES
                  </h2>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-[#2A2A26] font-light">
                    <li>Fashion Editorial</li>
                    <li>Hospitality &amp; Architecture</li>
                    <li>Food &amp; Still Life</li>
                    <li>Product &amp; Campaign Imagery</li>
                    <li>Fashion Films</li>
                    <li>Advertising Films</li>
                    <li>Editorial Documentaries</li>
                  </ul>
                </div>

                {/* Signature & Deep Brown (#4A3B2F) Button from Brand Sheet */}
                <div className="pt-6 flex flex-wrap items-center justify-between gap-6 border-t border-[#C9BBA7]">
                  <div>
                    <p className="font-signature text-3xl text-[#2A2A26] italic">
                      Ajnas
                    </p>
                    <p className="text-[9px] tracking-[0.24em] uppercase text-[#6B6A56] mt-1">
                      PHOTOGRAPHER &amp; FILM DIRECTOR
                    </p>
                  </div>

                  <button
                    onClick={() => setView("contact")}
                    className="px-6 py-3 bg-[#4A3B2F] text-[#EDE8DF] text-[10px] tracking-[0.22em] uppercase hover:bg-[#2A2A26] transition-colors inline-flex items-center space-x-2"
                  >
                    <span>VIEW SERVICES / ENQUIRE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== 6. CONTACT VIEW ("Let's work together.") ==================== */}
        {view === "contact" && (
          <div className="max-w-[960px] mx-auto px-5 sm:px-10 pt-8 sm:pt-14 pb-24">
            <div className="mb-10">
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#2A2A26] font-normal">
                Let&apos;s work together.
              </h1>
              <p className="text-xs sm:text-sm text-[#6B6A56] mt-2.5">
                For commissions, collaborations and project enquiries.
              </p>
            </div>

            {formSubmitted ? (
              <div className="border border-[#C9BBA7] p-8 sm:p-12 stone-plaster-texture space-y-4">
                <div className="flex items-center space-x-3 text-[#4A3B2F]">
                  <CheckCircle2 className="w-6 h-6" />
                  <h2 className="font-serif text-2xl text-[#2A2A26]">
                    Enquiry Received
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-[#6B6A56] leading-relaxed max-w-lg">
                  Thank you for reaching out, {formData.name || "there"}. Your
                  project brief has been received and I will get back to you
                  shortly.
                </p>
                <button
                  onClick={() => {
                    setFormSubmitted(false);
                    setFormData({
                      name: "",
                      email: "",
                      company: "",
                      projectType: "",
                      brief: "",
                      budget: "",
                      timeline: "",
                    });
                  }}
                  className="text-[10px] tracking-[0.22em] uppercase text-[#2A2A26] border-b border-[#4A3B2F] pb-1 pt-2"
                >
                  SEND ANOTHER MESSAGE &rarr;
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] tracking-[0.18em] uppercase text-[#6B6A56] mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-[#EDE8DF] border border-[#C9BBA7] px-3.5 py-2.5 text-xs text-[#2A2A26] focus:outline-none focus:border-[#4A3B2F] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.18em] uppercase text-[#6B6A56] mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-[#EDE8DF] border border-[#C9BBA7] px-3.5 py-2.5 text-xs text-[#2A2A26] focus:outline-none focus:border-[#4A3B2F] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] tracking-[0.18em] uppercase text-[#6B6A56] mb-2">
                      Company / Publication
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      className="w-full bg-[#EDE8DF] border border-[#C9BBA7] px-3.5 py-2.5 text-xs text-[#2A2A26] focus:outline-none focus:border-[#4A3B2F] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.18em] uppercase text-[#6B6A56] mb-2">
                      Project Type *
                    </label>
                    <select
                      required
                      value={formData.projectType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          projectType: e.target.value,
                        })
                      }
                      className="w-full bg-[#EDE8DF] border border-[#C9BBA7] px-3.5 py-2.5 text-xs text-[#2A2A26] focus:outline-none focus:border-[#4A3B2F] transition-colors"
                    >
                      <option value="">Select an option</option>
                      <option value="Fashion Editorial">
                        Fashion Editorial
                      </option>
                      <option value="Product">
                        Product
                      </option>
                      <option value="Architecture">Architecture</option>
                      <option value="Food & Still Life">
                        Food &amp; Still Life
                      </option>
                      <option value="Fashion / Campaign Film">
                        Fashion / Campaign Film
                      </option>
                      <option value="Documentary">Documentary</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] tracking-[0.18em] uppercase text-[#6B6A56] mb-2">
                    Project Brief *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.brief}
                    onChange={(e) =>
                      setFormData({ ...formData, brief: e.target.value })
                    }
                    className="w-full bg-[#EDE8DF] border border-[#C9BBA7] px-3.5 py-2.5 text-xs text-[#2A2A26] focus:outline-none focus:border-[#4A3B2F] transition-colors resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] tracking-[0.18em] uppercase text-[#6B6A56] mb-2">
                      Budget Range (optional)
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) =>
                        setFormData({ ...formData, budget: e.target.value })
                      }
                      className="w-full bg-[#EDE8DF] border border-[#C9BBA7] px-3.5 py-2.5 text-xs text-[#2A2A26] focus:outline-none focus:border-[#4A3B2F] transition-colors"
                    >
                      <option value="">Select an option</option>
                      <option value="Under $2,500">Under $2,500</option>
                      <option value="$2,500 – $5,000">$2,500 – $5,000</option>
                      <option value="$5,000 – $10,000">$5,000 – $10,000</option>
                      <option value="$10,000+">$10,000+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.18em] uppercase text-[#6B6A56] mb-2">
                      Timeline (optional)
                    </label>
                    <select
                      value={formData.timeline}
                      onChange={(e) =>
                        setFormData({ ...formData, timeline: e.target.value })
                      }
                      className="w-full bg-[#EDE8DF] border border-[#C9BBA7] px-3.5 py-2.5 text-xs text-[#2A2A26] focus:outline-none focus:border-[#4A3B2F] transition-colors"
                    >
                      <option value="">Select an option</option>
                      <option value="Immediate (Within 2 weeks)">
                        Immediate (Within 2 weeks)
                      </option>
                      <option value="Next 1–2 Months">Next 1–2 Months</option>
                      <option value="Flexible / Upcoming Season">
                        Flexible / Upcoming Season
                      </option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  {/* Button uses #4A3B2F Deep Brown & #2A2A26 Charcoal per Colour Palette guidelines */}
                  <button
                    type="submit"
                    className="px-7 py-3 bg-[#4A3B2F] text-[#EDE8DF] text-[10px] tracking-[0.24em] uppercase hover:bg-[#2A2A26] transition-colors inline-flex items-center space-x-2.5"
                  >
                    <span>SEND ENQUIRY</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            {/* Contact Bottom Info Bar */}
            <div className="mt-16 pt-8 border-t border-[#C9BBA7] flex flex-col sm:flex-row sm:items-end justify-between gap-6 text-xs text-[#6B6A56]">
              <div className="space-y-1">
                <p className="text-[#2A2A26] font-medium">Based in India.</p>
                <p>Available for international projects.</p>
                <p className="text-[10px] tracking-[0.22em] uppercase pt-2 text-[#6B6A56]">
                  BANGALORE / CALICUT
                </p>
              </div>

              <div className="space-y-1.5 sm:text-right">
                <a
                  href="mailto:hello@ajnas.studio"
                  className="block text-[#2A2A26] hover:text-[#4A3B2F] transition-colors"
                >
                  hello@ajnas.studio
                </a>
                <div className="flex sm:justify-end space-x-4 text-[11px]">
                  <a
                    href="#instagram"
                    onClick={(e) => e.preventDefault()}
                    className="hover:text-[#2A2A26] transition-colors"
                  >
                    Instagram &rarr;
                  </a>
                  <a
                    href="#vimeo"
                    onClick={(e) => e.preventDefault()}
                    className="hover:text-[#2A2A26] transition-colors"
                  >
                    Vimeo &rarr;
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#C9BBA7] bg-[#EDE8DF]">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setView("home")}
              className="font-serif text-lg tracking-[0.22em] uppercase text-[#2A2A26]"
            >
              AJNAS
            </button>
            <span className="text-[9px] tracking-[0.22em] uppercase text-[#6B6A56]">
              PHOTOGRAPHER &amp; FILM DIRECTOR
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-[10px] tracking-[0.2em] uppercase text-[#6B6A56]">
            <button
              onClick={() => setView("home")}
              className="hover:text-[#2A2A26] transition-colors"
            >
              WORK
            </button>
            <button
              onClick={() => navigateToCategory("photography", "all")}
              className="hover:text-[#2A2A26] transition-colors"
            >
              PHOTOGRAPHY
            </button>
            <button
              onClick={() => navigateToCategory("films", "all")}
              className="hover:text-[#2A2A26] transition-colors"
            >
              FILMS
            </button>
            <button
              onClick={() => setView("about")}
              className="hover:text-[#2A2A26] transition-colors"
            >
              ABOUT
            </button>
            <button
              onClick={() => setView("contact")}
              className="hover:text-[#2A2A26] transition-colors"
            >
              CONTACT
            </button>
          </div>

          <div className="flex items-center space-x-5 text-[10px] tracking-[0.18em] text-[#6B6A56]">
            <a
              href="#instagram"
              onClick={(e) => e.preventDefault()}
              aria-label="Instagram"
              className="hover:text-[#2A2A26] transition-colors"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a
              href="#vimeo"
              onClick={(e) => e.preventDefault()}
              aria-label="Vimeo"
              className="hover:text-[#2A2A26] transition-colors"
            >
              <Film className="w-3.5 h-3.5" />
            </a>
            <a
              href="mailto:hello@ajnas.studio"
              aria-label="Email"
              className="hover:text-[#2A2A26] transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
            </a>
            <span>&copy; 2025 AJNAS</span>
          </div>
        </div>

        {/* Bottom Textured Stone Strip from the Colour Palette & Mood Sheet */}
        <div className="dark-stone-banner border-t border-[#4A3B2F] py-3.5 px-5 sm:px-10">
          <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[9px] tracking-[0.26em] uppercase text-[#C9BBA7]">
            <span>AJNAS &mdash; PHOTOGRAPHER &amp; FILM DIRECTOR</span>
            <span className="text-[#EDE8DF]/70">
              FASHION / ARCHITECTURE / HOSPITALITY / FOOD / PRODUCT /
              DOCUMENTARY
            </span>
          </div>
        </div>
      </footer>

      {/* LIGHTBOX FOR HIGH-RES STILL PHOTOGRAPHY */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-[#0E0E0E]/95 flex items-center justify-center p-4 sm:p-10 cursor-zoom-out"
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 text-[#C9BBA7] hover:text-[#EDE8DF] p-2"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxImage}
            alt="Full resolution view"
            className="max-h-[88vh] max-w-[92vw] object-contain border border-[#4A3B2F]"
          />
        </div>
      )}

      {/* FILM SCREENING MODAL */}
      {activeVideoModal && (
        <div
          onClick={() => setActiveVideoModal(null)}
          className="fixed inset-0 z-50 bg-[#0E0E0E]/95 flex items-center justify-center p-4 sm:p-10"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full bg-[#0E0E0E] border border-[#4A3B2F] p-4 sm:p-6 space-y-4"
          >
            <div className="flex items-center justify-between text-[#EDE8DF]">
              <div>
                <h3 className="font-serif text-xl">{activeVideoModal.title}</h3>
                <p className="text-[10px] tracking-[0.22em] uppercase text-[#C9BBA7]">
                  {activeVideoModal.category} &bull;{" "}
                  {activeVideoModal.duration || "02:58"}
                </p>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="text-[#C9BBA7] hover:text-[#EDE8DF] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-video w-full bg-[#2A2A26] overflow-hidden flex items-center justify-center">
              <img
                src={activeVideoModal.coverImage}
                alt={activeVideoModal.title}
                className="w-full h-full object-cover opacity-50 editorial-image-grade"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-14 h-14 rounded-full border border-[#EDE8DF] flex items-center justify-center bg-[#0E0E0E]/60">
                  <Play className="w-5 h-5 text-[#EDE8DF] fill-[#EDE8DF] ml-0.5" />
                </div>
                <p className="text-xs tracking-[0.2em] uppercase text-[#EDE8DF]">
                  Screening Preview — {activeVideoModal.title}
                </p>
                <p className="text-xs text-[#C9BBA7] max-w-md">
                  Replace with your Vimeo or MP4 embed URL in{" "}
                  <code className="text-[#EDE8DF]">src/data/portfolio.ts</code>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
