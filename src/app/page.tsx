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
    <div
      style={{ backgroundColor: "#F4F2ED", color: "#8C8980" }}
      className="min-h-screen flex flex-col bg-[#F4F2ED] text-[#8C8980] editorial-paper-surface relative"
    >
      {/* Subtle Film Grain Overlay */}
      <div className="film-grain-overlay" aria-hidden="true" />

      {/* TOP NAVIGATION BAR
          - Primary Background: Paper White #F4F2ED
          - Headings, Navigation, Typography: Graphite #373632
          - Subtle Accents, Details: Muted Taupe #B7A28B
          - Hover Background: Soft Black #171715 / Hover Text: Paper White #F4F2ED
      */}
      <header className="sticky top-0 z-40 bg-[#F4F2ED]/95 backdrop-blur-sm border-b border-[#B7A28B]/40 transition-colors">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10 h-16 sm:h-20 flex items-center justify-between">
          <button
            onClick={() => setView("home")}
            className="font-serif text-xl sm:text-2xl tracking-[0.22em] text-[#373632] hover:opacity-75 transition-opacity uppercase"
          >
            AJNAS
          </button>

          {/* Desktop Navigation: Graphite #373632 with Soft Black #171715 hover background & Paper White #F4F2ED hover text */}
          <nav className="hidden md:flex items-center space-x-3 lg:space-x-5 text-[10px] tracking-[0.24em] uppercase font-normal text-[#373632]">
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
              className={`px-3 py-1.5 transition-colors ${
                view === "home"
                  ? "text-[#373632] font-medium border-b border-[#B7A28B]"
                  : "text-[#373632] hover:bg-[#171715] hover:text-[#F4F2ED]"
              }`}
            >
              WORK
            </button>
            <button
              onClick={() => navigateToCategory("photography", "all")}
              className={`px-3 py-1.5 transition-colors ${
                view === "photography" ||
                (view === "project" && currentProject.type === "photography")
                  ? "text-[#373632] font-medium border-b border-[#B7A28B]"
                  : "text-[#373632] hover:bg-[#171715] hover:text-[#F4F2ED]"
              }`}
            >
              PHOTOGRAPHY
            </button>
            <button
              onClick={() => navigateToCategory("films", "all")}
              className={`px-3 py-1.5 transition-colors ${
                view === "films" ||
                (view === "project" && currentProject.type === "film")
                  ? "text-[#373632] font-medium border-b border-[#B7A28B]"
                  : "text-[#373632] hover:bg-[#171715] hover:text-[#F4F2ED]"
              }`}
            >
              FILMS
            </button>
            <button
              onClick={() => setView("about")}
              className={`px-3 py-1.5 transition-colors ${
                view === "about"
                  ? "text-[#373632] font-medium border-b border-[#B7A28B]"
                  : "text-[#373632] hover:bg-[#171715] hover:text-[#F4F2ED]"
              }`}
            >
              ABOUT
            </button>
            <button
              onClick={() => setView("contact")}
              className={`px-3 py-1.5 transition-colors ${
                view === "contact"
                  ? "text-[#373632] font-medium border-b border-[#B7A28B]"
                  : "text-[#373632] hover:bg-[#171715] hover:text-[#F4F2ED]"
              }`}
            >
              CONTACT
            </button>
          </nav>

          {/* Mobile Hamburger Icon: Warm Grey #8C8980 */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open Navigation Menu"
            className="md:hidden p-2 text-[#8C8980] hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors"
          >
            <Menu className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>
      </header>

      {/* DARK MOBILE OVERLAY DRAWER (Soft Black #171715) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#171715] text-[#F4F2ED] flex flex-col justify-between p-6 sm:p-10">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setView("home");
                setMobileMenuOpen(false);
              }}
              className="font-serif text-xl tracking-[0.22em] text-[#F4F2ED] uppercase"
            >
              AJNAS
            </button>
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close Navigation Menu"
              className="p-2 text-[#8C8980] hover:text-[#F4F2ED]"
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
                className="block text-sm tracking-[0.25em] uppercase text-[#F4F2ED] hover:text-[#B7A28B] transition-colors mb-4"
              >
                WORK
              </button>
              <div className="pl-5 space-y-3 border-l border-[#B7A28B]">
                <button
                  onClick={() => navigateToCategory("photography", "all")}
                  className="block text-xs tracking-[0.22em] uppercase text-[#D8D5CD] hover:text-[#F4F2ED] transition-colors"
                >
                  PHOTOGRAPHY
                </button>
                <button
                  onClick={() => navigateToCategory("films", "all")}
                  className="block text-xs tracking-[0.22em] uppercase text-[#D8D5CD] hover:text-[#F4F2ED] transition-colors"
                >
                  FILMS
                </button>
              </div>
            </div>

            <button
              onClick={() => setView("about")}
              className="block text-sm tracking-[0.25em] uppercase text-[#F4F2ED] hover:text-[#B7A28B] transition-colors"
            >
              ABOUT
            </button>

            <button
              onClick={() => setView("contact")}
              className="block text-sm tracking-[0.25em] uppercase text-[#F4F2ED] hover:text-[#B7A28B] transition-colors"
            >
              CONTACT
            </button>
          </div>

          <div className="pt-6 border-t border-[#B7A28B]/30 space-y-3 text-xs text-[#8C8980]">
            <div className="flex items-center space-x-6 tracking-wider text-[#D8D5CD]">
              <a
                href="#instagram"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                }}
                className="hover:text-[#F4F2ED] transition-colors"
              >
                Instagram
              </a>
              <a
                href="#vimeo"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                }}
                className="hover:text-[#F4F2ED] transition-colors"
              >
                Vimeo
              </a>
            </div>
            <p className="tracking-wide text-[#8C8980]">ajnas@studio.com</p>
          </div>
        </div>
      )}

      {/* MAIN VIEW CONTENT (Primary Background: Paper White #F4F2ED) */}
      <main className="flex-grow bg-[#F4F2ED]">
        {/* ==================== 1. HOME VIEW ==================== */}
        {view === "home" && (
          <div className="max-w-[1400px] mx-auto px-5 sm:px-10 pb-20 bg-[#F4F2ED]">
            {/* Hero Banner: Pure image colors without background tint interference */}
            <section className="relative w-full h-[520px] sm:h-[600px] lg:h-[680px] overflow-hidden mt-3 sm:mt-6 border border-[#B7A28B]/40 isolate">
              <img
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2000&q=85"
                alt="Editorial fashion portrait in sculptural drapery"
                className="w-full h-full object-cover object-center"
              />
              {/* Subtle left/bottom vignette only behind text so the subject and image colors stay 100% natural */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(23,23,21,0.45) 0%, rgba(23,23,21,0.12) 45%, rgba(23,23,21,0) 75%), linear-gradient(0deg, rgba(23,23,21,0.38) 0%, rgba(23,23,21,0) 45%)",
                }}
              />

              <div className="absolute inset-0 p-6 sm:p-12 lg:p-16 flex flex-col justify-end">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
                  {/* Left Hero Copy */}
                  <div className="max-w-lg text-[#F4F2ED] space-y-4">
                    <h1 className="font-serif text-4xl sm:text-5xl lg:text-[62px] leading-[1.08] tracking-tight font-normal text-[#F4F2ED]">
                      Images with
                      <br />a point of view.
                    </h1>
                    <p className="text-[10px] sm:text-[11px] tracking-[0.26em] uppercase text-[#B7A28B] font-medium pt-1">
                      PHOTOGRAPHER &amp; FILM DIRECTOR
                    </p>
                    <p className="text-xs sm:text-sm text-[#F4F2ED]/85 leading-relaxed max-w-sm font-light">
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
                        className="inline-flex items-center space-x-3 text-[10px] tracking-[0.24em] uppercase text-[#F4F2ED] border-b border-[#B7A28B] pb-1.5 px-2 py-1 -ml-2 hover:bg-[#171715] hover:text-[#F4F2ED] transition-all group"
                      >
                        <span>EXPLORE SELECTED WORK</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#B7A28B] group-hover:text-[#F4F2ED] group-hover:translate-x-1 transition-all" />
                      </button>
                    </div>
                  </div>

                  {/* Right Hero Discipline List (Desktop) */}
                  <div className="hidden md:flex flex-col space-y-2 text-[10px] tracking-[0.24em] uppercase text-[#D8D5CD] border-l border-[#B7A28B] pl-6 py-1">
                    <button
                      onClick={() => navigateToCategory("photography", "fashion")}
                      className="text-left px-2 py-0.5 -ml-2 hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors"
                    >
                      FASHION &amp; EDITORIAL
                    </button>
                    <button
                      onClick={() =>
                        navigateToCategory("photography", "hospitality")
                      }
                      className="text-left px-2 py-0.5 -ml-2 hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors"
                    >
                      PRODUCT
                    </button>
                    <button
                      onClick={() =>
                        navigateToCategory("photography", "architecture")
                      }
                      className="text-left px-2 py-0.5 -ml-2 hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors"
                    >
                      ARCHITECTURE
                    </button>
                    <button
                      onClick={() => navigateToCategory("photography", "food")}
                      className="text-left px-2 py-0.5 -ml-2 hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors"
                    >
                      ADVERTISING
                    </button>
                    <button
                      onClick={() =>
                        navigateToCategory("photography", "documentary")
                      }
                      className="text-left px-2 py-0.5 -ml-2 hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors"
                    >
                      DOCUMENTARY
                    </button>
                    <button
                      onClick={() => navigateToCategory("films", "all")}
                      className="text-left px-2 py-0.5 -ml-2 hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors"
                    >
                      FILMS
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Mobile Discipline Strip below hero */}
            <div className="md:hidden flex flex-wrap gap-x-3 gap-y-2 py-4 border-b border-[#B7A28B]/40 text-[10px] tracking-[0.2em] uppercase text-[#8C8980]">
              <button
                onClick={() => navigateToCategory("photography", "fashion")}
                className="px-2 py-1 hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors"
              >
                FASHION &amp; EDITORIAL
              </button>
              <button
                onClick={() => navigateToCategory("photography", "hospitality")}
                className="px-2 py-1 hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors"
              >
                PRODUCT
              </button>
              <button
                onClick={() => navigateToCategory("photography", "architecture")}
                className="px-2 py-1 hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors"
              >
                ARCHITECTURE
              </button>
              <button
                onClick={() => navigateToCategory("photography", "food")}
                className="px-2 py-1 hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors"
              >
                ADVERTISING
              </button>
              <button
                onClick={() => navigateToCategory("photography", "documentary")}
                className="px-2 py-1 hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors"
              >
                DOCUMENTARY
              </button>
              <button
                onClick={() => navigateToCategory("films", "all")}
                className="px-2 py-1 hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors"
              >
                FILMS
              </button>
            </div>

            {/* SELECTED WORK STRIP
                - Headings: Graphite #373632
                - Section Card / Surface: Stone #D8D5CD
                - Subtle Accents / Details: Muted Taupe #B7A28B
                - Text / Icons / Secondary: Warm Grey #8C8980
                - Hover Background: Soft Black #171715 / Hover Text: Paper White #F4F2ED
            */}
            <section id="selected-work" className="pt-14 sm:pt-20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 pb-3 border-b border-[#B7A28B]/40">
                <div className="flex items-center space-x-6">
                  <h2 className="text-[11px] tracking-[0.24em] uppercase text-[#373632] font-medium">
                    SELECTED WORK
                  </h2>
                  <div className="hidden lg:flex items-center space-x-3 text-[9px] tracking-[0.22em] uppercase">
                    {[
                      { label: "ALL", val: "all" },
                      { label: "FASHION & EDITORIAL", val: "fashion" },
                      { label: "PRODUCT", val: "hospitality" },
                      { label: "ARCHITECTURE", val: "architecture" },
                      { label: "ADVERTISING", val: "food" },
                      { label: "DOCUMENTARY", val: "film-documentary" },
                    ].map((cat) => (
                      <button
                        key={cat.val}
                        onClick={() => setHomeCategoryFilter(cat.val)}
                        className={`px-2.5 py-1 transition-colors ${
                          homeCategoryFilter === cat.val
                            ? "bg-[#171715] text-[#F4F2ED] font-medium"
                            : "text-[#8C8980] hover:bg-[#171715] hover:text-[#F4F2ED]"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => navigateToCategory("photography", "all")}
                  className="inline-flex items-center space-x-2 text-[10px] tracking-[0.22em] uppercase text-[#8C8980] px-3 py-1.5 hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors group"
                >
                  <span>VIEW ALL</span>
                  <ArrowRight className="w-3 h-3 text-[#8C8980] group-hover:text-[#F4F2ED] group-hover:translate-x-0.5 transition-all" />
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
                      className="group cursor-pointer flex flex-col p-2.5 rounded-sm bg-[#D8D5CD] border border-[#B7A28B]/30 hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors duration-300"
                    >
                      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#D8D5CD] mb-3">
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          className="w-full h-full object-cover editorial-image-grade group-hover:scale-105"
                        />
                        {item.type === "film" && (
                          <div className="absolute inset-0 flex items-center justify-center bg-[#171715]/30 group-hover:bg-[#171715]/45 transition-colors">
                            <div className="w-9 h-9 rounded-full border border-[#F4F2ED]/80 flex items-center justify-center bg-[#171715]/50 backdrop-blur-[2px]">
                              <Play className="w-3.5 h-3.5 text-[#F4F2ED] fill-[#F4F2ED] ml-0.5" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-[10px] tracking-[0.18em] uppercase text-[#373632] font-medium group-hover:text-[#F4F2ED] transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-[9px] tracking-[0.15em] uppercase text-[#8C8980] group-hover:text-[#D8D5CD] mt-0.5 transition-colors">
                            {item.category} / {item.year}
                          </p>
                        </div>
                        <ArrowRight className="w-3 h-3 text-[#8C8980] group-hover:text-[#F4F2ED] sm:hidden mt-0.5" />
                      </div>
                    </div>
                  ))}
              </div>
            </section>

            {/* TWO-COLUMN PHOTOGRAPHY (Stone #D8D5CD) & FILMS (Soft Black #171715) FEATURE CARDS */}
            <section className="pt-16 sm:pt-24 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Photography Card — Stone (#D8D5CD) Section Card Surface */}
              <div className="border border-[#B7A28B]/40 p-6 sm:p-9 bg-[#D8D5CD] flex flex-col justify-between transition-colors">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="font-serif text-xl sm:text-2xl tracking-[0.08em] uppercase text-[#373632]">
                      PHOTOGRAPHY
                    </h2>
                    <p className="text-xs text-[#8C8980] mt-2 max-w-xs leading-relaxed">
                      Fashion, hospitality, architecture, food, product and
                      portraiture.
                    </p>
                  </div>
                  <button
                    onClick={() => navigateToCategory("photography", "all")}
                    className="inline-flex items-center space-x-1.5 text-[10px] tracking-[0.2em] uppercase text-[#373632] px-3 py-1.5 hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors group"
                  >
                    <span>VIEW ALL</span>
                    <ArrowRight className="w-3 h-3 text-[#8C8980] group-hover:text-[#F4F2ED]" />
                  </button>
                </div>

                <div
                  onClick={() => navigateToCategory("photography", "all")}
                  className="relative aspect-[16/9] w-full overflow-hidden cursor-pointer group border border-[#B7A28B]/30"
                >
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85"
                    alt="Photography showcase"
                    className="w-full h-full object-cover editorial-image-grade group-hover:scale-105"
                  />
                </div>
              </div>

              {/* Films Card — Soft Black (#171715) Film Section Surface */}
              <div className="border border-[#171715] p-6 sm:p-9 bg-[#171715] text-[#F4F2ED] flex flex-col justify-between transition-colors">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="font-serif text-xl sm:text-2xl tracking-[0.08em] uppercase text-[#F4F2ED]">
                      FILMS
                    </h2>
                    <p className="text-xs text-[#8C8980] mt-2 max-w-xs leading-relaxed">
                      Fashion films, advertising films, editorial documentaries
                      and visual narratives.
                    </p>
                  </div>
                  <button
                    onClick={() => navigateToCategory("films", "all")}
                    className="inline-flex items-center space-x-1.5 text-[10px] tracking-[0.2em] uppercase text-[#D8D5CD] px-3 py-1.5 border border-transparent hover:border-[#B7A28B] hover:text-[#F4F2ED] transition-colors group"
                  >
                    <span>VIEW ALL</span>
                    <ArrowRight className="w-3 h-3 text-[#B7A28B] group-hover:text-[#F4F2ED]" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                  <div
                    onClick={() => navigateToCategory("films", "all")}
                    className="sm:col-span-8 relative aspect-[16/9] w-full overflow-hidden cursor-pointer group border border-[#B7A28B]/30"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85"
                      alt="Films showcase"
                      className="w-full h-full object-cover editorial-image-grade group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[#171715]/30 flex items-center justify-center group-hover:bg-[#171715]/45 transition-colors">
                      <div className="w-11 h-11 rounded-full border border-[#F4F2ED]/85 flex items-center justify-center bg-[#171715]/45">
                        <Play className="w-4 h-4 text-[#F4F2ED] fill-[#F4F2ED] ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-4 space-y-2 border-l border-[#B7A28B]/40 pl-4">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#F4F2ED] font-medium">
                      ADVERTISING
                    </p>
                    <button
                      onClick={() => navigateToCategory("photography", "food")}
                      className="inline-flex items-center space-x-1.5 text-[11px] text-[#B7A28B] hover:text-[#F4F2ED] transition-colors group"
                    >
                      <span>View projects</span>
                      <ArrowRight className="w-3 h-3 text-[#B7A28B] group-hover:text-[#F4F2ED]" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* MORE ABOUT LINK */}
            <section className="pt-12 sm:pt-16">
              <div className="border-t border-[#B7A28B]/40 pt-8 flex justify-end">
                <button
                  onClick={() => setView("about")}
                  className="inline-flex items-center space-x-2 text-[10px] tracking-[0.22em] uppercase text-[#373632] border-b border-[#B7A28B] px-3 py-1.5 hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors group"
                >
                  <span>MORE ABOUT</span>
                  <ArrowRight className="w-3 h-3 text-[#8C8980] group-hover:text-[#F4F2ED] group-hover:translate-x-1 transition-all" />
                </button>
              </div>
            </section>
          </div>
        )}

        {/* ==================== 2. PHOTOGRAPHY VIEW ==================== */}
        {view === "photography" && (
          <div className="max-w-[1400px] mx-auto px-5 sm:px-10 pb-20 bg-[#F4F2ED]">
            {/* Photography Hero Banner */}
            <section className="relative w-full h-[280px] sm:h-[360px] lg:h-[400px] overflow-hidden mt-3 sm:mt-6 isolate">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=2000&q=85"
                alt="Photography Header"
                className="w-full h-full object-cover object-center"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(23,23,21,0.45) 0%, rgba(23,23,21,0.12) 50%, rgba(23,23,21,0) 80%)",
                }}
              />
              <div className="absolute inset-0 p-6 sm:p-12 lg:p-16 flex flex-col justify-end">
                <h1 className="font-serif text-3xl sm:text-5xl text-[#F4F2ED] font-normal mb-3">
                  Photography
                </h1>
                <p className="text-[10px] sm:text-[11px] tracking-[0.24em] uppercase text-[#D8D5CD]">
                  FASHION &amp; EDITORIAL &bull; PRODUCT &bull; ARCHITECTURE
                  &bull; ADVERTISING &bull; DOCUMENTARY
                </p>
              </div>
            </section>

            {/* Category Filter Bar */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-5 py-6 border-b border-[#B7A28B]/40 text-[10px] tracking-[0.22em] uppercase">
              {[
                { label: "ALL", value: "all" },
                { label: "FASHION & EDITORIAL", value: "fashion" },
                { label: "PRODUCT", value: "hospitality" },
                { label: "ARCHITECTURE", value: "architecture" },
                { label: "ADVERTISING", value: "food" },
                { label: "DOCUMENTARY", value: "documentary" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setPhotoFilter(tab.value)}
                  className={`px-3 py-1.5 transition-colors ${
                    photoFilter === tab.value
                      ? "bg-[#171715] text-[#F4F2ED] font-medium"
                      : "text-[#8C8980] hover:bg-[#171715] hover:text-[#F4F2ED]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Category Rows */}
            <div className="space-y-14 sm:space-y-16 pt-10">
              {PHOTOGRAPHY_SECTIONS.filter(
                (sec) => photoFilter === "all" || sec.slug === photoFilter
              ).map((section) => (
                <section key={section.slug}>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-[11px] tracking-[0.24em] uppercase text-[#373632] font-medium">
                      {section.title}
                    </h2>
                    <button
                      onClick={() => {
                        const firstProj = section.images[0]?.projectId;
                        if (firstProj) navigateToProject(firstProj);
                      }}
                      className="inline-flex items-center space-x-1.5 text-[10px] tracking-[0.18em] text-[#8C8980] px-3 py-1 hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors group"
                    >
                      <span>View projects</span>
                      <ArrowRight className="w-3 h-3 text-[#8C8980] group-hover:text-[#F4F2ED] group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                    {section.images.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => navigateToProject(img.projectId)}
                        className="group cursor-pointer relative aspect-[4/3] overflow-hidden"
                      >
                        <img
                          src={img.src}
                          alt={img.caption}
                          className="w-full h-full object-cover editorial-image-grade group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-[#171715]/0 group-hover:bg-[#171715]/45 transition-colors flex items-end p-4">
                          <span className="text-[10px] tracking-[0.2em] uppercase text-[#F4F2ED] opacity-0 group-hover:opacity-100 transition-opacity">
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

        {/* ==================== 3. FILMS VIEW (Film Section: Soft Black #171715) ==================== */}
        {view === "films" && (
          <div className="bg-[#171715] text-[#F4F2ED]">
            <div className="max-w-[1400px] mx-auto px-5 sm:px-10 pt-4 pb-20">
              {/* Films Hero Banner */}
              <section className="relative w-full h-[300px] sm:h-[380px] lg:h-[440px] overflow-hidden mt-2 sm:mt-4 border border-[#B7A28B]/30 isolate">
                <img
                  src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2000&q=85"
                  alt="Films Header"
                  className="w-full h-full object-cover object-center"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(23,23,21,0.52) 0%, rgba(23,23,21,0.15) 50%, rgba(23,23,21,0) 80%)",
                  }}
                />
                <div className="absolute inset-0 p-6 sm:p-12 lg:p-16 flex flex-col justify-end">
                  <h1 className="font-serif text-3xl sm:text-5xl text-[#F4F2ED] font-normal mb-3">
                    Films
                  </h1>
                  <p className="text-[10px] sm:text-[11px] tracking-[0.24em] uppercase text-[#B7A28B]">
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
                      className="group cursor-pointer p-3 -m-3 hover:bg-[#373632]/40 transition-colors"
                    >
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#171715] border border-[#B7A28B]/30 mb-3.5">
                        <img
                          src={cat.image}
                          alt={cat.title}
                          className="w-full h-full object-cover opacity-90 editorial-image-grade group-hover:scale-105 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-[#171715]/30 flex items-center justify-center group-hover:bg-[#171715]/45 transition-colors">
                          <div className="w-11 h-11 rounded-full border border-[#F4F2ED]/80 flex items-center justify-center bg-[#171715]/45 backdrop-blur-[2px] group-hover:scale-110 transition-transform">
                            <Play className="w-4 h-4 text-[#F4F2ED] fill-[#F4F2ED] ml-0.5" />
                          </div>
                        </div>
                      </div>
                      <h3 className="text-[10px] tracking-[0.2em] uppercase text-[#F4F2ED] font-medium">
                        {cat.title}
                      </h3>
                      <span className="inline-flex items-center space-x-1.5 text-[10px] text-[#8C8980] mt-1 group-hover:text-[#F4F2ED] transition-colors">
                        <span>View projects</span>
                        <ArrowRight className="w-3 h-3 text-[#B7A28B] group-hover:text-[#F4F2ED]" />
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Selected Motion Reel List */}
              <section className="pt-16 sm:pt-20 border-t border-[#B7A28B]/30 mt-14">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <h2 className="text-[11px] tracking-[0.24em] uppercase text-[#F4F2ED] font-medium">
                    FEATURED MOTION ARCHIVE
                  </h2>
                  <div className="flex flex-wrap gap-4 text-[10px] tracking-[0.2em] uppercase">
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
                            ? "text-[#F4F2ED] font-medium border-b border-[#B7A28B] pb-0.5"
                            : "text-[#8C8980] hover:text-[#F4F2ED]"
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
                      className="group cursor-pointer border border-[#B7A28B]/30 hover:border-[#B7A28B] p-4 sm:p-6 bg-[#171715] transition-colors"
                    >
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#171715] mb-4">
                        <img
                          src={film.coverImage}
                          alt={film.title}
                          className="w-full h-full object-cover editorial-image-grade group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-[#171715]/30 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full border border-[#F4F2ED]/80 flex items-center justify-center bg-[#171715]/45 group-hover:scale-110 transition-transform">
                            <Play className="w-4 h-4 text-[#F4F2ED] fill-[#F4F2ED] ml-0.5" />
                          </div>
                        </div>
                        {film.duration && (
                          <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-[#171715]/85 text-[#F4F2ED] text-[10px] tracking-widest">
                            {film.duration}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xs tracking-[0.2em] uppercase text-[#F4F2ED] font-medium">
                            {film.title}
                          </h3>
                          <p className="text-[10px] tracking-[0.18em] uppercase text-[#8C8980] mt-1">
                            {film.category} / {film.year}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#B7A28B] group-hover:text-[#F4F2ED] group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        {/* ==================== 4. PROJECT DETAIL VIEW ==================== */}
        {view === "project" && (
          <div className="max-w-[1400px] mx-auto px-5 sm:px-10 pt-6 pb-20 bg-[#F4F2ED]">
            {/* Back Link */}
            <button
              onClick={() =>
                setView(
                  currentProject.type === "film" ? "films" : "photography"
                )
              }
              className="inline-flex items-center space-x-2 text-[10px] tracking-[0.22em] uppercase text-[#8C8980] px-3 py-1.5 -ml-3 hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors mb-6 group"
            >
              <ArrowLeft className="w-3 h-3 text-[#8C8980] group-hover:text-[#F4F2ED]" />
              <span>
                {currentProject.type === "film"
                  ? "ALL FILMS"
                  : "BACK TO WORK"}
              </span>
            </button>

            {/* Project Title (Graphite #373632) & Subtitle (Warm Grey #8C8980) */}
            <div className="mb-8">
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#373632] font-normal">
                {currentProject.title}
              </h1>
              <p className="text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-[#8C8980] mt-2">
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
                  className="relative aspect-[16/11] w-full overflow-hidden cursor-pointer group"
                >
                  <img
                    src={currentProject.coverImage}
                    alt={currentProject.title}
                    className="w-full h-full object-cover editorial-image-grade group-hover:scale-[1.02]"
                  />
                  {currentProject.type === "film" ? (
                    <div className="absolute inset-0 bg-[#171715]/30 flex items-center justify-center group-hover:bg-[#171715]/45 transition-colors">
                      <div className="w-16 h-16 rounded-full border border-[#F4F2ED] flex items-center justify-center bg-[#171715]/45 backdrop-blur-sm group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 text-[#F4F2ED] fill-[#F4F2ED] ml-1" />
                      </div>
                    </div>
                  ) : (
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-[#171715]/80 text-[#F4F2ED] p-2">
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
                      className="aspect-square overflow-hidden cursor-pointer group"
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

              {/* Right 4 Columns: Editorial Notes (Warm Grey #8C8980), Headings (Graphite #373632), Accents (Muted Taupe #B7A28B) */}
              <div className="lg:col-span-4 flex flex-col justify-between space-y-8">
                <div className="space-y-6">
                  <p className="text-xs sm:text-sm text-[#8C8980] leading-relaxed font-normal">
                    {currentProject.description}
                  </p>

                  <div className="border-t border-[#B7A28B]/40 pt-4 space-y-4">
                    <div>
                      <p className="text-[9px] tracking-[0.22em] uppercase text-[#373632] font-medium">
                        ROLE
                      </p>
                      <p className="text-xs text-[#8C8980] mt-1">
                        {currentProject.role}
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] tracking-[0.22em] uppercase text-[#373632] font-medium">
                        DISCIPLINE
                      </p>
                      <p className="text-xs text-[#8C8980] mt-1">
                        {currentProject.discipline}
                      </p>
                    </div>

                    {/* Film specific credits */}
                    {currentProject.type === "film" && (
                      <div className="pt-3 border-t border-[#B7A28B]/40 space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-[#8C8980]">Director</span>
                          <span className="text-[#373632]">
                            {currentProject.director || "Ajnas"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#8C8980]">Cinematography</span>
                          <span className="text-[#373632]">
                            {currentProject.cinematography || "Ajnas"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#8C8980]">Editor</span>
                          <span className="text-[#373632]">
                            {currentProject.editor || "Ajnas"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#8C8980]">Duration</span>
                          <span className="text-[#373632]">
                            {currentProject.duration || "02:58"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column 2x2 Thumbnail Gallery */}
                  <div className="pt-2">
                    <p className="text-[9px] tracking-[0.22em] uppercase text-[#373632] font-medium mb-3">
                      GALLERY
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {currentProject.gallery.slice(0, 4).map((gImg, i) => (
                        <div
                          key={i}
                          onClick={() => setLightboxImage(gImg)}
                          className="aspect-[4/3] overflow-hidden cursor-pointer group"
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
            <div className="mt-16 pt-6 border-t border-[#B7A28B]/40 flex items-center justify-between text-[10px] tracking-[0.22em] uppercase text-[#8C8980]">
              <button
                onClick={() => navigateToProject(prevProject.id)}
                className="inline-flex items-center space-x-2 px-3 py-1.5 -ml-3 hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#8C8980] group-hover:text-[#F4F2ED] group-hover:-translate-x-1 transition-all" />
                <span>PREVIOUS PROJECT</span>
              </button>

              <button
                onClick={() => navigateToProject(nextProject.id)}
                className="inline-flex items-center space-x-2 px-3 py-1.5 -mr-3 hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors group"
              >
                <span>NEXT PROJECT</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#8C8980] group-hover:text-[#F4F2ED] group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>
        )}

        {/* ==================== 5. ABOUT VIEW ==================== */}
        {view === "about" && (
          <div className="max-w-[1200px] mx-auto px-5 sm:px-10 pt-8 sm:pt-14 pb-24 bg-[#F4F2ED]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              {/* Left Column Portrait + Availability Note */}
              <div className="lg:col-span-5 space-y-6">
                <div className="aspect-[4/5] w-full overflow-hidden bg-white p-2 border border-white">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85"
                    alt="Ajnas — Photographer and Film Director"
                    className="w-full h-full object-cover editorial-image-grade"
                  />
                </div>
                <p className="text-[11px] text-[#8C8980] leading-relaxed">
                  Available for selected commissions
                  <br />
                  and creative collaborations worldwide.
                </p>
              </div>

              {/* Right Column Editorial Bio & Disciplines */}
              <div className="lg:col-span-7 space-y-7">
                <h1 className="font-serif text-3xl sm:text-4xl text-[#373632] font-normal">
                  About
                </h1>

                <p className="font-serif text-xl sm:text-2xl leading-[1.4] text-[#373632] font-normal">
                  I am an independent image-maker and film director working
                  across fashion, still life, architecture, hospitality and
                  moving image.
                </p>

                <p className="text-xs sm:text-sm text-[#8C8980] leading-relaxed max-w-lg">
                  My practice explores the relationship between form, atmosphere
                  and storytelling, bringing an editorial sensibility to both
                  still and moving images. Working closely with designers,
                  architects, hospitality brands and publications across
                  Bangalore, Calicut and internationally.
                </p>

                <div className="pt-5 border-t border-[#B7A28B]/40">
                  <h2 className="text-[10px] tracking-[0.24em] uppercase text-[#373632] font-medium mb-4">
                    CREATIVE DISCIPLINES
                  </h2>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-[#8C8980] font-normal">
                    <li>Fashion Editorial</li>
                    <li>Product &amp; Campaign Imagery</li>
                    <li>Architecture &amp; Spaces</li>
                    <li>Advertising</li>
                    <li>Documentary</li>
                    <li>Fashion Films</li>
                    <li>Advertising Films</li>
                    <li>Editorial Documentaries</li>
                  </ul>
                </div>

                {/* Signature & CTA Button (Hover Background: Soft Black #171715, Hover Text: Paper White #F4F2ED) */}
                <div className="pt-6 flex flex-wrap items-center justify-between gap-6 border-t border-[#B7A28B]/40">
                  <div>
                    <p className="font-signature text-3xl text-[#373632] italic">
                      Ajnas
                    </p>
                    <p className="text-[9px] tracking-[0.24em] uppercase text-[#8C8980] mt-1">
                      PHOTOGRAPHER &amp; FILM DIRECTOR
                    </p>
                  </div>

                  <button
                    onClick={() => setView("contact")}
                    className="px-6 py-3 bg-[#373632] text-[#F4F2ED] text-[10px] tracking-[0.22em] uppercase hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors inline-flex items-center space-x-2"
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
          <div className="max-w-[960px] mx-auto px-5 sm:px-10 pt-8 sm:pt-14 pb-24 bg-[#F4F2ED]">
            <div className="mb-10">
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#373632] font-normal">
                Let&apos;s work together.
              </h1>
              <p className="text-xs sm:text-sm text-[#8C8980] mt-2.5">
                For commissions, collaborations and project enquiries.
              </p>
            </div>

            {formSubmitted ? (
              <div className="border border-[#B7A28B] p-8 sm:p-12 bg-[#D8D5CD] space-y-4">
                <div className="flex items-center space-x-3 text-[#373632]">
                  <CheckCircle2 className="w-6 h-6 text-[#B7A28B]" />
                  <h2 className="font-serif text-2xl text-[#373632]">
                    Enquiry Received
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-[#8C8980] leading-relaxed max-w-lg">
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
                  className="text-[10px] tracking-[0.22em] uppercase text-[#373632] border-b border-[#B7A28B] px-3 py-1.5 hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors"
                >
                  SEND ANOTHER MESSAGE &rarr;
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] tracking-[0.18em] uppercase text-[#8C8980] mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-[#D8D5CD]/45 border border-[#B7A28B]/50 px-3.5 py-2.5 text-xs text-[#373632] focus:outline-none focus:border-[#373632] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.18em] uppercase text-[#8C8980] mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-[#D8D5CD]/45 border border-[#B7A28B]/50 px-3.5 py-2.5 text-xs text-[#373632] focus:outline-none focus:border-[#373632] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] tracking-[0.18em] uppercase text-[#8C8980] mb-2">
                      Company / Publication
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      className="w-full bg-[#D8D5CD]/45 border border-[#B7A28B]/50 px-3.5 py-2.5 text-xs text-[#373632] focus:outline-none focus:border-[#373632] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.18em] uppercase text-[#8C8980] mb-2">
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
                      className="w-full bg-[#D8D5CD]/45 border border-[#B7A28B]/50 px-3.5 py-2.5 text-xs text-[#373632] focus:outline-none focus:border-[#373632] transition-colors"
                    >
                      <option value="">Select an option</option>
                      <option value="Fashion Editorial">
                        Fashion Editorial
                      </option>
                      <option value="Product">Product</option>
                      <option value="Architecture">Architecture</option>
                      <option value="Advertising">Advertising</option>
                      <option value="Fashion / Campaign Film">
                        Fashion / Campaign Film
                      </option>
                      <option value="Documentary">Documentary</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] tracking-[0.18em] uppercase text-[#8C8980] mb-2">
                    Project Brief *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.brief}
                    onChange={(e) =>
                      setFormData({ ...formData, brief: e.target.value })
                    }
                    className="w-full bg-[#D8D5CD]/45 border border-[#B7A28B]/50 px-3.5 py-2.5 text-xs text-[#373632] focus:outline-none focus:border-[#373632] transition-colors resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] tracking-[0.18em] uppercase text-[#8C8980] mb-2">
                      Budget Range (optional)
                    </label>
                    <select
                      value={formData.budget}
                      onChange={(e) =>
                        setFormData({ ...formData, budget: e.target.value })
                      }
                      className="w-full bg-[#D8D5CD]/45 border border-[#B7A28B]/50 px-3.5 py-2.5 text-xs text-[#373632] focus:outline-none focus:border-[#373632] transition-colors"
                    >
                      <option value="">Select an option</option>
                      <option value="Under $2,500">Under $2,500</option>
                      <option value="$2,500 – $5,000">$2,500 – $5,000</option>
                      <option value="$5,000 – $10,000">$5,000 – $10,000</option>
                      <option value="$10,000+">$10,000+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.18em] uppercase text-[#8C8980] mb-2">
                      Timeline (optional)
                    </label>
                    <select
                      value={formData.timeline}
                      onChange={(e) =>
                        setFormData({ ...formData, timeline: e.target.value })
                      }
                      className="w-full bg-[#D8D5CD]/45 border border-[#B7A28B]/50 px-3.5 py-2.5 text-xs text-[#373632] focus:outline-none focus:border-[#373632] transition-colors"
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
                  {/* Button uses Graphite #373632 with Soft Black #171715 hover background & Paper White #F4F2ED hover text */}
                  <button
                    type="submit"
                    className="px-7 py-3 bg-[#373632] text-[#F4F2ED] text-[10px] tracking-[0.24em] uppercase hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors inline-flex items-center space-x-2.5"
                  >
                    <span>SEND ENQUIRY</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            {/* Contact Bottom Info Bar */}
            <div className="mt-16 pt-8 border-t border-[#B7A28B]/40 flex flex-col sm:flex-row sm:items-end justify-between gap-6 text-xs text-[#8C8980]">
              <div className="space-y-1">
                <p className="text-[#373632] font-medium">Based in India.</p>
                <p>Available for international projects.</p>
                <p className="text-[10px] tracking-[0.22em] uppercase pt-2 text-[#8C8980]">
                  BANGALORE / CALICUT
                </p>
              </div>

              <div className="space-y-1.5 sm:text-right">
                <a
                  href="mailto:hello@ajnas.studio"
                  className="inline-block text-[#373632] px-2 py-0.5 hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors"
                >
                  hello@ajnas.studio
                </a>
                <div className="flex sm:justify-end space-x-3 text-[11px] text-[#8C8980]">
                  <a
                    href="#instagram"
                    onClick={(e) => e.preventDefault()}
                    className="px-2 py-0.5 hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors"
                  >
                    Instagram &rarr;
                  </a>
                  <a
                    href="#vimeo"
                    onClick={(e) => e.preventDefault()}
                    className="px-2 py-0.5 hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors"
                  >
                    Vimeo &rarr;
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER (Primary Background: Paper White #F4F2ED, Accents: Muted Taupe #B7A28B, Nav: Graphite #373632, Secondary: Warm Grey #8C8980) */}
      <footer className="border-t border-[#B7A28B]/40 bg-[#F4F2ED]">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setView("home")}
              className="font-serif text-lg tracking-[0.22em] uppercase text-[#373632]"
            >
              AJNAS
            </button>
            <span className="text-[9px] tracking-[0.22em] uppercase text-[#8C8980]">
              PHOTOGRAPHER &amp; FILM DIRECTOR
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-3 text-[10px] tracking-[0.2em] uppercase text-[#373632]">
            <button
              onClick={() => setView("home")}
              className="px-2.5 py-1 hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors"
            >
              WORK
            </button>
            <button
              onClick={() => navigateToCategory("photography", "all")}
              className="px-2.5 py-1 hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors"
            >
              PHOTOGRAPHY
            </button>
            <button
              onClick={() => navigateToCategory("films", "all")}
              className="px-2.5 py-1 hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors"
            >
              FILMS
            </button>
            <button
              onClick={() => setView("about")}
              className="px-2.5 py-1 hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors"
            >
              ABOUT
            </button>
            <button
              onClick={() => setView("contact")}
              className="px-2.5 py-1 hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors"
            >
              CONTACT
            </button>
          </div>

          <div className="flex items-center space-x-4 text-[10px] tracking-[0.18em] text-[#8C8980]">
            <a
              href="#instagram"
              onClick={(e) => e.preventDefault()}
              aria-label="Instagram"
              className="p-1.5 text-[#8C8980] hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a
              href="#vimeo"
              onClick={(e) => e.preventDefault()}
              aria-label="Vimeo"
              className="p-1.5 text-[#8C8980] hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors"
            >
              <Film className="w-3.5 h-3.5" />
            </a>
            <a
              href="mailto:hello@ajnas.studio"
              aria-label="Email"
              className="p-1.5 text-[#8C8980] hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
            </a>
            <span>&copy; 2025 AJNAS</span>
          </div>
        </div>

        {/* Depth / Overlay Strip (Soft Black #171715 + Muted Taupe #B7A28B border) */}
        <div className="dark-stone-banner border-t border-[#B7A28B]/40 py-3.5 px-5 sm:px-10">
          <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[9px] tracking-[0.26em] uppercase text-[#B7A28B]">
            <span>AJNAS &mdash; PHOTOGRAPHER &amp; FILM DIRECTOR</span>
            <span className="text-[#F4F2ED]/80">
              FASHION &amp; EDITORIAL / PRODUCT / ARCHITECTURE / ADVERTISING /
              DOCUMENTARY
            </span>
          </div>
        </div>
      </footer>

      {/* LIGHTBOX FOR HIGH-RES STILL PHOTOGRAPHY (Soft Black #171715) */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-[#171715]/95 flex items-center justify-center p-4 sm:p-10 cursor-zoom-out"
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 text-[#8C8980] hover:text-[#F4F2ED] p-2"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxImage}
            alt="Full resolution view"
            className="max-h-[88vh] max-w-[92vw] object-contain"
          />
        </div>
      )}

      {/* FILM SCREENING MODAL (Soft Black #171715) */}
      {activeVideoModal && (
        <div
          onClick={() => setActiveVideoModal(null)}
          className="fixed inset-0 z-50 bg-[#171715]/95 flex items-center justify-center p-4 sm:p-10"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full bg-[#171715] border border-[#B7A28B]/40 p-4 sm:p-6 space-y-4"
          >
            <div className="flex items-center justify-between text-[#F4F2ED]">
              <div>
                <h3 className="font-serif text-xl">{activeVideoModal.title}</h3>
                <p className="text-[10px] tracking-[0.22em] uppercase text-[#B7A28B]">
                  {activeVideoModal.category} &bull;{" "}
                  {activeVideoModal.duration || "02:58"}
                </p>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="text-[#8C8980] hover:text-[#F4F2ED] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-video w-full bg-[#373632] overflow-hidden flex items-center justify-center">
              <img
                src={activeVideoModal.coverImage}
                alt={activeVideoModal.title}
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-14 h-14 rounded-full border border-[#F4F2ED] flex items-center justify-center bg-[#171715]/60">
                  <Play className="w-5 h-5 text-[#F4F2ED] fill-[#F4F2ED] ml-0.5" />
                </div>
                <p className="text-xs tracking-[0.2em] uppercase text-[#F4F2ED]">
                  Screening Preview — {activeVideoModal.title}
                </p>
                <p className="text-xs text-[#D8D5CD] max-w-md">
                  Replace with your Vimeo or MP4 embed URL in{" "}
                  <code className="text-[#B7A28B]">src/data/portfolio.ts</code>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
