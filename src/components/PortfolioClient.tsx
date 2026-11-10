"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  DEFAULT_SITE_CONTENT,
  SiteContent,
  Project,
  CategorySlug,
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
  Edit3,
  Upload,
  Trash2,
  Plus,
  Save,
  RotateCcw,
  Video,
  Check,
  Lock,
  Link2,
} from "lucide-react";

type ViewState =
  | "home"
  | "photography"
  | "films"
  | "project"
  | "about"
  | "contact";

const STORAGE_KEY = "ajnas_portfolio_site_content_v1";
const IDB_NAME = "ajnas_portfolio_db";
const IDB_STORE = "site_content";
const IDB_KEY = "current";

type StoredSiteContent = SiteContent & { updatedAt?: number };

function openContentDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      reject(new Error("IndexedDB unavailable"));
      return;
    }
    const req = window.indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveToIndexedDB(data: StoredSiteContent): Promise<void> {
  try {
    const db = await openContentDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, "readwrite");
      tx.objectStore(IDB_STORE).put(data, IDB_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Ignore IDB errors
  }
}

async function loadFromIndexedDB(): Promise<StoredSiteContent | null> {
  try {
    const db = await openContentDB();
    return await new Promise<StoredSiteContent | null>((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, "readonly");
      const req = tx.objectStore(IDB_STORE).get(IDB_KEY);
      req.onsuccess = () => resolve((req.result as StoredSiteContent) || null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

async function clearIndexedDB(): Promise<void> {
  try {
    const db = await openContentDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, "readwrite");
      tx.objectStore(IDB_STORE).delete(IDB_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Ignore
  }
}

function parseVideoEmbed(
  url?: string
): { kind: "iframe" | "native"; src: string } | null {
  if (!url) return null;
  const trimmed = url.trim();

  // YouTube
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i
  );
  if (ytMatch && ytMatch[1]) {
    return {
      kind: "iframe",
      src: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`,
    };
  }

  // Vimeo
  const vimeoMatch = trimmed.match(
    /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/i
  );
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      kind: "iframe",
      src: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
    };
  }

  // Native video asset
  if (
    /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(trimmed) ||
    trimmed.startsWith("data:video/")
  ) {
    return { kind: "native", src: trimmed };
  }

  return null;
}

function isVideoAsset(url?: string): boolean {
  return Boolean(parseVideoEmbed(url));
}

async function compressImageFile(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") {
    return file;
  }
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const maxDim = 2200;
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob && blob.size < file.size) {
            const safeName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
            resolve(new File([blob], safeName, { type: "image/jpeg" }));
          } else {
            resolve(file);
          }
        },
        "image/jpeg",
        0.86
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };
    img.src = objectUrl;
  });
}

/**
 * Inline Editable Text Component
 */
function EditableText({
  value,
  onChange,
  editMode,
  as: Component = "span",
  className = "",
  multiline = false,
}: {
  value: string;
  onChange: (newVal: string) => void;
  editMode: boolean;
  as?: any;
  className?: string;
  multiline?: boolean;
}) {
  if (!editMode) {
    return <Component className={className}>{value}</Component>;
  }

  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        rows={3}
        className={`${className} w-full bg-[#F4F2ED]/95 text-[#373632] border border-dashed border-[#B7A28B] px-2 py-1 rounded-sm focus:outline-none focus:border-[#171715]`}
      />
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      className={`${className} bg-[#F4F2ED]/95 text-[#373632] border border-dashed border-[#B7A28B] px-1.5 py-0.5 rounded-sm focus:outline-none focus:border-[#171715] max-w-full`}
    />
  );
}

export default function PortfolioClient({
  initialContent = DEFAULT_SITE_CONTENT,
  hasServerSaved = false,
}: {
  initialContent?: StoredSiteContent;
  hasServerSaved?: boolean;
}) {
  const [content, setContent] = useState<StoredSiteContent>(initialContent);
  const [contentHydrated, setContentHydrated] =
    useState<boolean>(hasServerSaved);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(false);
  const [showAdminLoginModal, setShowAdminLoginModal] =
    useState<boolean>(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>("");
  const [adminAuthError, setAdminAuthError] = useState<string | null>(null);
  const [hasGitHubToken, setHasGitHubToken] = useState<boolean>(false);

  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "local-only"
  >("idle");
  const [uploadingLabel, setUploadingLabel] = useState<string | null>(null);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

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

  // Hidden file input ref for quick image/video uploads
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pendingUploadCallback = useRef<
    ((url: string, isVideo: boolean) => void) | null
  >(null);

  // New project form state
  const [newProjectForm, setNewProjectForm] = useState<{
    title: string;
    category: string;
    categorySlug: CategorySlug;
    type: "photography" | "film";
    year: string;
    role: string;
    discipline: string;
    description: string;
    coverImage: string;
    videoUrl: string;
  }>({
    title: "",
    category: "FASHION EDITORIAL",
    categorySlug: "fashion",
    type: "photography",
    year: "2025",
    role: "Photography & Art Direction",
    discipline: "Fashion & Editorial",
    description: "",
    coverImage:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85",
    videoUrl: "",
  });

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

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check Admin Session & Keyboard/URL Unlock Triggers
  useEffect(() => {
    async function checkAuthAndParams() {
      let authed = false;
      try {
        const res = await fetch("/api/auth", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          authed = Boolean(data.authenticated);
          setIsAdminUnlocked(authed);
          setHasGitHubToken(Boolean(data.hasGitHubToken));
        }
      } catch {
        // Ignore
      }

      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        if (params.has("admin") || params.has("edit")) {
          if (authed) {
            setEditMode(true);
          } else {
            setShowAdminLoginModal(true);
          }
        }
      }
    }
    checkAuthAndParams();

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "e") {
        e.preventDefault();
        setIsAdminUnlocked((alreadyAuthed) => {
          if (alreadyAuthed) {
            setEditMode((prev) => !prev);
          } else {
            setShowAdminLoginModal(true);
          }
          return alreadyAuthed;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminAuthError(null);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: adminPasswordInput }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setIsAdminUnlocked(true);
        setHasGitHubToken(Boolean(data.hasGitHubToken));
        setEditMode(true);
        setShowAdminLoginModal(false);
        setAdminPasswordInput("");
      } else {
        setAdminAuthError(data.error || "Incorrect admin password.");
      }
    } catch {
      setAdminAuthError("Could not verify password. Please try again.");
    }
  };

  const handleAdminLogout = async () => {
    await persistContent(content, true);
    try {
      await fetch("/api/auth", { method: "DELETE" });
    } catch {
      // Ignore
    }
    setEditMode(false);
    setIsAdminUnlocked(false);
  };

  const promptVideoUrl = (onSet: (url: string) => void, currentUrl?: string) => {
    const input = window.prompt(
      "Paste a Vimeo URL, YouTube URL, or direct MP4/WebM video link:",
      currentUrl || ""
    );
    if (input !== null && input.trim()) {
      onSet(input.trim());
    }
  };

  // Load saved site content from IndexedDB, localStorage, or API on mount
  useEffect(() => {
    async function loadContent() {
      let browserSaved: StoredSiteContent | null = null;
      let serverSaved: StoredSiteContent | null = hasServerSaved
        ? initialContent
        : null;

      // 1. Synchronous localStorage check first (0ms)
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached) as StoredSiteContent;
          if (parsed && Array.isArray(parsed.projects)) {
            browserSaved = parsed;
          }
        }
      } catch {
        // Ignore localStorage read errors
      }

      // 2. Fast local IndexedDB check (~5ms, supports large images & videos)
      try {
        const idbData = await loadFromIndexedDB();
        if (
          idbData &&
          Array.isArray(idbData.projects) &&
          (!browserSaved ||
            (idbData.updatedAt || 0) >= (browserSaved.updatedAt || 0))
        ) {
          browserSaved = idbData;
        }
      } catch {
        // Ignore IDB errors
      }

      // Apply local or server-initial content immediately before any network wait
      if (serverSaved && browserSaved) {
        const newest =
          (browserSaved.updatedAt || 0) > (serverSaved.updatedAt || 0)
            ? browserSaved
            : serverSaved;
        setContent(newest);
      } else if (browserSaved) {
        setContent(browserSaved);
      } else if (serverSaved) {
        setContent(serverSaved);
      }
      setContentHydrated(true);

      // 3. Also verify with /api/content in case another device pushed a newer update
      if (!hasServerSaved) {
        try {
          const res = await fetch("/api/content", { cache: "no-store" });
          if (res.ok) {
            const data = await res.json();
            if (
              data &&
              data.hasSavedContent &&
              data.content &&
              Array.isArray(data.content.projects)
            ) {
              const latestServer = data.content as StoredSiteContent;
              const currentBestTime = Math.max(
                serverSaved?.updatedAt || 0,
                browserSaved?.updatedAt || 0
              );
              if ((latestServer.updatedAt || 0) >= currentBestTime) {
                setContent(latestServer);
                await saveToIndexedDB(latestServer);
              }
            }
          }
        } catch {
          // Offline or serverless fallback
        }
      }
    }
    loadContent();
  }, [hasServerSaved, initialContent]);

  // Persist helper (saves immediately to IndexedDB + localStorage, and syncs to API/GitHub)
  const persistContent = async (
    updated: SiteContent,
    immediateServerSync: boolean = false
  ) => {
    const payload: StoredSiteContent = {
      ...updated,
      updatedAt: Date.now(),
    };

    setContent(payload);
    setSaveStatus("saving");

    // 1. Save to IndexedDB (handles large images & videos without 5MB limit)
    saveToIndexedDB(payload);

    // 2. Save to localStorage (fast synchronous backup when under 5MB)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Exceeded 5MB localStorage quota; IndexedDB already stores the full payload
    }

    // 3. Sync to server/GitHub file (/api/content), debounced during rapid typing
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    const syncToServer = async () => {
      try {
        const res = await fetch("/api/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.savedToGitHub || data.savedToLocal) {
            setSaveStatus("saved");
          } else {
            setSaveStatus("local-only");
          }
        } else {
          setSaveStatus("local-only");
        }
      } catch {
        setSaveStatus("local-only");
      }
      setTimeout(() => setSaveStatus("idle"), 2500);
    };

    if (immediateServerSync) {
      await syncToServer();
    } else {
      saveTimerRef.current = setTimeout(syncToServer, 300);
    }
  };

  // Trigger file picker for uploading an image or video
  const triggerFileUpload = (
    onUploaded: (url: string, isVideo: boolean) => void
  ) => {
    pendingUploadCallback.current = onUploaded;
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile || !pendingUploadCallback.current) return;

    const callback = pendingUploadCallback.current;
    setUploadingLabel(rawFile.name);

    // Compress large images client-side so they upload fast and never exceed serverless limits
    const file = await compressImageFile(rawFile);

    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.ok && data.url) {
          callback(data.url, Boolean(data.isVideo));
          setUploadingLabel(null);
          return;
        }
      }
    } catch {
      // Fallback to DataURL if offline/static
    }

    // Fallback: convert compressed image/video to base64 DataURL (which also syncs inside site-content.json!)
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        callback(reader.result, file.type.startsWith("video/"));
      }
      setUploadingLabel(null);
    };
    reader.readAsDataURL(file);
  };

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

  const projects = content.projects;
  const currentProject =
    projects.find((p) => p.id === activeProjectId) ||
    projects[0] ||
    DEFAULT_SITE_CONTENT.projects[0];
  const currentProjectIndex = Math.max(
    0,
    projects.findIndex((p) => p.id === currentProject.id)
  );
  const prevProject =
    projects[(currentProjectIndex - 1 + projects.length) % projects.length] ||
    currentProject;
  const nextProject =
    projects[(currentProjectIndex + 1) % projects.length] || currentProject;

  const updateCurrentProject = (patch: Partial<Project>) => {
    const nextProjects = content.projects.map((p) =>
      p.id === currentProject.id ? { ...p, ...patch } : p
    );
    persistContent({ ...content, projects: nextProjects });
  };

  const handleDeleteProject = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextProjects = content.projects.filter((p) => p.id !== projectId);
    persistContent({ ...content, projects: nextProjects });
    if (activeProjectId === projectId && nextProjects.length > 0) {
      setActiveProjectId(nextProjects[0].id);
    }
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectForm.title.trim()) return;
    const id =
      newProjectForm.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      Date.now().toString().slice(-4);

    const created: Project = {
      id,
      title: newProjectForm.title,
      category: newProjectForm.category,
      categorySlug: newProjectForm.categorySlug,
      type: newProjectForm.type,
      year: newProjectForm.year,
      role: newProjectForm.role,
      discipline: newProjectForm.discipline,
      description:
        newProjectForm.description ||
        "Click to edit this project description in Edit Mode.",
      coverImage: newProjectForm.coverImage,
      videoUrl: newProjectForm.videoUrl || undefined,
      gallery: [newProjectForm.coverImage],
      featured: true,
      director: content.brandName,
      cinematography: content.brandName,
      editor: content.brandName,
      duration: "02:30",
    };

    const nextProjects = [created, ...content.projects];
    persistContent({ ...content, projects: nextProjects });
    setShowAddProjectModal(false);
    setActiveProjectId(created.id);
    setView("project");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div
      style={{ backgroundColor: "#F4F2ED", color: "#8C8980" }}
      className="min-h-screen flex flex-col bg-[#F4F2ED] text-[#8C8980] editorial-paper-surface relative"
    >
      {/* Hidden Global File Input for Image & Video Uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Subtle Film Grain Overlay */}
      <div className="film-grain-overlay" aria-hidden="true" />

      {/* FLOATING STUDIO EDITOR BAR (Hidden from normal visitors; shown only when Admin is unlocked) */}
      {isAdminUnlocked && (
        <div className="fixed bottom-5 right-5 z-50 flex flex-wrap items-center gap-2 bg-[#171715] text-[#F4F2ED] px-4 py-2.5 shadow-2xl border border-[#B7A28B]/50 rounded-sm">
          <button
            onClick={() => {
              if (editMode) {
                persistContent(content, true);
              }
              setEditMode(!editMode);
            }}
            className={`inline-flex items-center space-x-2 text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 transition-colors ${
              editMode
                ? "bg-[#B7A28B] text-[#171715] font-medium"
                : "bg-[#373632] text-[#F4F2ED] hover:bg-[#B7A28B] hover:text-[#171715]"
            }`}
          >
            {editMode ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>DONE EDITING</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5" />
                <span>EDIT WEBSITE</span>
              </>
            )}
          </button>

          {editMode && (
            <>
              <button
                onClick={() => setShowAddProjectModal(true)}
                className="inline-flex items-center space-x-1.5 text-[10px] tracking-[0.18em] uppercase px-3 py-1.5 bg-[#373632] text-[#F4F2ED] hover:bg-[#B7A28B] hover:text-[#171715] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>NEW PROJECT</span>
              </button>

              <button
                onClick={() => persistContent(content, true)}
                className="inline-flex items-center space-x-1.5 text-[10px] tracking-[0.18em] uppercase px-3 py-1.5 bg-[#373632] text-[#F4F2ED] hover:bg-[#B7A28B] hover:text-[#171715] transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>
                  {saveStatus === "saving"
                    ? "SAVING..."
                    : saveStatus === "saved"
                    ? "SAVED TO CLOUD"
                    : saveStatus === "local-only"
                    ? "SAVED IN BROWSER"
                    : "SAVE"}
                </span>
              </button>

              <button
                onClick={async () => {
                  if (
                    window.confirm(
                      "Reset all website text, images, and projects back to the original defaults?"
                    )
                  ) {
                    localStorage.removeItem(STORAGE_KEY);
                    await clearIndexedDB();
                    try {
                      await fetch("/api/content", { method: "DELETE" });
                    } catch {
                      // Ignore
                    }
                    setContent(DEFAULT_SITE_CONTENT);
                    setSaveStatus("saved");
                    setTimeout(() => setSaveStatus("idle"), 2000);
                  }
                }}
                title="Reset to default content"
                className="inline-flex items-center space-x-1 text-[10px] tracking-[0.18em] uppercase px-2.5 py-1.5 text-[#D8D5CD] hover:text-[#F4F2ED] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">RESET</span>
              </button>
            </>
          )}

          <button
            onClick={handleAdminLogout}
            title="Lock editor and hide toolbar"
            className="inline-flex items-center space-x-1 text-[10px] tracking-[0.18em] uppercase px-2.5 py-1.5 text-[#8C8980] hover:text-[#F4F2ED] transition-colors border-l border-[#B7A28B]/30 pl-3"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">LOCK</span>
          </button>

          {uploadingLabel && (
            <span className="text-[10px] tracking-wider text-[#B7A28B] pl-2">
              Uploading {uploadingLabel}...
            </span>
          )}
        </div>
      )}

      {/* EDIT MODE HELPER BANNER */}
      {editMode && (
        <div className="bg-[#171715] text-[#F4F2ED] text-[10px] tracking-[0.2em] uppercase py-2 px-5 text-center border-b border-[#B7A28B]/40">
          EDIT MODE ACTIVE — Click any text to edit in-place, or use the{" "}
          <span className="text-[#B7A28B]">
            Upload / Video Link / Remove / + Add
          </span>{" "}
          buttons on any section.
          {!hasGitHubToken && saveStatus === "local-only" && (
            <span className="block text-[9px] text-[#B7A28B] mt-1">
              Note: Add GITHUB_TOKEN in your hosting environment variables to
              sync edits across all computers &amp; phones.
            </span>
          )}
        </div>
      )}

      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-[#F4F2ED]/95 backdrop-blur-sm border-b border-[#B7A28B]/40 transition-colors">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10 h-16 sm:h-20 flex items-center justify-between">
          <div
            onClick={() => setView("home")}
            className="font-serif text-xl sm:text-2xl tracking-[0.22em] text-[#373632] hover:opacity-75 transition-opacity uppercase cursor-pointer"
          >
            <EditableText
              value={content.brandName}
              editMode={editMode}
              onChange={(val) =>
                persistContent({ ...content, brandName: val })
              }
            />
          </div>

          {/* Desktop Navigation */}
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

          {/* Mobile Hamburger Icon */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open Navigation Menu"
            className="md:hidden p-2 text-[#8C8980] hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors"
          >
            <Menu className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>
      </header>

      {/* DARK MOBILE OVERLAY DRAWER */}
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
              {content.brandName}
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
                href={content.contactPage.instagramUrl}
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                }}
                className="hover:text-[#F4F2ED] transition-colors"
              >
                Instagram
              </a>
              <a
                href={content.contactPage.vimeoUrl}
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                }}
                className="hover:text-[#F4F2ED] transition-colors"
              >
                Vimeo
              </a>
            </div>
            <p className="tracking-wide text-[#8C8980]">
              {content.contactPage.email}
            </p>
          </div>
        </div>
      )}

      {/* MAIN VIEW CONTENT */}
      <main className="flex-grow bg-[#F4F2ED]">
        {/* ==================== 1. HOME VIEW ==================== */}
        {view === "home" && (
          <div className="max-w-[1400px] mx-auto px-5 sm:px-10 pb-20 bg-[#F4F2ED]">
            {/* Hero Banner */}
            <section className="relative w-full h-[520px] sm:h-[600px] lg:h-[680px] overflow-hidden mt-3 sm:mt-6 border border-[#B7A28B]/40 bg-[#171715] isolate">
              {contentHydrated &&
                (isVideoAsset(content.hero.videoUrl) ? (
                  <video
                    src={content.hero.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <img
                    src={content.hero.image}
                    alt="Editorial hero portrait"
                    className="w-full h-full object-cover object-center"
                  />
                ))}

              {/* Subtle left/bottom vignette */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(23,23,21,0.45) 0%, rgba(23,23,21,0.12) 45%, rgba(23,23,21,0) 75%), linear-gradient(0deg, rgba(23,23,21,0.38) 0%, rgba(23,23,21,0) 45%)",
                }}
              />

              {/* Edit Hero Media Controls */}
              {editMode && (
                <div className="absolute top-4 right-4 z-20 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() =>
                      triggerFileUpload((url, isVid) => {
                        if (isVid) {
                          persistContent({
                            ...content,
                            hero: { ...content.hero, videoUrl: url },
                          });
                        } else {
                          persistContent({
                            ...content,
                            hero: {
                              ...content.hero,
                              image: url,
                              videoUrl: undefined,
                            },
                          });
                        }
                      })
                    }
                    className="inline-flex items-center space-x-1.5 bg-[#171715]/90 text-[#F4F2ED] text-[10px] tracking-[0.18em] uppercase px-3 py-2 border border-[#B7A28B] hover:bg-[#B7A28B] hover:text-[#171715] transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>UPLOAD HERO IMAGE / VIDEO</span>
                  </button>
                  <button
                    onClick={() =>
                      promptVideoUrl(
                        (url) =>
                          persistContent({
                            ...content,
                            hero: { ...content.hero, videoUrl: url },
                          }),
                        content.hero.videoUrl
                      )
                    }
                    className="inline-flex items-center space-x-1.5 bg-[#171715]/90 text-[#F4F2ED] text-[10px] tracking-[0.18em] uppercase px-3 py-2 border border-[#B7A28B] hover:bg-[#B7A28B] hover:text-[#171715] transition-colors"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    <span>VIDEO URL</span>
                  </button>
                  {content.hero.videoUrl && (
                    <button
                      onClick={() =>
                        persistContent({
                          ...content,
                          hero: { ...content.hero, videoUrl: undefined },
                        })
                      }
                      className="bg-[#171715]/90 text-[#F4F2ED] text-[10px] tracking-[0.18em] uppercase px-2.5 py-2 border border-[#B7A28B] hover:bg-red-800 transition-colors"
                    >
                      REMOVE VIDEO
                    </button>
                  )}
                </div>
              )}

              <div className="absolute inset-0 p-6 sm:p-12 lg:p-16 flex flex-col justify-end">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
                  {/* Left Hero Copy */}
                  <div className="max-w-lg text-[#F4F2ED] space-y-4">
                    <h1 className="font-serif text-4xl sm:text-5xl lg:text-[62px] leading-[1.08] tracking-tight font-normal text-[#F4F2ED]">
                      <EditableText
                        value={content.hero.titleLine1}
                        editMode={editMode}
                        onChange={(val) =>
                          persistContent({
                            ...content,
                            hero: { ...content.hero, titleLine1: val },
                          })
                        }
                      />
                      <br />
                      <EditableText
                        value={content.hero.titleLine2}
                        editMode={editMode}
                        onChange={(val) =>
                          persistContent({
                            ...content,
                            hero: { ...content.hero, titleLine2: val },
                          })
                        }
                      />
                    </h1>
                    <div className="text-[10px] sm:text-[11px] tracking-[0.26em] uppercase text-[#B7A28B] font-medium pt-1">
                      <EditableText
                        value={content.hero.subtitle}
                        editMode={editMode}
                        onChange={(val) =>
                          persistContent({
                            ...content,
                            hero: { ...content.hero, subtitle: val },
                          })
                        }
                      />
                    </div>
                    <div className="text-xs sm:text-sm text-[#F4F2ED]/85 leading-relaxed max-w-sm font-light">
                      <EditableText
                        value={content.hero.description}
                        editMode={editMode}
                        multiline
                        onChange={(val) =>
                          persistContent({
                            ...content,
                            hero: { ...content.hero, description: val },
                          })
                        }
                      />
                    </div>
                    <div className="pt-3">
                      <button
                        onClick={() => {
                          if (!editMode) {
                            document
                              .getElementById("selected-work")
                              ?.scrollIntoView({ behavior: "smooth" });
                          }
                        }}
                        className="inline-flex items-center space-x-3 text-[10px] tracking-[0.24em] uppercase text-[#F4F2ED] border-b border-[#B7A28B] pb-1.5 px-2 py-1 -ml-2 hover:bg-[#171715] hover:text-[#F4F2ED] transition-all group"
                      >
                        <EditableText
                          value={content.hero.ctaText}
                          editMode={editMode}
                          onChange={(val) =>
                            persistContent({
                              ...content,
                              hero: { ...content.hero, ctaText: val },
                            })
                          }
                        />
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

            {/* SELECTED WORK STRIP */}
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
                <div className="flex items-center gap-3">
                  {editMode && (
                    <button
                      onClick={() => setShowAddProjectModal(true)}
                      className="inline-flex items-center space-x-1.5 text-[10px] tracking-[0.2em] uppercase bg-[#171715] text-[#F4F2ED] px-3 py-1.5 hover:bg-[#B7A28B] hover:text-[#171715] transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>ADD PROJECT</span>
                    </button>
                  )}
                  <button
                    onClick={() => navigateToCategory("photography", "all")}
                    className="inline-flex items-center space-x-2 text-[10px] tracking-[0.22em] uppercase text-[#8C8980] px-3 py-1.5 hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors group"
                  >
                    <span>VIEW ALL</span>
                    <ArrowRight className="w-3 h-3 text-[#8C8980] group-hover:text-[#F4F2ED] group-hover:translate-x-0.5 transition-all" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-3.5">
                {content.projects
                  .filter((item) =>
                    homeCategoryFilter === "all"
                      ? true
                      : item.categorySlug === homeCategoryFilter
                  )
                  .slice(0, 6)
                  .map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (!editMode) navigateToProject(item.id);
                      }}
                      className="group cursor-pointer flex flex-col p-2.5 rounded-sm bg-[#D8D5CD] border border-[#B7A28B]/30 hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors duration-300 relative"
                    >
                      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#D8D5CD] mb-3">
                        {isVideoAsset(item.videoUrl) ? (
                          <video
                            src={item.videoUrl}
                            muted
                            loop
                            playsInline
                            onMouseOver={(e) => e.currentTarget.play()}
                            onMouseOut={(e) => e.currentTarget.pause()}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={item.coverImage}
                            alt={item.title}
                            className="w-full h-full object-cover editorial-image-grade group-hover:scale-105"
                          />
                        )}
                        {item.type === "film" && (
                          <div className="absolute inset-0 flex items-center justify-center bg-[#171715]/30 group-hover:bg-[#171715]/45 transition-colors pointer-events-none">
                            <div className="w-9 h-9 rounded-full border border-[#F4F2ED]/80 flex items-center justify-center bg-[#171715]/50 backdrop-blur-[2px]">
                              <Play className="w-3.5 h-3.5 text-[#F4F2ED] fill-[#F4F2ED] ml-0.5" />
                            </div>
                          </div>
                        )}

                        {/* Edit controls on each Selected Work card */}
                        {editMode && (
                          <div className="absolute top-2 right-2 z-20 flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                triggerFileUpload((url, isVid) => {
                                  const next = content.projects.map((p) =>
                                    p.id === item.id
                                      ? {
                                          ...p,
                                          coverImage: isVid
                                            ? p.coverImage
                                            : url,
                                          videoUrl: isVid ? url : p.videoUrl,
                                        }
                                      : p
                                  );
                                  persistContent({
                                    ...content,
                                    projects: next,
                                  });
                                });
                              }}
                              title="Upload new cover image or video"
                              className="p-1.5 bg-[#171715]/90 text-[#F4F2ED] hover:bg-[#B7A28B] hover:text-[#171715]"
                            >
                              <Upload className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => handleDeleteProject(item.id, e)}
                              title="Remove project"
                              className="p-1.5 bg-[#171715]/90 text-[#F4F2ED] hover:bg-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="flex items-start justify-between">
                        <div className="w-full">
                          <h3 className="text-[10px] tracking-[0.18em] uppercase text-[#373632] font-medium group-hover:text-[#F4F2ED] transition-colors">
                            <EditableText
                              value={item.title}
                              editMode={editMode}
                              onChange={(val) => {
                                const next = content.projects.map((p) =>
                                  p.id === item.id ? { ...p, title: val } : p
                                );
                                persistContent({ ...content, projects: next });
                              }}
                            />
                          </h3>
                          <p className="text-[9px] tracking-[0.15em] uppercase text-[#8C8980] group-hover:text-[#D8D5CD] mt-0.5 transition-colors">
                            <EditableText
                              value={item.category}
                              editMode={editMode}
                              onChange={(val) => {
                                const next = content.projects.map((p) =>
                                  p.id === item.id ? { ...p, category: val } : p
                                );
                                persistContent({ ...content, projects: next });
                              }}
                            />{" "}
                            /{" "}
                            <EditableText
                              value={item.year}
                              editMode={editMode}
                              onChange={(val) => {
                                const next = content.projects.map((p) =>
                                  p.id === item.id ? { ...p, year: val } : p
                                );
                                persistContent({ ...content, projects: next });
                              }}
                            />
                          </p>
                          {editMode && (
                            <button
                              onClick={() => navigateToProject(item.id)}
                              className="mt-2 text-[9px] tracking-wider uppercase underline text-[#373632] group-hover:text-[#B7A28B]"
                            >
                              Open &amp; Edit Project Details &rarr;
                            </button>
                          )}
                        </div>
                        <ArrowRight className="w-3 h-3 text-[#8C8980] group-hover:text-[#F4F2ED] sm:hidden mt-0.5" />
                      </div>
                    </div>
                  ))}
              </div>
            </section>

            {/* TWO-COLUMN PHOTOGRAPHY & FILMS FEATURE CARDS */}
            <section className="pt-16 sm:pt-24 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Photography Card — Stone (#D8D5CD) */}
              <div className="border border-[#B7A28B]/40 p-6 sm:p-9 bg-[#D8D5CD] flex flex-col justify-between transition-colors">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="font-serif text-xl sm:text-2xl tracking-[0.08em] uppercase text-[#373632]">
                      <EditableText
                        value={content.homeCards.photographyTitle}
                        editMode={editMode}
                        onChange={(val) =>
                          persistContent({
                            ...content,
                            homeCards: {
                              ...content.homeCards,
                              photographyTitle: val,
                            },
                          })
                        }
                      />
                    </h2>
                    <div className="text-xs text-[#8C8980] mt-2 max-w-xs leading-relaxed">
                      <EditableText
                        value={content.homeCards.photographyDesc}
                        editMode={editMode}
                        multiline
                        onChange={(val) =>
                          persistContent({
                            ...content,
                            homeCards: {
                              ...content.homeCards,
                              photographyDesc: val,
                            },
                          })
                        }
                      />
                    </div>
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
                  onClick={() => {
                    if (!editMode) navigateToCategory("photography", "all");
                  }}
                  className="relative aspect-[16/9] w-full overflow-hidden cursor-pointer group border border-[#B7A28B]/30"
                >
                  <img
                    src={content.homeCards.photographyImage}
                    alt="Photography showcase"
                    className="w-full h-full object-cover editorial-image-grade group-hover:scale-105"
                  />
                  {editMode && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerFileUpload((url) =>
                          persistContent({
                            ...content,
                            homeCards: {
                              ...content.homeCards,
                              photographyImage: url,
                            },
                          })
                        );
                      }}
                      className="absolute top-3 right-3 bg-[#171715]/90 text-[#F4F2ED] text-[10px] tracking-widest uppercase px-3 py-1.5 border border-[#B7A28B] inline-flex items-center space-x-1.5"
                    >
                      <Upload className="w-3 h-3" />
                      <span>CHANGE IMAGE</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Films Card — Soft Black (#171715) */}
              <div className="border border-[#171715] p-6 sm:p-9 bg-[#171715] text-[#F4F2ED] flex flex-col justify-between transition-colors">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="font-serif text-xl sm:text-2xl tracking-[0.08em] uppercase text-[#F4F2ED]">
                      <EditableText
                        value={content.homeCards.filmsTitle}
                        editMode={editMode}
                        onChange={(val) =>
                          persistContent({
                            ...content,
                            homeCards: {
                              ...content.homeCards,
                              filmsTitle: val,
                            },
                          })
                        }
                      />
                    </h2>
                    <div className="text-xs text-[#8C8980] mt-2 max-w-xs leading-relaxed">
                      <EditableText
                        value={content.homeCards.filmsDesc}
                        editMode={editMode}
                        multiline
                        onChange={(val) =>
                          persistContent({
                            ...content,
                            homeCards: {
                              ...content.homeCards,
                              filmsDesc: val,
                            },
                          })
                        }
                      />
                    </div>
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
                    onClick={() => {
                      if (!editMode) navigateToCategory("films", "all");
                    }}
                    className="sm:col-span-8 relative aspect-[16/9] w-full overflow-hidden cursor-pointer group border border-[#B7A28B]/30"
                  >
                    <img
                      src={content.homeCards.filmsImage}
                      alt="Films showcase"
                      className="w-full h-full object-cover editorial-image-grade group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[#171715]/30 flex items-center justify-center group-hover:bg-[#171715]/45 transition-colors pointer-events-none">
                      <div className="w-11 h-11 rounded-full border border-[#F4F2ED]/85 flex items-center justify-center bg-[#171715]/45">
                        <Play className="w-4 h-4 text-[#F4F2ED] fill-[#F4F2ED] ml-0.5" />
                      </div>
                    </div>
                    {editMode && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerFileUpload((url) =>
                            persistContent({
                              ...content,
                              homeCards: {
                                ...content.homeCards,
                                filmsImage: url,
                              },
                            })
                          );
                        }}
                        className="absolute top-3 right-3 z-20 bg-[#171715]/90 text-[#F4F2ED] text-[10px] tracking-widest uppercase px-3 py-1.5 border border-[#B7A28B] inline-flex items-center space-x-1.5"
                      >
                        <Upload className="w-3 h-3" />
                        <span>CHANGE</span>
                      </button>
                    )}
                  </div>
                  <div className="sm:col-span-4 space-y-2 border-l border-[#B7A28B]/40 pl-4">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#F4F2ED] font-medium">
                      <EditableText
                        value={content.homeCards.filmsSideLabel}
                        editMode={editMode}
                        onChange={(val) =>
                          persistContent({
                            ...content,
                            homeCards: {
                              ...content.homeCards,
                              filmsSideLabel: val,
                            },
                          })
                        }
                      />
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
                src={content.photographyPage.bannerImage}
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
              {editMode && (
                <button
                  onClick={() =>
                    triggerFileUpload((url) =>
                      persistContent({
                        ...content,
                        photographyPage: {
                          ...content.photographyPage,
                          bannerImage: url,
                        },
                      })
                    )
                  }
                  className="absolute top-4 right-4 z-20 bg-[#171715]/90 text-[#F4F2ED] text-[10px] tracking-widest uppercase px-3 py-2 border border-[#B7A28B] inline-flex items-center space-x-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>CHANGE BANNER IMAGE</span>
                </button>
              )}
              <div className="absolute inset-0 p-6 sm:p-12 lg:p-16 flex flex-col justify-end">
                <h1 className="font-serif text-3xl sm:text-5xl text-[#F4F2ED] font-normal mb-3">
                  <EditableText
                    value={content.photographyPage.title}
                    editMode={editMode}
                    onChange={(val) =>
                      persistContent({
                        ...content,
                        photographyPage: {
                          ...content.photographyPage,
                          title: val,
                        },
                      })
                    }
                  />
                </h1>
                <p className="text-[10px] sm:text-[11px] tracking-[0.24em] uppercase text-[#D8D5CD]">
                  <EditableText
                    value={content.photographyPage.subtitle}
                    editMode={editMode}
                    onChange={(val) =>
                      persistContent({
                        ...content,
                        photographyPage: {
                          ...content.photographyPage,
                          subtitle: val,
                        },
                      })
                    }
                  />
                </p>
              </div>
            </section>

            {/* Category Filter Bar */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-5 py-6 border-b border-[#B7A28B]/40 text-[10px] tracking-[0.22em] uppercase">
              {[
                { label: "ALL", value: "all" },
                ...content.photographySections.map((s) => ({
                  label: s.title,
                  value: s.slug,
                })),
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
              {content.photographySections
                .filter(
                  (sec) => photoFilter === "all" || sec.slug === photoFilter
                )
                .map((section, sIdx) => (
                  <section key={section.slug}>
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="text-[11px] tracking-[0.24em] uppercase text-[#373632] font-medium">
                        <EditableText
                          value={section.title}
                          editMode={editMode}
                          onChange={(val) => {
                            const nextSecs = content.photographySections.map(
                              (s) =>
                                s.slug === section.slug
                                  ? { ...s, title: val }
                                  : s
                            );
                            persistContent({
                              ...content,
                              photographySections: nextSecs,
                            });
                          }}
                        />
                      </h2>
                      <div className="flex items-center gap-3">
                        {editMode && (
                          <button
                            onClick={() =>
                              triggerFileUpload((url) => {
                                const defaultProjId =
                                  section.images[0]?.projectId ||
                                  content.projects[0]?.id ||
                                  "the-silent-form";
                                const nextSecs =
                                  content.photographySections.map((s) =>
                                    s.slug === section.slug
                                      ? {
                                          ...s,
                                          images: [
                                            ...s.images,
                                            {
                                              src: url,
                                              projectId: defaultProjId,
                                              caption: "New Photograph",
                                            },
                                          ],
                                        }
                                      : s
                                  );
                                persistContent({
                                  ...content,
                                  photographySections: nextSecs,
                                });
                              })
                            }
                            className="inline-flex items-center space-x-1 bg-[#171715] text-[#F4F2ED] text-[10px] tracking-widest uppercase px-3 py-1 hover:bg-[#B7A28B] hover:text-[#171715] transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                            <span>ADD IMAGE</span>
                          </button>
                        )}
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
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                      {section.images.map((img, idx) => (
                        <div
                          key={`${sIdx}-${idx}`}
                          onClick={() => {
                            if (!editMode) navigateToProject(img.projectId);
                          }}
                          className="group cursor-pointer relative aspect-[4/3] overflow-hidden"
                        >
                          <img
                            src={img.src}
                            alt={img.caption}
                            className="w-full h-full object-cover editorial-image-grade group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-[#171715]/0 group-hover:bg-[#171715]/45 transition-colors flex items-end p-4">
                            <span className="text-[10px] tracking-[0.2em] uppercase text-[#F4F2ED] opacity-0 group-hover:opacity-100 transition-opacity">
                              <EditableText
                                value={img.caption}
                                editMode={editMode}
                                onChange={(val) => {
                                  const nextSecs =
                                    content.photographySections.map((s) =>
                                      s.slug === section.slug
                                        ? {
                                            ...s,
                                            images: s.images.map((im, i) =>
                                              i === idx
                                                ? { ...im, caption: val }
                                                : im
                                            ),
                                          }
                                        : s
                                    );
                                  persistContent({
                                    ...content,
                                    photographySections: nextSecs,
                                  });
                                }}
                              />{" "}
                              &rarr;
                            </span>
                          </div>

                          {/* Upload / Replace or Remove Image in Photography Section */}
                          {editMode && (
                            <div className="absolute top-2 right-2 z-20 flex items-center gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  triggerFileUpload((url) => {
                                    const nextSecs =
                                      content.photographySections.map((s) =>
                                        s.slug === section.slug
                                          ? {
                                              ...s,
                                              images: s.images.map((im, i) =>
                                                i === idx
                                                  ? { ...im, src: url }
                                                  : im
                                              ),
                                            }
                                          : s
                                      );
                                    persistContent({
                                      ...content,
                                      photographySections: nextSecs,
                                    });
                                  });
                                }}
                                title="Replace image"
                                className="p-1.5 bg-[#171715]/90 text-[#F4F2ED] hover:bg-[#B7A28B] hover:text-[#171715]"
                              >
                                <Upload className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const nextSecs =
                                    content.photographySections.map((s) =>
                                      s.slug === section.slug
                                        ? {
                                            ...s,
                                            images: s.images.filter(
                                              (_, i) => i !== idx
                                            ),
                                          }
                                        : s
                                    );
                                  persistContent({
                                    ...content,
                                    photographySections: nextSecs,
                                  });
                                }}
                                title="Remove image"
                                className="p-1.5 bg-[#171715]/90 text-[#F4F2ED] hover:bg-red-700"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
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
                  src={content.filmsPage.bannerImage}
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
                {editMode && (
                  <button
                    onClick={() =>
                      triggerFileUpload((url) =>
                        persistContent({
                          ...content,
                          filmsPage: {
                            ...content.filmsPage,
                            bannerImage: url,
                          },
                        })
                      )
                    }
                    className="absolute top-4 right-4 z-20 bg-[#171715]/90 text-[#F4F2ED] text-[10px] tracking-widest uppercase px-3 py-2 border border-[#B7A28B] inline-flex items-center space-x-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>CHANGE BANNER</span>
                  </button>
                )}
                <div className="absolute inset-0 p-6 sm:p-12 lg:p-16 flex flex-col justify-end">
                  <h1 className="font-serif text-3xl sm:text-5xl text-[#F4F2ED] font-normal mb-3">
                    <EditableText
                      value={content.filmsPage.title}
                      editMode={editMode}
                      onChange={(val) =>
                        persistContent({
                          ...content,
                          filmsPage: { ...content.filmsPage, title: val },
                        })
                      }
                    />
                  </h1>
                  <p className="text-[10px] sm:text-[11px] tracking-[0.24em] uppercase text-[#B7A28B]">
                    <EditableText
                      value={content.filmsPage.subtitle}
                      editMode={editMode}
                      onChange={(val) =>
                        persistContent({
                          ...content,
                          filmsPage: { ...content.filmsPage, subtitle: val },
                        })
                      }
                    />
                  </p>
                </div>
              </section>

              {/* 4-Column Film Category Grid */}
              <section className="pt-10 sm:pt-14">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {content.filmCategories.map((cat, cIdx) => (
                    <div
                      key={cat.slug}
                      onClick={() => {
                        if (!editMode) navigateToProject(cat.projectId);
                      }}
                      className="group cursor-pointer p-3 -m-3 hover:bg-[#373632]/40 transition-colors relative"
                    >
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#171715] border border-[#B7A28B]/30 mb-3.5">
                        <img
                          src={cat.image}
                          alt={cat.title}
                          className="w-full h-full object-cover opacity-90 editorial-image-grade group-hover:scale-105 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-[#171715]/30 flex items-center justify-center group-hover:bg-[#171715]/45 transition-colors pointer-events-none">
                          <div className="w-11 h-11 rounded-full border border-[#F4F2ED]/80 flex items-center justify-center bg-[#171715]/45 backdrop-blur-[2px] group-hover:scale-110 transition-transform">
                            <Play className="w-4 h-4 text-[#F4F2ED] fill-[#F4F2ED] ml-0.5" />
                          </div>
                        </div>
                        {editMode && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerFileUpload((url) => {
                                const nextCats = content.filmCategories.map(
                                  (c, i) =>
                                    i === cIdx ? { ...c, image: url } : c
                                );
                                persistContent({
                                  ...content,
                                  filmCategories: nextCats,
                                });
                              });
                            }}
                            className="absolute top-2 right-2 z-20 p-1.5 bg-[#171715]/90 text-[#F4F2ED] hover:bg-[#B7A28B] hover:text-[#171715]"
                          >
                            <Upload className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <h3 className="text-[10px] tracking-[0.2em] uppercase text-[#F4F2ED] font-medium">
                        <EditableText
                          value={cat.title}
                          editMode={editMode}
                          onChange={(val) => {
                            const nextCats = content.filmCategories.map(
                              (c, i) => (i === cIdx ? { ...c, title: val } : c)
                            );
                            persistContent({
                              ...content,
                              filmCategories: nextCats,
                            });
                          }}
                        />
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
                  <div className="flex items-center gap-4">
                    <h2 className="text-[11px] tracking-[0.24em] uppercase text-[#F4F2ED] font-medium">
                      FEATURED MOTION ARCHIVE
                    </h2>
                    {editMode && (
                      <button
                        onClick={() => {
                          setNewProjectForm({
                            ...newProjectForm,
                            type: "film",
                            category: "FASHION FILM",
                            categorySlug: "film-fashion",
                          });
                          setShowAddProjectModal(true);
                        }}
                        className="inline-flex items-center space-x-1 bg-[#B7A28B] text-[#171715] text-[10px] tracking-widest uppercase px-3 py-1 font-medium"
                      >
                        <Plus className="w-3 h-3" />
                        <span>ADD FILM</span>
                      </button>
                    )}
                  </div>
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
                  {content.projects
                    .filter(
                      (p) =>
                        p.type === "film" &&
                        (filmFilter === "all" || p.categorySlug === filmFilter)
                    )
                    .map((film) => (
                      <div
                        key={film.id}
                        onClick={() => {
                          if (!editMode) navigateToProject(film.id);
                        }}
                        className="group cursor-pointer border border-[#B7A28B]/30 hover:border-[#B7A28B] p-4 sm:p-6 bg-[#171715] transition-colors relative"
                      >
                        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#171715] mb-4">
                          {isVideoAsset(film.videoUrl) ? (
                            <video
                              src={film.videoUrl}
                              muted
                              loop
                              playsInline
                              onMouseOver={(e) => e.currentTarget.play()}
                              onMouseOut={(e) => e.currentTarget.pause()}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src={film.coverImage}
                              alt={film.title}
                              className="w-full h-full object-cover editorial-image-grade group-hover:scale-105"
                            />
                          )}
                          <div className="absolute inset-0 bg-[#171715]/30 flex items-center justify-center pointer-events-none">
                            <div className="w-12 h-12 rounded-full border border-[#F4F2ED]/80 flex items-center justify-center bg-[#171715]/45 group-hover:scale-110 transition-transform">
                              <Play className="w-4 h-4 text-[#F4F2ED] fill-[#F4F2ED] ml-0.5" />
                            </div>
                          </div>
                          {film.duration && (
                            <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-[#171715]/85 text-[#F4F2ED] text-[10px] tracking-widest">
                              {film.duration}
                            </span>
                          )}
                          {editMode && (
                            <div className="absolute top-2 right-2 z-20 flex flex-wrap items-center gap-1.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  triggerFileUpload((url, isVid) => {
                                    const next = content.projects.map((p) =>
                                      p.id === film.id
                                        ? {
                                            ...p,
                                            coverImage: isVid
                                              ? p.coverImage
                                              : url,
                                            videoUrl: isVid ? url : p.videoUrl,
                                          }
                                        : p
                                    );
                                    persistContent({
                                      ...content,
                                      projects: next,
                                    });
                                  });
                                }}
                                title="Upload video or cover image"
                                className="px-2.5 py-1 bg-[#171715]/90 text-[#F4F2ED] text-[9px] tracking-wider uppercase border border-[#B7A28B] inline-flex items-center space-x-1"
                              >
                                <Video className="w-3 h-3" />
                                <span>UPLOAD COVER / CLIP</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  promptVideoUrl((url) => {
                                    const next = content.projects.map((p) =>
                                      p.id === film.id
                                        ? { ...p, videoUrl: url }
                                        : p
                                    );
                                    persistContent({
                                      ...content,
                                      projects: next,
                                    });
                                  }, film.videoUrl);
                                }}
                                title="Paste Vimeo, YouTube, or MP4 video URL"
                                className="px-2.5 py-1 bg-[#171715]/90 text-[#F4F2ED] text-[9px] tracking-wider uppercase border border-[#B7A28B] inline-flex items-center space-x-1"
                              >
                                <Link2 className="w-3 h-3" />
                                <span>VIDEO URL</span>
                              </button>
                              <button
                                onClick={(e) => handleDeleteProject(film.id, e)}
                                title="Delete film"
                                className="p-1.5 bg-[#171715]/90 text-[#F4F2ED] hover:bg-red-700"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-xs tracking-[0.2em] uppercase text-[#F4F2ED] font-medium">
                              <EditableText
                                value={film.title}
                                editMode={editMode}
                                onChange={(val) => {
                                  const next = content.projects.map((p) =>
                                    p.id === film.id
                                      ? { ...p, title: val }
                                      : p
                                  );
                                  persistContent({
                                    ...content,
                                    projects: next,
                                  });
                                }}
                              />
                            </h3>
                            <p className="text-[10px] tracking-[0.18em] uppercase text-[#8C8980] mt-1">
                              <EditableText
                                value={film.category}
                                editMode={editMode}
                                onChange={(val) => {
                                  const next = content.projects.map((p) =>
                                    p.id === film.id
                                      ? { ...p, category: val }
                                      : p
                                  );
                                  persistContent({
                                    ...content,
                                    projects: next,
                                  });
                                }}
                              />{" "}
                              /{" "}
                              <EditableText
                                value={film.year}
                                editMode={editMode}
                                onChange={(val) => {
                                  const next = content.projects.map((p) =>
                                    p.id === film.id ? { ...p, year: val } : p
                                  );
                                  persistContent({
                                    ...content,
                                    projects: next,
                                  });
                                }}
                              />
                            </p>
                          </div>
                          <ArrowRight
                            onClick={() => navigateToProject(film.id)}
                            className="w-4 h-4 text-[#B7A28B] group-hover:text-[#F4F2ED] group-hover:translate-x-1 transition-all"
                          />
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

            {/* Project Title & Subtitle */}
            <div className="mb-8">
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#373632] font-normal">
                <EditableText
                  value={currentProject.title}
                  editMode={editMode}
                  onChange={(val) => updateCurrentProject({ title: val })}
                />
              </h1>
              <p className="text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-[#8C8980] mt-2">
                <EditableText
                  value={currentProject.category}
                  editMode={editMode}
                  onChange={(val) => updateCurrentProject({ category: val })}
                />{" "}
                /{" "}
                <EditableText
                  value={currentProject.year}
                  editMode={editMode}
                  onChange={(val) => updateCurrentProject({ year: val })}
                />
              </p>
            </div>

            {/* Asymmetric Two-Column Project Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Left 8 Columns: Main Feature Image/Film + Bottom 3-Up Grid */}
              <div className="lg:col-span-8 space-y-4">
                <div
                  onClick={() => {
                    if (editMode) return;
                    if (currentProject.type === "film" || currentProject.videoUrl) {
                      setActiveVideoModal(currentProject);
                    } else {
                      setLightboxImage(currentProject.coverImage);
                    }
                  }}
                  className="relative aspect-[16/11] w-full overflow-hidden cursor-pointer group"
                >
                  {(() => {
                    const parsedVid = parseVideoEmbed(currentProject.videoUrl);
                    if (parsedVid?.kind === "iframe") {
                      return (
                        <iframe
                          src={parsedVid.src}
                          title={currentProject.title}
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full border-0"
                        />
                      );
                    }
                    if (parsedVid?.kind === "native") {
                      return (
                        <video
                          src={parsedVid.src}
                          controls
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      );
                    }
                    return (
                      <img
                        src={currentProject.coverImage}
                        alt={currentProject.title}
                        className="w-full h-full object-cover editorial-image-grade group-hover:scale-[1.02]"
                      />
                    );
                  })()}
                  {!isVideoAsset(currentProject.videoUrl) &&
                    (currentProject.type === "film" ? (
                      <div className="absolute inset-0 bg-[#171715]/30 flex items-center justify-center group-hover:bg-[#171715]/45 transition-colors pointer-events-none">
                        <div className="w-16 h-16 rounded-full border border-[#F4F2ED] flex items-center justify-center bg-[#171715]/45 backdrop-blur-sm group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 text-[#F4F2ED] fill-[#F4F2ED] ml-1" />
                        </div>
                      </div>
                    ) : (
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-[#171715]/80 text-[#F4F2ED] p-2 pointer-events-none">
                        <Maximize2 className="w-4 h-4" />
                      </div>
                    ))}

                  {editMode && (
                    <div className="absolute top-3 right-3 z-20 flex flex-wrap items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerFileUpload((url, isVid) => {
                            if (isVid) {
                              updateCurrentProject({
                                videoUrl: url,
                                type: "film",
                              });
                            } else {
                              updateCurrentProject({ coverImage: url });
                            }
                          });
                        }}
                        className="bg-[#171715]/90 text-[#F4F2ED] text-[10px] tracking-widest uppercase px-3 py-2 border border-[#B7A28B] inline-flex items-center space-x-1.5 hover:bg-[#B7A28B] hover:text-[#171715]"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>UPLOAD MAIN IMAGE / VIDEO</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          promptVideoUrl((url) => {
                            updateCurrentProject({
                              videoUrl: url,
                              type: "film",
                            });
                          }, currentProject.videoUrl);
                        }}
                        className="bg-[#171715]/90 text-[#F4F2ED] text-[10px] tracking-widest uppercase px-3 py-2 border border-[#B7A28B] inline-flex items-center space-x-1.5 hover:bg-[#B7A28B] hover:text-[#171715]"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        <span>VIDEO URL (VIMEO / YT)</span>
                      </button>
                      {currentProject.videoUrl && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateCurrentProject({ videoUrl: undefined });
                          }}
                          className="bg-[#171715]/90 text-[#F4F2ED] text-[10px] tracking-widest uppercase px-2.5 py-2 border border-[#B7A28B] hover:bg-red-800"
                        >
                          REMOVE VIDEO
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom 3-Column Stills Row */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  {currentProject.gallery.slice(1, 4).map((imgUrl, idx) => {
                    const actualIdx = idx + 1;
                    return (
                      <div
                        key={actualIdx}
                        onClick={() => {
                          if (!editMode) setLightboxImage(imgUrl);
                        }}
                        className="relative aspect-square overflow-hidden cursor-pointer group"
                      >
                        <img
                          src={imgUrl}
                          alt={`${currentProject.title} still ${actualIdx}`}
                          className="w-full h-full object-cover editorial-image-grade group-hover:scale-105"
                        />
                        {editMode && (
                          <div className="absolute top-2 right-2 z-20 flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                triggerFileUpload((url) => {
                                  const nextGal = currentProject.gallery.map(
                                    (g, i) => (i === actualIdx ? url : g)
                                  );
                                  updateCurrentProject({ gallery: nextGal });
                                });
                              }}
                              title="Replace image"
                              className="p-1.5 bg-[#171715]/90 text-[#F4F2ED]"
                            >
                              <Upload className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const nextGal = currentProject.gallery.filter(
                                  (_, i) => i !== actualIdx
                                );
                                updateCurrentProject({ gallery: nextGal });
                              }}
                              title="Remove image"
                              className="p-1.5 bg-[#171715]/90 text-[#F4F2ED] hover:bg-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right 4 Columns: Editorial Notes, Role, Discipline & Side Gallery */}
              <div className="lg:col-span-4 flex flex-col justify-between space-y-8">
                <div className="space-y-6">
                  <div className="text-xs sm:text-sm text-[#8C8980] leading-relaxed font-normal">
                    <EditableText
                      value={currentProject.description}
                      editMode={editMode}
                      multiline
                      onChange={(val) =>
                        updateCurrentProject({ description: val })
                      }
                    />
                  </div>

                  <div className="border-t border-[#B7A28B]/40 pt-4 space-y-4">
                    <div>
                      <p className="text-[9px] tracking-[0.22em] uppercase text-[#373632] font-medium">
                        ROLE
                      </p>
                      <p className="text-xs text-[#8C8980] mt-1">
                        <EditableText
                          value={currentProject.role}
                          editMode={editMode}
                          onChange={(val) => updateCurrentProject({ role: val })}
                        />
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] tracking-[0.22em] uppercase text-[#373632] font-medium">
                        DISCIPLINE
                      </p>
                      <p className="text-xs text-[#8C8980] mt-1">
                        <EditableText
                          value={currentProject.discipline}
                          editMode={editMode}
                          onChange={(val) =>
                            updateCurrentProject({ discipline: val })
                          }
                        />
                      </p>
                    </div>

                    {/* Film specific credits */}
                    {currentProject.type === "film" && (
                      <div className="pt-3 border-t border-[#B7A28B]/40 space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-[#8C8980]">Director</span>
                          <span className="text-[#373632]">
                            <EditableText
                              value={currentProject.director || "Ajnas"}
                              editMode={editMode}
                              onChange={(val) =>
                                updateCurrentProject({ director: val })
                              }
                            />
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#8C8980]">Cinematography</span>
                          <span className="text-[#373632]">
                            <EditableText
                              value={currentProject.cinematography || "Ajnas"}
                              editMode={editMode}
                              onChange={(val) =>
                                updateCurrentProject({ cinematography: val })
                              }
                            />
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#8C8980]">Editor</span>
                          <span className="text-[#373632]">
                            <EditableText
                              value={currentProject.editor || "Ajnas"}
                              editMode={editMode}
                              onChange={(val) =>
                                updateCurrentProject({ editor: val })
                              }
                            />
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#8C8980]">Duration</span>
                          <span className="text-[#373632]">
                            <EditableText
                              value={currentProject.duration || "02:58"}
                              editMode={editMode}
                              onChange={(val) =>
                                updateCurrentProject({ duration: val })
                              }
                            />
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column Thumbnail Gallery */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[9px] tracking-[0.22em] uppercase text-[#373632] font-medium">
                        GALLERY
                      </p>
                      {editMode && (
                        <button
                          onClick={() =>
                            triggerFileUpload((url) =>
                              updateCurrentProject({
                                gallery: [...currentProject.gallery, url],
                              })
                            )
                          }
                          className="inline-flex items-center space-x-1 bg-[#171715] text-[#F4F2ED] text-[9px] tracking-widest uppercase px-2.5 py-1 hover:bg-[#B7A28B] hover:text-[#171715]"
                        >
                          <Plus className="w-3 h-3" />
                          <span>ADD PHOTO</span>
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {currentProject.gallery.map((gImg, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            if (!editMode) setLightboxImage(gImg);
                          }}
                          className="relative aspect-[4/3] overflow-hidden cursor-pointer group"
                        >
                          <img
                            src={gImg}
                            alt={`${currentProject.title} thumbnail ${i + 1}`}
                            className="w-full h-full object-cover editorial-image-grade group-hover:scale-105"
                          />
                          {editMode && (
                            <div className="absolute top-1.5 right-1.5 z-20 flex items-center gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  triggerFileUpload((url) => {
                                    const nextGal = currentProject.gallery.map(
                                      (g, idx) => (idx === i ? url : g)
                                    );
                                    updateCurrentProject({ gallery: nextGal });
                                  });
                                }}
                                title="Replace photo"
                                className="p-1 bg-[#171715]/90 text-[#F4F2ED]"
                              >
                                <Upload className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const nextGal = currentProject.gallery.filter(
                                    (_, idx) => idx !== i
                                  );
                                  updateCurrentProject({ gallery: nextGal });
                                }}
                                title="Remove photo"
                                className="p-1 bg-[#171715]/90 text-[#F4F2ED] hover:bg-red-700"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
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
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-white p-2 border border-white">
                  <img
                    src={content.aboutPage.portraitImage}
                    alt="Ajnas — Photographer and Film Director"
                    className="w-full h-full object-cover editorial-image-grade"
                  />
                  {editMode && (
                    <button
                      onClick={() =>
                        triggerFileUpload((url) =>
                          persistContent({
                            ...content,
                            aboutPage: {
                              ...content.aboutPage,
                              portraitImage: url,
                            },
                          })
                        )
                      }
                      className="absolute top-4 right-4 z-20 bg-[#171715]/90 text-[#F4F2ED] text-[10px] tracking-widest uppercase px-3 py-2 border border-[#B7A28B] inline-flex items-center space-x-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>CHANGE PORTRAIT</span>
                    </button>
                  )}
                </div>
                <div className="text-[11px] text-[#8C8980] leading-relaxed">
                  <EditableText
                    value={content.aboutPage.availabilityNote}
                    editMode={editMode}
                    multiline
                    onChange={(val) =>
                      persistContent({
                        ...content,
                        aboutPage: {
                          ...content.aboutPage,
                          availabilityNote: val,
                        },
                      })
                    }
                  />
                </div>
              </div>

              {/* Right Column Editorial Bio & Disciplines */}
              <div className="lg:col-span-7 space-y-7">
                <h1 className="font-serif text-3xl sm:text-4xl text-[#373632] font-normal">
                  <EditableText
                    value={content.aboutPage.title}
                    editMode={editMode}
                    onChange={(val) =>
                      persistContent({
                        ...content,
                        aboutPage: { ...content.aboutPage, title: val },
                      })
                    }
                  />
                </h1>

                <div className="font-serif text-xl sm:text-2xl leading-[1.4] text-[#373632] font-normal">
                  <EditableText
                    value={content.aboutPage.leadBio}
                    editMode={editMode}
                    multiline
                    onChange={(val) =>
                      persistContent({
                        ...content,
                        aboutPage: { ...content.aboutPage, leadBio: val },
                      })
                    }
                  />
                </div>

                <div className="text-xs sm:text-sm text-[#8C8980] leading-relaxed max-w-lg">
                  <EditableText
                    value={content.aboutPage.bodyBio}
                    editMode={editMode}
                    multiline
                    onChange={(val) =>
                      persistContent({
                        ...content,
                        aboutPage: { ...content.aboutPage, bodyBio: val },
                      })
                    }
                  />
                </div>

                <div className="pt-5 border-t border-[#B7A28B]/40">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[10px] tracking-[0.24em] uppercase text-[#373632] font-medium">
                      <EditableText
                        value={content.aboutPage.disciplinesTitle}
                        editMode={editMode}
                        onChange={(val) =>
                          persistContent({
                            ...content,
                            aboutPage: {
                              ...content.aboutPage,
                              disciplinesTitle: val,
                            },
                          })
                        }
                      />
                    </h2>
                    {editMode && (
                      <button
                        onClick={() =>
                          persistContent({
                            ...content,
                            aboutPage: {
                              ...content.aboutPage,
                              disciplines: [
                                ...content.aboutPage.disciplines,
                                "New Discipline",
                              ],
                            },
                          })
                        }
                        className="inline-flex items-center space-x-1 bg-[#171715] text-[#F4F2ED] text-[9px] tracking-widest uppercase px-2.5 py-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>ADD ITEM</span>
                      </button>
                    )}
                  </div>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-[#8C8980] font-normal">
                    {content.aboutPage.disciplines.map((disc, dIdx) => (
                      <li
                        key={dIdx}
                        className="flex items-center justify-between gap-2"
                      >
                        <EditableText
                          value={disc}
                          editMode={editMode}
                          onChange={(val) => {
                            const nextList = content.aboutPage.disciplines.map(
                              (item, i) => (i === dIdx ? val : item)
                            );
                            persistContent({
                              ...content,
                              aboutPage: {
                                ...content.aboutPage,
                                disciplines: nextList,
                              },
                            });
                          }}
                        />
                        {editMode && (
                          <button
                            onClick={() => {
                              const nextList =
                                content.aboutPage.disciplines.filter(
                                  (_, i) => i !== dIdx
                                );
                              persistContent({
                                ...content,
                                aboutPage: {
                                  ...content.aboutPage,
                                  disciplines: nextList,
                                },
                              });
                            }}
                            className="text-red-700 hover:text-red-900 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Signature & CTA Button */}
                <div className="pt-6 flex flex-wrap items-center justify-between gap-6 border-t border-[#B7A28B]/40">
                  <div>
                    <p className="font-signature text-3xl text-[#373632] italic">
                      <EditableText
                        value={content.aboutPage.signatureName}
                        editMode={editMode}
                        onChange={(val) =>
                          persistContent({
                            ...content,
                            aboutPage: {
                              ...content.aboutPage,
                              signatureName: val,
                            },
                          })
                        }
                      />
                    </p>
                    <p className="text-[9px] tracking-[0.24em] uppercase text-[#8C8980] mt-1">
                      <EditableText
                        value={content.aboutPage.signatureRole}
                        editMode={editMode}
                        onChange={(val) =>
                          persistContent({
                            ...content,
                            aboutPage: {
                              ...content.aboutPage,
                              signatureRole: val,
                            },
                          })
                        }
                      />
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

        {/* ==================== 6. CONTACT VIEW ==================== */}
        {view === "contact" && (
          <div className="max-w-[960px] mx-auto px-5 sm:px-10 pt-8 sm:pt-14 pb-24 bg-[#F4F2ED]">
            <div className="mb-10">
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#373632] font-normal">
                <EditableText
                  value={content.contactPage.title}
                  editMode={editMode}
                  onChange={(val) =>
                    persistContent({
                      ...content,
                      contactPage: { ...content.contactPage, title: val },
                    })
                  }
                />
              </h1>
              <p className="text-xs sm:text-sm text-[#8C8980] mt-2.5">
                <EditableText
                  value={content.contactPage.subtitle}
                  editMode={editMode}
                  onChange={(val) =>
                    persistContent({
                      ...content,
                      contactPage: { ...content.contactPage, subtitle: val },
                    })
                  }
                />
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
                <p className="text-[#373632] font-medium">
                  <EditableText
                    value={content.contactPage.locationTitle}
                    editMode={editMode}
                    onChange={(val) =>
                      persistContent({
                        ...content,
                        contactPage: {
                          ...content.contactPage,
                          locationTitle: val,
                        },
                      })
                    }
                  />
                </p>
                <p>
                  <EditableText
                    value={content.contactPage.locationSub}
                    editMode={editMode}
                    onChange={(val) =>
                      persistContent({
                        ...content,
                        contactPage: {
                          ...content.contactPage,
                          locationSub: val,
                        },
                      })
                    }
                  />
                </p>
                <p className="text-[10px] tracking-[0.22em] uppercase pt-2 text-[#8C8980]">
                  <EditableText
                    value={content.contactPage.cities}
                    editMode={editMode}
                    onChange={(val) =>
                      persistContent({
                        ...content,
                        contactPage: { ...content.contactPage, cities: val },
                      })
                    }
                  />
                </p>
              </div>

              <div className="space-y-1.5 sm:text-right">
                <div className="inline-block text-[#373632] px-2 py-0.5">
                  <EditableText
                    value={content.contactPage.email}
                    editMode={editMode}
                    onChange={(val) =>
                      persistContent({
                        ...content,
                        contactPage: { ...content.contactPage, email: val },
                      })
                    }
                  />
                </div>
                <div className="flex sm:justify-end space-x-3 text-[11px] text-[#8C8980]">
                  <a
                    href={content.contactPage.instagramUrl}
                    onClick={(e) => e.preventDefault()}
                    className="px-2 py-0.5 hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors"
                  >
                    Instagram &rarr;
                  </a>
                  <a
                    href={content.contactPage.vimeoUrl}
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

      {/* FOOTER */}
      <footer className="border-t border-[#B7A28B]/40 bg-[#F4F2ED]">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setView("home")}
              className="font-serif text-lg tracking-[0.22em] uppercase text-[#373632]"
            >
              {content.brandName}
            </button>
            <span className="text-[9px] tracking-[0.22em] uppercase text-[#8C8980]">
              <EditableText
                value={content.brandSubtitle}
                editMode={editMode}
                onChange={(val) =>
                  persistContent({ ...content, brandSubtitle: val })
                }
              />
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
              href={content.contactPage.instagramUrl}
              onClick={(e) => e.preventDefault()}
              aria-label="Instagram"
              className="p-1.5 text-[#8C8980] hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a
              href={content.contactPage.vimeoUrl}
              onClick={(e) => e.preventDefault()}
              aria-label="Vimeo"
              className="p-1.5 text-[#8C8980] hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors"
            >
              <Film className="w-3.5 h-3.5" />
            </a>
            <a
              href={`mailto:${content.contactPage.email}`}
              aria-label="Email"
              className="p-1.5 text-[#8C8980] hover:bg-[#171715] hover:text-[#F4F2ED] transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
            </a>
            <span
              onDoubleClick={() => {
                if (isAdminUnlocked) {
                  setEditMode((prev) => !prev);
                } else {
                  setShowAdminLoginModal(true);
                }
              }}
              title="Double-click for Studio Admin"
              className="select-none cursor-default"
            >
              &copy; 2025 {content.brandName}
            </span>
          </div>
        </div>

        {/* Depth / Overlay Strip */}
        <div className="dark-stone-banner border-t border-[#B7A28B]/40 py-3.5 px-5 sm:px-10">
          <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[9px] tracking-[0.26em] uppercase text-[#B7A28B]">
            <span>
              {content.brandName} &mdash; {content.brandSubtitle}
            </span>
            <span className="text-[#F4F2ED]/80">
              FASHION &amp; EDITORIAL / PRODUCT / ARCHITECTURE / ADVERTISING /
              DOCUMENTARY
            </span>
          </div>
        </div>
      </footer>

      {/* STUDIO ADMIN PASSWORD LOGIN MODAL */}
      {showAdminLoginModal && (
        <div
          onClick={() => setShowAdminLoginModal(false)}
          className="fixed inset-0 z-50 bg-[#171715]/90 flex items-center justify-center p-4 sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-sm w-full bg-[#F4F2ED] text-[#373632] border border-[#B7A28B] p-6 sm:p-8 space-y-5 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#B7A28B]/40 pb-3">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-[#373632]" />
                <h3 className="font-serif text-xl text-[#373632]">
                  Studio Admin Access
                </h3>
              </div>
              <button
                onClick={() => setShowAdminLoginModal(false)}
                className="text-[#8C8980] hover:text-[#171715]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
              <p className="text-[#8C8980] leading-relaxed">
                Enter your studio admin password to unlock inline website
                editing and media uploads.
              </p>

              <div>
                <label className="block text-[10px] tracking-[0.18em] uppercase text-[#8C8980] mb-1.5">
                  Admin Password
                </label>
                <input
                  type="password"
                  required
                  autoFocus
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  placeholder="Enter password..."
                  className="w-full bg-[#D8D5CD]/45 border border-[#B7A28B]/60 px-3 py-2.5 text-[#373632] focus:outline-none focus:border-[#171715]"
                />
              </div>

              {adminAuthError && (
                <p className="text-[11px] text-red-700">{adminAuthError}</p>
              )}

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAdminLoginModal(false)}
                  className="px-4 py-2 text-[10px] tracking-widest uppercase text-[#8C8980]"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#171715] text-[#F4F2ED] hover:bg-[#373632] text-[10px] tracking-widest uppercase"
                >
                  UNLOCK EDITOR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD NEW PROJECT MODAL */}
      {showAddProjectModal && (
        <div
          onClick={() => setShowAddProjectModal(false)}
          className="fixed inset-0 z-50 bg-[#171715]/90 flex items-center justify-center p-4 sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-lg w-full bg-[#F4F2ED] text-[#373632] border border-[#B7A28B] p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-[#B7A28B]/40 pb-3">
              <h3 className="font-serif text-2xl text-[#373632]">
                Add New Project / Film
              </h3>
              <button
                onClick={() => setShowAddProjectModal(false)}
                className="text-[#8C8980] hover:text-[#171715]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] tracking-[0.18em] uppercase text-[#8C8980] mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={newProjectForm.title}
                  onChange={(e) =>
                    setNewProjectForm({
                      ...newProjectForm,
                      title: e.target.value,
                    })
                  }
                  placeholder="e.g. Echoes of Monochrome"
                  className="w-full bg-[#D8D5CD]/45 border border-[#B7A28B]/60 px-3 py-2 text-[#373632]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-[0.18em] uppercase text-[#8C8980] mb-1">
                    Type
                  </label>
                  <select
                    value={newProjectForm.type}
                    onChange={(e) =>
                      setNewProjectForm({
                        ...newProjectForm,
                        type: e.target.value as "photography" | "film",
                      })
                    }
                    className="w-full bg-[#D8D5CD]/45 border border-[#B7A28B]/60 px-3 py-2 text-[#373632]"
                  >
                    <option value="photography">Photography</option>
                    <option value="film">Film / Video</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] tracking-[0.18em] uppercase text-[#8C8980] mb-1">
                    Category Filter
                  </label>
                  <select
                    value={newProjectForm.categorySlug}
                    onChange={(e) =>
                      setNewProjectForm({
                        ...newProjectForm,
                        categorySlug: e.target.value as CategorySlug,
                        category: e.target.selectedOptions[0].text.toUpperCase(),
                      })
                    }
                    className="w-full bg-[#D8D5CD]/45 border border-[#B7A28B]/60 px-3 py-2 text-[#373632]"
                  >
                    <option value="fashion">Fashion &amp; Editorial</option>
                    <option value="hospitality">Product</option>
                    <option value="architecture">Architecture</option>
                    <option value="food">Advertising</option>
                    <option value="documentary">Documentary</option>
                    <option value="film-fashion">Fashion Film</option>
                    <option value="film-advertising">Advertising Film</option>
                    <option value="film-documentary">Documentary Film</option>
                    <option value="film-experimental">Experimental Film</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-[0.18em] uppercase text-[#8C8980] mb-1">
                    Year
                  </label>
                  <input
                    type="text"
                    value={newProjectForm.year}
                    onChange={(e) =>
                      setNewProjectForm({
                        ...newProjectForm,
                        year: e.target.value,
                      })
                    }
                    className="w-full bg-[#D8D5CD]/45 border border-[#B7A28B]/60 px-3 py-2 text-[#373632]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.18em] uppercase text-[#8C8980] mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    value={newProjectForm.role}
                    onChange={(e) =>
                      setNewProjectForm({
                        ...newProjectForm,
                        role: e.target.value,
                      })
                    }
                    className="w-full bg-[#D8D5CD]/45 border border-[#B7A28B]/60 px-3 py-2 text-[#373632]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.18em] uppercase text-[#8C8980] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newProjectForm.description}
                  onChange={(e) =>
                    setNewProjectForm({
                      ...newProjectForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full bg-[#D8D5CD]/45 border border-[#B7A28B]/60 px-3 py-2 text-[#373632]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] tracking-[0.18em] uppercase text-[#8C8980]">
                  Cover Image or Video (Upload or Vimeo/YouTube Link)
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      triggerFileUpload((url, isVid) => {
                        if (isVid) {
                          setNewProjectForm({
                            ...newProjectForm,
                            videoUrl: url,
                            type: "film",
                          });
                        } else {
                          setNewProjectForm({
                            ...newProjectForm,
                            coverImage: url,
                          });
                        }
                      })
                    }
                    className="px-4 py-2 bg-[#171715] text-[#F4F2ED] text-[10px] tracking-widest uppercase inline-flex items-center space-x-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>UPLOAD IMAGE / CLIP</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      promptVideoUrl((url) => {
                        setNewProjectForm({
                          ...newProjectForm,
                          videoUrl: url,
                          type: "film",
                        });
                      }, newProjectForm.videoUrl)
                    }
                    className="px-4 py-2 bg-[#373632] text-[#F4F2ED] text-[10px] tracking-widest uppercase inline-flex items-center space-x-1.5"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    <span>PASTE VIMEO / YOUTUBE URL</span>
                  </button>
                  {newProjectForm.videoUrl && (
                    <span className="text-[10px] text-[#373632] underline">
                      Video attached
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-[#B7A28B]/40">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="px-4 py-2 text-[10px] tracking-widest uppercase text-[#8C8980]"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#373632] text-[#F4F2ED] hover:bg-[#171715] text-[10px] tracking-widest uppercase"
                >
                  CREATE PROJECT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LIGHTBOX FOR HIGH-RES STILL PHOTOGRAPHY */}
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

      {/* FILM SCREENING MODAL */}
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
              {(() => {
                const parsedVid = parseVideoEmbed(activeVideoModal.videoUrl);
                if (parsedVid?.kind === "iframe") {
                  return (
                    <iframe
                      src={parsedVid.src}
                      title={activeVideoModal.title}
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0 bg-black"
                    />
                  );
                }
                if (parsedVid?.kind === "native") {
                  return (
                    <video
                      src={parsedVid.src}
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full object-contain bg-black"
                    />
                  );
                }
                return (
                  <>
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
                      {isAdminUnlocked && (
                        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                          <button
                            onClick={() =>
                              triggerFileUpload((url) => {
                                const next = content.projects.map((p) =>
                                  p.id === activeVideoModal.id
                                    ? { ...p, videoUrl: url }
                                    : p
                                );
                                persistContent({ ...content, projects: next });
                                setActiveVideoModal({
                                  ...activeVideoModal,
                                  videoUrl: url,
                                });
                              })
                            }
                            className="px-4 py-2 bg-[#B7A28B] text-[#171715] text-[10px] tracking-widest uppercase font-medium inline-flex items-center space-x-1.5"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>UPLOAD VIDEO CLIP</span>
                          </button>
                          <button
                            onClick={() =>
                              promptVideoUrl((url) => {
                                const next = content.projects.map((p) =>
                                  p.id === activeVideoModal.id
                                    ? { ...p, videoUrl: url }
                                    : p
                                );
                                persistContent({ ...content, projects: next });
                                setActiveVideoModal({
                                  ...activeVideoModal,
                                  videoUrl: url,
                                });
                              }, activeVideoModal.videoUrl)
                            }
                            className="px-4 py-2 bg-[#171715] text-[#F4F2ED] border border-[#B7A28B] text-[10px] tracking-widest uppercase font-medium inline-flex items-center space-x-1.5"
                          >
                            <Link2 className="w-3.5 h-3.5" />
                            <span>PASTE VIMEO / YOUTUBE URL</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
