"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Youtube,
  Plus,
  Trash2,
  Edit3,
  MoveUp,
  MoveDown,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Eye,
  EyeOff,
  Film,
  X,
  Play,
  RotateCcw,
  Check,
  AlertCircle,
  Clock,
  Layers,
  ArrowUpRight,
  SlidersHorizontal,
  DollarSign,
  Lock,
  LogOut,
  Smartphone,
  ChevronDown,
} from "lucide-react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Project, CATEGORIES } from "@/data/projects";
import { AdminVideoPreviewModal } from "@/components/admin-video-preview-modal";
import { AdminLogin } from "@/components/admin-login";
import {
  PricingPlan,
  PricingSettings,
  DEFAULT_PRICING_SETTINGS,
  formatPlanPrice,
} from "@/data/pricing";

const EDITORIAL_CATEGORIES = [
  "Shorts & Reels",
  "Talking Head",
  "Motion Graphics",
  "YouTube Longform",
  "Commercial",
] as const;

const CURRENCY_PRESETS = [
  { symbol: "$", code: "USD", label: "$ USD (Dollar — Default)" },
  { symbol: "€", code: "EUR", label: "€ EUR (Euro)" },
  { symbol: "£", code: "GBP", label: "£ GBP (Pound)" },
  { symbol: "₹", code: "INR", label: "₹ INR (Rupee)" },
  { symbol: "C$", code: "CAD", label: "C$ CAD (Canadian Dollar)" },
  { symbol: "A$", code: "AUD", label: "A$ AUD (Australian Dollar)" },
  { symbol: "AED", code: "AED", label: "AED (UAE Dirham)" },
];

interface AdminDashboardClientProps {
  token?: string;
}

export default function AdminDashboardClient({ token = "" }: AdminDashboardClientProps = {}) {
  // Firebase Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  const activeAuthToken = sessionToken || token;

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Quick-Add YouTube URL Form State
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [fetchingMeta, setFetchingMeta] = useState(false);
  const [metaError, setMetaError] = useState("");

  // Extracted Metadata State
  const [newProject, setNewProject] = useState<{
    youtubeId: string;
    title: string;
    clientContext: string;
    category: string;
    aspectRatio: "16:9" | "9:16";
    duration: string;
    thumbnail: string;
    fallbackThumbnail: string;
    description: string;
    pacingStyle: string;
    featured: boolean;
  } | null>(null);

  // Edit Project Modal State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // Video Preview Modal
  const [previewProject, setPreviewProject] = useState<Project | null>(null);

  // Active Tab: "projects" | "hero" | "retention" | "beforeAfter" | "pricing"
  const [activeAdminTab, setActiveAdminTab] = useState<"projects" | "hero" | "retention" | "beforeAfter" | "pricing">("projects");

  // Retention Reels State (3 Slots)
  const [retentionReelIds, setRetentionReelIds] = useState<string[]>([
    "proj-1793179416247-16uu5",
    "proj-1793243601981-angsz",
    "proj-1793243623115-h32uv",
  ]);
  const [savingRetention, setSavingRetention] = useState(false);

  // Showcase Settings State
  const [heroForm, setHeroForm] = useState({
    youtubeUrl: "https://youtube.com/shorts/ASX9EFdHez0?feature=share",
    youtubeId: "ASX9EFdHez0",
    title: "Motion-1",
    headline: "WE EDIT FOR",
    headlineHighlight: "RETENTION.",
    subheadline: "High-impact video editing for creators and brands. Fast cuts, clean sound, and motion graphics that keep viewers watching.",
    thumbnail: "https://i.ytimg.com/vi/ASX9EFdHez0/maxresdefault.jpg",
  });

  const [beforeAfterForm, setBeforeAfterForm] = useState({
    headline: "SAME FOOTAGE.",
    headlineHighlight: "different impact.",
    subheadline: "Drag the scrubber. Left is raw flat camera log with dead air. Right is the mastered editorial cut.",
    beforeImage: "/images/projects/reel-5.jpg",
    afterImage: "/images/projects/reel-5.jpg",
    beforeLabel: "RAW LOG // CLIP_0042.MOV",
    afterLabel: "FINAL MASTER // KODAK 2383",
    beforeNotice: "DEAD AIR DETECTED: 00:00:02:14",
    footerNote: "Editing isn't adding clutter. It is removing friction from the viewer's attention.",
  });
  const [previewSplit, setPreviewSplit] = useState(50);
  const [savingSettings, setSavingSettings] = useState(false);
  const [fetchingHeroMeta, setFetchingHeroMeta] = useState(false);

  // Pricing Form State
  const [pricingForm, setPricingForm] = useState<PricingSettings>(DEFAULT_PRICING_SETTINGS);
  const [newFeatureInputs, setNewFeatureInputs] = useState<{ [planId: string]: string }>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 4000);
  };

  // Listen to Firebase Authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken();
          setSessionToken(idToken);
          setAdminEmail(user.email);
          setIsAuthenticated(true);
        } catch (err) {
          console.error("Failed to get Firebase auth token:", err);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
        setSessionToken(null);
        setAdminEmail(null);
      }
      setCheckingSession(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = (newToken: string, email: string) => {
    setSessionToken(newToken);
    setAdminEmail(email);
    setIsAuthenticated(true);
    showToast(`Access granted. Welcome, ${email}`);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign out error:", err);
    }
    setIsAuthenticated(false);
    setSessionToken(null);
    setAdminEmail(null);
    showToast("Signed out. Admin locked.");
  };

  // Fetch projects from API
  const loadProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        headers: { "x-admin-token": activeAuthToken },
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      } else {
        showError("Failed to fetch current projects");
      }
    } catch {
      showError("Connection error while loading projects");
    } finally {
      setLoading(false);
    }
  }, [activeAuthToken]);

  // Fetch Showcase Settings (Hero, Before/After & Pricing)
  const loadSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        if (data.hero) {
          setHeroForm((prev) => ({ ...prev, ...data.hero }));
        }
        if (data.retentionReels?.reelIds && Array.isArray(data.retentionReels.reelIds)) {
          setRetentionReelIds(data.retentionReels.reelIds.slice(0, 3));
        }
        if (data.beforeAfter) {
          setBeforeAfterForm((prev) => ({ ...prev, ...data.beforeAfter }));
        }
        if (data.pricing) {
          setPricingForm({
            ...DEFAULT_PRICING_SETTINGS,
            ...data.pricing,
            plans:
              data.pricing.plans && Array.isArray(data.pricing.plans) && data.pricing.plans.length > 0
                ? data.pricing.plans
                : DEFAULT_PRICING_SETTINGS.plans,
          });
        }
      }
    } catch {
      // Keep initial
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadProjects();
      loadSettings();
    }
  }, [isAuthenticated, loadProjects, loadSettings]);

  // Fetch Hero Video Meta
  const handleFetchHeroMeta = async () => {
    if (!heroForm.youtubeUrl.trim()) return;
    setFetchingHeroMeta(true);
    try {
      const res = await fetch(
        `/api/youtube-meta?url=${encodeURIComponent(heroForm.youtubeUrl.trim())}`,
        { headers: { "x-admin-token": activeAuthToken } }
      );
      if (res.ok) {
        const data = await res.json();
        setHeroForm((prev) => ({
          ...prev,
          youtubeId: data.videoId || prev.youtubeId,
          title: data.title || prev.title,
          thumbnail: data.thumbnailUrl || prev.thumbnail,
        }));
        showToast("Extracted Hero YouTube metadata");
      } else {
        showError("Could not inspect YouTube URL");
      }
    } catch {
      showError("Connection error while inspecting video");
    } finally {
      setFetchingHeroMeta(false);
    }
  };

  // Save Hero Showreel Settings
  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": activeAuthToken,
        },
        body: JSON.stringify({ hero: heroForm }),
      });
      if (res.ok) {
        showToast("Hero video & showcase settings updated on live portfolio");
        await loadSettings();
      } else {
        showError("Failed to save hero settings");
      }
    } catch {
      showError("Error saving hero settings");
    } finally {
      setSavingSettings(false);
    }
  };

  // Save Retention Reels (3 Slots)
  const handleSaveRetentionReels = async () => {
    setSavingRetention(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": activeAuthToken,
        },
        body: JSON.stringify({
          retentionReels: { reelIds: retentionReelIds.slice(0, 3) },
        }),
      });
      if (res.ok) {
        showToast("High-Retention 3 reels updated on live portfolio");
        await loadSettings();
      } else {
        showError("Failed to save retention reels");
      }
    } catch {
      showError("Error saving retention reels");
    } finally {
      setSavingRetention(false);
    }
  };

  // Save Before/After Settings
  const handleSaveBeforeAfter = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": activeAuthToken,
        },
        body: JSON.stringify({ beforeAfter: beforeAfterForm }),
      });
      if (res.ok) {
        showToast("Before/After comparison updated on live portfolio");
        await loadSettings();
      } else {
        showError("Failed to save comparison settings");
      }
    } catch {
      showError("Error saving comparison settings");
    } finally {
      setSavingSettings(false);
    }
  };

  // Save Pricing Settings
  const handleSavePricing = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": activeAuthToken,
        },
        body: JSON.stringify({ pricing: pricingForm }),
      });
      if (res.ok) {
        showToast("Pricing and currency settings updated on live portfolio");
        await loadSettings();
      } else {
        showError("Failed to save pricing settings");
      }
    } catch {
      showError("Error saving pricing settings");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleUpdatePlan = (index: number, updates: Partial<PricingPlan>) => {
    setPricingForm((prev) => {
      const updatedPlans = [...prev.plans];
      updatedPlans[index] = { ...updatedPlans[index], ...updates };
      return { ...prev, plans: updatedPlans };
    });
  };

  const handleTogglePlanPopular = (index: number) => {
    setPricingForm((prev) => {
      const updatedPlans = prev.plans.map((p, i) => ({
        ...p,
        popular: i === index ? !p.popular : false,
      }));
      return { ...prev, plans: updatedPlans };
    });
  };

  const handleAddFeatureToPlan = (index: number) => {
    const plan = pricingForm.plans[index];
    const text = (newFeatureInputs[plan.id] || "").trim();
    if (!text) return;
    setPricingForm((prev) => {
      const updatedPlans = [...prev.plans];
      updatedPlans[index] = {
        ...updatedPlans[index],
        features: [...updatedPlans[index].features, text],
      };
      return { ...prev, plans: updatedPlans };
    });
    setNewFeatureInputs((prev) => ({ ...prev, [plan.id]: "" }));
  };

  const handleRemoveFeatureFromPlan = (planIndex: number, featureIndex: number) => {
    setPricingForm((prev) => {
      const updatedPlans = [...prev.plans];
      const newFeatures = [...updatedPlans[planIndex].features];
      newFeatures.splice(featureIndex, 1);
      updatedPlans[planIndex] = {
        ...updatedPlans[planIndex],
        features: newFeatures,
      };
      return { ...prev, plans: updatedPlans };
    });
  };

  const handleMovePlan = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= pricingForm.plans.length) return;
    setPricingForm((prev) => {
      const updatedPlans = [...prev.plans];
      const temp = updatedPlans[index];
      updatedPlans[index] = updatedPlans[targetIndex];
      updatedPlans[targetIndex] = temp;
      return { ...prev, plans: updatedPlans };
    });
  };

  const handleAddNewPlan = () => {
    const newId = `plan-${Date.now()}`;
    const newPlan: PricingPlan = {
      id: newId,
      name: "ENTERPRISE",
      volume: "CUSTOM VOLUME",
      price: "CUSTOM",
      cadence: "/ month",
      popular: false,
      tagline: "Tailored editing retainer for scale.",
      features: [
        "Dedicated senior lead video editor",
        "Unlimited revisions & same-day turnaround",
        "Direct Slack & WhatsApp channel",
      ],
      ctaText: "Discuss Custom Plan",
      whatsappMessage: "Hi Zenith! I want to discuss a custom package for my brand.",
    };
    setPricingForm((prev) => ({
      ...prev,
      plans: [...prev.plans, newPlan],
    }));
  };

  const handleRemovePlan = (index: number) => {
    if (pricingForm.plans.length <= 1) {
      showError("You must keep at least one pricing plan.");
      return;
    }
    setPricingForm((prev) => {
      const updatedPlans = prev.plans.filter((_, i) => i !== index);
      return { ...prev, plans: updatedPlans };
    });
  };

  const handleResetPricingDefaults = () => {
    if (confirm("Reset all pricing packages and currency to studio defaults ($)?")) {
      setPricingForm(DEFAULT_PRICING_SETTINGS);
      showToast("Reset pricing plans to defaults (Click Save to apply)");
    }
  };

  const handleAutoFillWhatsApp = (index: number) => {
    const plan = pricingForm.plans[index];
    const formattedPrice = formatPlanPrice(plan.price, pricingForm.currencySymbol);
    const msg = `Hi Zenith! I want to start a project with the ${plan.name} package (${plan.volume} / ${formattedPrice}).`;
    handleUpdatePlan(index, { whatsappMessage: msg });
    showToast("WhatsApp inquiry message updated");
  };

  // Fetch YouTube Metadata via oEmbed API endpoint
  const handleFetchYoutubeMeta = async (urlToFetch?: string) => {
    const targetUrl = urlToFetch || youtubeUrl;
    if (!targetUrl.trim()) return;

    setFetchingMeta(true);
    setMetaError("");

    try {
      const res = await fetch(
        `/api/youtube-meta?url=${encodeURIComponent(targetUrl.trim())}`,
        {
          headers: { "x-admin-token": activeAuthToken },
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setMetaError(data.error || "Unable to extract YouTube video metadata");
        return;
      }

      let detectedCategory = data.isShorts ? "Shorts & Reels" : "YouTube Longform";
      const titleLower = (data.title || "").toLowerCase();
      if (
        titleLower.includes("talking head") ||
        titleLower.includes("podcast") ||
        titleLower.includes("interview") ||
        titleLower.includes("talking")
      ) {
        detectedCategory = "Talking Head";
      } else if (
        titleLower.includes("motion") ||
        titleLower.includes("animation") ||
        titleLower.includes("vfx") ||
        titleLower.includes("minimal")
      ) {
        detectedCategory = "Motion Graphics";
      }

      setNewProject({
        youtubeId: data.videoId,
        title: data.title || "Untitled Video Cut",
        clientContext: data.authorName || "Creator / Brand",
        category: detectedCategory,
        aspectRatio: data.aspectRatio || (data.isShorts ? "9:16" : "16:9"),
        duration: data.isShorts ? "0:30" : "1:00",
        thumbnail: data.thumbnailUrl,
        fallbackThumbnail: data.fallbackThumbnailUrl,
        description: `High-retention editorial cut engineered for ${data.authorName || "the creator"}.`,
        pacingStyle: data.isShorts ? "0.8s avg cut rhythm / High Velocity" : "1.2s avg cut rhythm",
        featured: false,
      });

      showToast("YouTube video metadata extracted successfully");
    } catch {
      setMetaError("Network error while connecting to YouTube service");
    } finally {
      setFetchingMeta(false);
    }
  };

  // Publish New Project
  const handlePublishProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject || !newProject.youtubeId) return;

    setPublishing(true);
    try {
      const payload = {
        title: newProject.title,
        category: newProject.category,
        clientContext: newProject.clientContext,
        description: newProject.description,
        duration: newProject.duration,
        aspectRatio: newProject.aspectRatio,
        videoType: "youtube",
        youtubeId: newProject.youtubeId,
        thumbnail: newProject.thumbnail,
        videoSrc: `https://www.youtube.com/watch?v=${newProject.youtubeId}`,
        pacingStyle: newProject.pacingStyle,
        featured: newProject.featured,
        published: true,
      };

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": activeAuthToken,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        showError(err.error || "Failed to publish video project");
        return;
      }

      showToast(`Published "${newProject.title}" to live portfolio!`);
      setNewProject(null);
      setYoutubeUrl("");
      await loadProjects();
    } catch {
      showError("Error publishing project");
    } finally {
      setPublishing(false);
    }
  };

  // Reorder Projects Up/Down
  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const updated = [...projects];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    setProjects(updated);

    try {
      await fetch("/api/projects/reorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": activeAuthToken,
        },
        body: JSON.stringify({ orderedIds: updated.map((p) => p.id) }),
      });
      showToast("Order synced with portfolio");
    } catch {
      showError("Failed to persist reorder");
      await loadProjects();
    }
  };

  // Toggle Featured Status
  const handleToggleFeatured = async (project: Project) => {
    const newFeatured = !project.featured;
    setProjects((prev) =>
      prev.map((p) => (p.id === project.id ? { ...p, featured: newFeatured } : p))
    );

    try {
      await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": activeAuthToken,
        },
        body: JSON.stringify({ featured: newFeatured }),
      });
      showToast(newFeatured ? "Marked as Featured on Home" : "Removed from Featured");
    } catch {
      showError("Failed to update featured state");
      await loadProjects();
    }
  };

  // Toggle Public Visibility (Published on Live Website vs Draft / Admin Only)
  const handleTogglePublish = async (project: Project) => {
    const newPublished = project.published === false ? true : false;
    setProjects((prev) =>
      prev.map((p) => (p.id === project.id ? { ...p, published: newPublished } : p))
    );
    if (previewProject && previewProject.id === project.id) {
      setPreviewProject({ ...previewProject, published: newPublished });
    }

    try {
      await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": activeAuthToken,
        },
        body: JSON.stringify({ published: newPublished }),
      });
      showToast(
        newPublished
          ? `"${project.title}" is now LIVE on public website`
          : `"${project.title}" is now HIDDEN (Draft / Admin Only)`
      );
    } catch {
      showError("Failed to update visibility state");
      await loadProjects();
    }
  };

  // Quick Inline Category Change (Instantly updates project filter category)
  const handleQuickCategoryChange = async (project: Project, newCategory: string) => {
    if (project.category === newCategory) return;
    setProjects((prev) =>
      prev.map((p) => (p.id === project.id ? { ...p, category: newCategory } : p))
    );
    if (previewProject && previewProject.id === project.id) {
      setPreviewProject({ ...previewProject, category: newCategory });
    }

    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": activeAuthToken,
        },
        body: JSON.stringify({ category: newCategory }),
      });
      if (res.ok) {
        showToast(`Category updated to "${newCategory}" for "${project.title}"`);
      } else {
        showError("Failed to update category");
        await loadProjects();
      }
    } catch {
      showError("Failed to update category");
      await loadProjects();
    }
  };

  // Delete Project
  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}" from the portfolio?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: { "x-admin-token": activeAuthToken },
      });

      if (res.ok) {
        showToast("Project removed from database");
        setProjects((prev) => prev.filter((p) => p.id !== id));
      } else {
        showError("Failed to delete project");
      }
    } catch {
      showError("Error deleting project");
    }
  };

  // Save Existing Project Edits
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    setSavingEdit(true);
    try {
      const res = await fetch(`/api/projects/${editingProject.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": activeAuthToken,
        },
        body: JSON.stringify(editingProject),
      });

      if (res.ok) {
        showToast("Project details saved");
        setEditingProject(null);
        await loadProjects();
      } else {
        showError("Failed to save project edits");
      }
    } catch {
      showError("Error updating project");
    } finally {
      setSavingEdit(false);
    }
  };

  // Reset to Defaults
  const handleResetToDefaults = async () => {
    if (
      !window.confirm(
        "Reset portfolio database to showcase default cuts? This will reload initial commercial projects."
      )
    ) {
      return;
    }

    try {
      const res = await fetch("/api/projects/reset", {
        method: "POST",
        headers: { "x-admin-token": activeAuthToken },
      });

      if (res.ok) {
        showToast("Database restored to showcase defaults");
        await loadProjects();
      } else {
        showError("Failed to reset database");
      }
    } catch {
      showError("Error resetting database");
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center font-mono text-xs text-white/50 space-y-3 selection:bg-[#D4AF37]">
        <div className="w-6 h-6 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin" />
        <p className="uppercase tracking-widest text-[11px] text-[#D4AF37]">Verifying Vault Authorization...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-[#F4F4F6] selection:bg-[#D4AF37] selection:text-[#09090B] relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-sm bg-[#121216] border border-[#D4AF37] text-white shadow-2xl flex items-center gap-2 font-mono text-xs animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-sm bg-[#121216] border border-red-500 text-white shadow-2xl flex items-center gap-2 font-mono text-xs animate-in fade-in slide-in-from-bottom-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* HEADER BAR */}
      <header className="sticky top-0 z-40 bg-[#09090B]/95 backdrop-blur-md border-b border-white/[0.07] px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <h1 className="font-display font-bold text-base tracking-tight text-white uppercase">
              ZENITH CMS <span className="text-white/40">{"//"} SECRET VAULT</span>
            </h1>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-sm bg-[#121216] border border-white/[0.07] text-[10px] font-mono text-[#D4AF37]">
              AUTH LOCKED
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            {adminEmail && (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm bg-[#121216] border border-white/[0.08] text-[11px] text-white/70">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{adminEmail}</span>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="px-2.5 py-1.5 rounded-sm bg-[#121216] hover:bg-red-500/10 border border-white/[0.08] hover:border-red-500/30 text-white/60 hover:text-red-400 transition-colors flex items-center gap-1.5 text-[11px]"
              title="Lock Vault & Log out"
            >
              <Lock className="w-3 h-3 text-[#D4AF37]" />
              <span>Lock Vault</span>
            </button>

            <button
              onClick={handleResetToDefaults}
              className="px-3 py-1.5 rounded-sm bg-[#121216] hover:bg-[#18181E] border border-white/[0.08] text-white/60 hover:text-white transition-colors flex items-center gap-1.5 text-[11px]"
              title="Reset portfolio to showcase defaults"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Defaults</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-sm bg-[#D4AF37] text-[#09090B] font-bold hover:bg-[#F59E0B] transition-colors flex items-center gap-1 text-[11px]"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </header>

      {/* CMS NAVIGATION TABS */}
      <div className="bg-[#09090B] border-b border-white/[0.07] px-6">
        <div className="max-w-[1400px] mx-auto flex items-center gap-2 overflow-x-auto py-3">
          <button
            type="button"
            onClick={() => setActiveAdminTab("projects")}
            className={`px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeAdminTab === "projects"
                ? "bg-[#D4AF37] text-[#09090B] font-bold shadow-md"
                : "bg-[#121216] text-white/60 hover:text-white border border-white/[0.07]"
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Reels & Video Cuts ({projects.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAdminTab("hero")}
            className={`px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeAdminTab === "hero"
                ? "bg-[#D4AF37] text-[#09090B] font-bold shadow-md"
                : "bg-[#121216] text-white/60 hover:text-white border border-white/[0.07]"
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Hero Showreel Video</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAdminTab("retention")}
            className={`px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeAdminTab === "retention"
                ? "bg-[#D4AF37] text-[#09090B] font-bold shadow-md"
                : "bg-[#121216] text-white/60 hover:text-white border border-white/[0.07]"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>High-Retention Strip (3 Reels)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAdminTab("beforeAfter")}
            className={`px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeAdminTab === "beforeAfter"
                ? "bg-[#D4AF37] text-[#09090B] font-bold shadow-md"
                : "bg-[#121216] text-white/60 hover:text-white border border-white/[0.07]"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Before / After Comparison</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAdminTab("pricing")}
            className={`px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeAdminTab === "pricing"
                ? "bg-[#D4AF37] text-[#09090B] font-bold shadow-md"
                : "bg-[#121216] text-white/60 hover:text-white border border-white/[0.07]"
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Pricing & Plans ({pricingForm.plans.length})</span>
          </button>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-5 sm:px-8 py-10 space-y-12">
        {activeAdminTab === "projects" && (
          <>
            {/* SECTION 1: QUICK-ADD UNLISTED YOUTUBE BAR */}
            <section className="bg-[#121216] border border-white/[0.07] rounded-xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#D4AF37] uppercase tracking-[0.2em] mb-2 font-semibold">
            <Youtube className="w-3.5 h-3.5" />
            <span>UNLISTED YOUTUBE PUBLISHING PIPELINE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-[#F4F4F6] uppercase tracking-tight mb-2">
            Publish New Video Edit
          </h2>
          <p className="text-xs text-white/60 font-sans max-w-2xl mb-6 leading-relaxed">
            Paste any Public or Unlisted YouTube URL (Watch, Shorts, Embed, or Shortlink). Zenith will automatically extract the video ID, fetch public metadata, and stage the edit for 1-click publishing.
          </p>

          {/* URL Input Bar */}
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            <div className="relative flex-1">
              <Youtube className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => {
                  setYoutubeUrl(e.target.value);
                  setMetaError("");
                }}
                onPaste={(e) => {
                  const pasted = e.clipboardData.getData("text");
                  setTimeout(() => handleFetchYoutubeMeta(pasted), 50);
                }}
                placeholder="Paste YouTube Link (e.g., https://www.youtube.com/watch?v=... or https://youtube.com/shorts/...)"
                className="w-full pl-10 pr-4 py-3 rounded-sm bg-[#09090B] border border-white/[0.08] text-white placeholder-white/30 text-xs font-mono focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>

            <button
              type="button"
              onClick={() => handleFetchYoutubeMeta()}
              disabled={fetchingMeta || !youtubeUrl.trim()}
              className="px-6 py-3 rounded-sm bg-[#D4AF37] text-[#09090B] font-bold text-xs uppercase tracking-wider hover:bg-[#F59E0B] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {fetchingMeta ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Fetching Meta...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Inspect Video</span>
                </>
              )}
            </button>
          </div>

          {metaError && (
            <p className="mt-3 text-xs font-mono text-red-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{metaError}</span>
            </p>
          )}

          {/* STAGED VIDEO PREVIEW & PUBLISH FORM */}
          {newProject && (
            <form onSubmit={handlePublishProject} className="mt-8 pt-8 border-t border-white/[0.07] space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Media Preview Column */}
                <div className="lg:col-span-4 space-y-3">
                  <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
                    STAGED MEDIA PREVIEW ({newProject.aspectRatio})
                  </div>

                  <div
                    className={`relative rounded-xl overflow-hidden bg-black border border-white/[0.08] shadow-lg ${
                      newProject.aspectRatio === "9:16" ? "aspect-[9/16] max-w-[240px] mx-auto" : "aspect-[16/9]"
                    }`}
                  >
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${newProject.youtubeId}?autoplay=0&rel=0&modestbranding=1`}
                      title={newProject.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>

                  <div className="text-[10px] font-mono text-white/40 flex justify-between px-1">
                    <span>ID: {newProject.youtubeId}</span>
                    <span className="text-[#D4AF37] font-semibold">{newProject.aspectRatio}</span>
                  </div>
                </div>

                {/* Form Fields Column */}
                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-mono text-white/50 uppercase mb-1">
                      Project Title
                    </label>
                    <input
                      type="text"
                      required
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-sm bg-[#09090B] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* Category */}
                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[10px] font-mono text-white/50 uppercase">
                        Editorial Category & Filter Target
                      </label>
                      <span className="text-[10px] font-mono text-[#D4AF37]">
                        Active: {newProject.category}
                      </span>
                    </div>

                    {/* Quick Category Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {EDITORIAL_CATEGORIES.map((cat) => {
                        const isSelected =
                          newProject.category === cat ||
                          (cat === "Shorts & Reels" && newProject.category === "Short-Form / Reel");
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setNewProject({ ...newProject, category: cat })}
                            className={`px-3 py-1.5 rounded-sm text-[11px] font-mono uppercase tracking-wider transition-all border cursor-pointer ${
                              isSelected
                                ? "bg-[#D4AF37] text-black border-[#D4AF37] font-bold shadow-md shadow-[#D4AF37]/20"
                                : "bg-white/[0.04] text-white/70 border-white/[0.1] hover:border-[#D4AF37]/50 hover:text-white"
                            }`}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>

                    <select
                      value={newProject.category}
                      onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-sm bg-[#09090B] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                    >
                      {EDITORIAL_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Format */}
                  <div>
                    <label className="block text-[10px] font-mono text-white/50 uppercase mb-1">
                      Display Aspect Ratio
                    </label>
                    <select
                      value={newProject.aspectRatio}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          aspectRatio: e.target.value as "16:9" | "9:16",
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-sm bg-[#09090B] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                    >
                      <option value="16:9">16:9 Horizontal (YouTube / Cinema)</option>
                      <option value="9:16">9:16 Vertical (Shorts / Reels)</option>
                    </select>
                  </div>

                  {/* Client Context */}
                  <div>
                    <label className="block text-[10px] font-mono text-white/50 uppercase mb-1">
                      Client / Channel Name
                    </label>
                    <input
                      type="text"
                      value={newProject.clientContext}
                      onChange={(e) => setNewProject({ ...newProject, clientContext: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-sm bg-[#09090B] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-[10px] font-mono text-white/50 uppercase mb-1">
                      Duration (MM:SS)
                    </label>
                    <input
                      type="text"
                      value={newProject.duration}
                      onChange={(e) => setNewProject({ ...newProject, duration: e.target.value })}
                      placeholder="0:45"
                      className="w-full px-3.5 py-2.5 rounded-sm bg-[#09090B] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* Custom Thumbnail Override */}
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-mono text-white/50 uppercase mb-1">
                      Thumbnail URL (Auto-populated with high-res YouTube maxresdefault)
                    </label>
                    <input
                      type="text"
                      value={newProject.thumbnail}
                      onChange={(e) => setNewProject({ ...newProject, thumbnail: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-sm bg-[#09090B] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  {/* Description */}
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-mono text-white/50 uppercase mb-1">
                      Brief Narrative & Edit Overview
                    </label>
                    <textarea
                      rows={2}
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-sm bg-[#09090B] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37] resize-none"
                    />
                  </div>

                  {/* Featured Toggle */}
                  <div className="sm:col-span-2 flex items-center justify-between p-3.5 rounded-sm bg-[#09090B] border border-white/[0.07]">
                    <div>
                      <div className="text-xs font-mono font-semibold text-white uppercase">
                        Feature on Homepage Showreel
                      </div>
                      <div className="text-[10px] font-mono text-white/40">
                        Display this project directly in the primary Selected Work section.
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newProject.featured}
                        onChange={(e) => setNewProject({ ...newProject, featured: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#D4AF37]" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.07]">
                <button
                  type="button"
                  onClick={() => setNewProject(null)}
                  className="px-4 py-2.5 rounded-sm bg-transparent hover:bg-white/[0.05] border border-white/[0.08] text-white/60 text-xs font-mono uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={publishing}
                  className="px-6 py-2.5 rounded-sm bg-[#D4AF37] text-[#09090B] font-bold text-xs uppercase tracking-wider hover:bg-[#F59E0B] transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {publishing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Publishing to Portfolio...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Publish to Portfolio</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </section>

        {/* SECTION 2: LIVE PROJECT MANAGER */}
        <section className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.07]">
            <div>
              <div className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-[0.2em] mb-1 font-semibold">
                DATABASE REGISTRY
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-[#F4F4F6] uppercase tracking-tight">
                Live Portfolio Projects ({projects.length})
              </h2>
            </div>

            <button
              onClick={loadProjects}
              className="px-3 py-1.5 rounded-sm bg-[#121216] border border-white/[0.08] text-white/70 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Refresh</span>
            </button>
          </div>

          {loading ? (
            <div className="py-20 text-center text-xs font-mono text-white/40">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#D4AF37]" />
              LOADING STUDIO DATABASE...
            </div>
          ) : projects.length === 0 ? (
            <div className="py-20 text-center rounded-xl bg-[#121216] border border-white/[0.07] text-xs font-mono text-white/40">
              NO PROJECTS FOUND IN DATABASE. USE THE FORM ABOVE TO PUBLISH YOUR FIRST CUT.
            </div>
          ) : (
            <div className="divide-y divide-white/[0.07] border border-white/[0.07] rounded-xl bg-[#121216] overflow-hidden">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  {/* Left: Index & Thumbnail preview */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMove(index, "up")}
                        disabled={index === 0}
                        className="p-1 rounded bg-[#09090B] border border-white/[0.08] text-white/50 hover:text-white disabled:opacity-20"
                        title="Move Up"
                      >
                        <MoveUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(index, "down")}
                        disabled={index === projects.length - 1}
                        className="p-1 rounded bg-[#09090B] border border-white/[0.08] text-white/50 hover:text-white disabled:opacity-20"
                        title="Move Down"
                      >
                        <MoveDown className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-mono text-xs text-white/40 w-6 shrink-0">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* Thumbnail preview */}
                    <div
                      onClick={() => setPreviewProject(project)}
                      className="relative w-16 h-10 sm:w-20 sm:h-12 rounded-sm overflow-hidden bg-black border border-white/[0.08] shrink-0 cursor-pointer group"
                    >
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-3 h-3 text-[#D4AF37] fill-current" />
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {/* Quick Category Selector */}
                        <div className="relative inline-flex items-center">
                          <select
                            value={
                              project.category === "Short-Form / Reel"
                                ? "Shorts & Reels"
                                : project.category
                            }
                            onChange={(e) => handleQuickCategoryChange(project, e.target.value)}
                            className="appearance-none bg-[#09090B] hover:bg-[#18181b] border border-[#D4AF37]/50 hover:border-[#D4AF37] text-[10px] font-mono text-[#D4AF37] font-semibold uppercase px-2 py-0.5 pr-5 rounded-sm cursor-pointer transition-colors focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
                            title="Click to instantly change category"
                          >
                            {EDITORIAL_CATEGORIES.map((cat) => (
                              <option key={cat} value={cat} className="bg-[#121216] text-white">
                                {cat}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-2.5 h-2.5 text-[#D4AF37] absolute right-1.5 pointer-events-none opacity-80" />
                        </div>
                        <span className="text-[10px] font-mono text-white/40">
                          {project.aspectRatio} · {project.duration}
                        </span>
                        {project.published === false ? (
                          <span className="px-1.5 py-0.2 rounded-sm bg-amber-500/15 border border-amber-500/40 text-[9px] font-mono text-amber-400 font-semibold flex items-center gap-1">
                            <EyeOff className="w-2.5 h-2.5" />
                            <span>DRAFT / ADMIN ONLY</span>
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.2 rounded-sm bg-emerald-500/15 border border-emerald-500/30 text-[9px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>LIVE ON SITE</span>
                          </span>
                        )}
                        {project.featured && (
                          <span className="px-1.5 py-0.2 rounded-sm bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[9px] font-mono text-[#D4AF37] font-semibold">
                            ★ IN WORK SECTION
                          </span>
                        )}
                        {retentionReelIds.includes(project.id) && (
                          <span className="px-1.5 py-0.2 rounded-sm bg-purple-500/15 border border-purple-500/40 text-[9px] font-mono text-purple-300 font-semibold">
                            RETENTION #{retentionReelIds.indexOf(project.id) + 1}
                          </span>
                        )}
                      </div>
                      <h3 className="font-display font-semibold text-sm text-white truncate uppercase">
                        {project.title}
                      </h3>
                      {project.clientContext && (
                        <p className="text-[10px] font-mono text-white/40 truncate">
                          Client: {project.clientContext}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(project)}
                      className={`px-2.5 py-1.5 rounded-sm border text-[10px] font-mono uppercase transition-colors flex items-center gap-1.5 ${
                        project.published !== false
                          ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20"
                          : "bg-amber-500/10 border-amber-500/40 text-amber-400 hover:bg-amber-500/20"
                      }`}
                      title={
                        project.published !== false
                          ? "Live on website. Click to Hide (Draft / Admin Only)"
                          : "Hidden from public. Click to Make Live on website"
                      }
                    >
                      {project.published !== false ? (
                        <>
                          <Eye className="w-3 h-3" />
                          <span>Live</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          <span>Draft</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(project)}
                      className={`px-2.5 py-1.5 rounded-sm border text-[10px] font-mono uppercase transition-colors ${
                        project.featured
                          ? "bg-[#D4AF37]/15 border-[#D4AF37] text-[#D4AF37] font-semibold"
                          : "bg-[#09090B] border-white/[0.08] text-white/50 hover:text-white"
                      }`}
                      title="Toggle visibility in homepage Selected Work section"
                    >
                      {project.featured ? "★ In Work Section" : "☆ Add to Work"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingProject(project)}
                      className="p-1.5 rounded-sm bg-[#09090B] border border-white/[0.08] text-white/70 hover:text-white transition-colors"
                      title="Edit project"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreviewProject(project)}
                      className="p-1.5 rounded-sm bg-[#09090B] border border-white/[0.08] text-white/70 hover:text-white transition-colors"
                      title="Preview cinema modal"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(project.id, project.title)}
                      className="p-1.5 rounded-sm bg-[#09090B] border border-white/[0.08] text-red-400 hover:text-red-300 hover:border-red-400/40 transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </>
    )}

    {/* HERO SHOWREEL TAB */}
    {activeAdminTab === "hero" && (
      <section className="bg-[#121216] border border-white/[0.07] rounded-xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-2 text-[10px] font-mono text-[#D4AF37] uppercase tracking-[0.2em] mb-2 font-semibold">
          <Play className="w-3.5 h-3.5" />
          <span>FLAGSHIP HERO SHOWREEL CONFIGURATION</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-display font-bold text-[#F4F4F6] uppercase tracking-tight mb-2">
          Hero Section Video & Headline
        </h2>
        <p className="text-xs text-white/60 font-sans max-w-2xl mb-8 leading-relaxed">
          Configure the primary video showreel embedded in the hero section of your portfolio. Paste any YouTube link, auto-inspect its title and high-res thumbnail, update kinetic headlines, and save changes to the live portfolio.
        </p>

        <form onSubmit={handleSaveHero} className="space-y-6 max-w-4xl">
          {/* YouTube Link with Auto-Fill Button */}
          <div>
            <label className="block text-xs font-mono text-white/70 uppercase mb-2">
              Hero YouTube Video Link (Watch, Shorts, or Embed)
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Youtube className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  value={heroForm.youtubeUrl}
                  onChange={(e) => setHeroForm({ ...heroForm, youtubeUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=... or https://youtube.com/shorts/..."
                  className="w-full pl-10 pr-4 py-3 rounded-sm bg-[#09090B] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <button
                type="button"
                onClick={handleFetchHeroMeta}
                disabled={fetchingHeroMeta || !heroForm.youtubeUrl.trim()}
                className="px-5 py-3 rounded-sm bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.1] text-white font-mono text-xs uppercase flex items-center justify-center gap-2 disabled:opacity-40"
              >
                {fetchingHeroMeta ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Inspecting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Auto-Fill Meta</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Grid of Title, Headline, Headline Highlight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-white/70 uppercase mb-1">
                Showreel Title
              </label>
              <input
                type="text"
                value={heroForm.title}
                onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-sm bg-[#09090B] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-white/70 uppercase mb-1">
                Extracted Video ID
              </label>
              <input
                type="text"
                value={heroForm.youtubeId}
                onChange={(e) => setHeroForm({ ...heroForm, youtubeId: e.target.value })}
                placeholder="e.g. aqz-KE-bpKQ"
                className="w-full px-3.5 py-2.5 rounded-sm bg-[#09090B] border border-white/[0.08] text-white/80 text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-white/70 uppercase mb-1">
                Hero Headline (First Line)
              </label>
              <input
                type="text"
                value={heroForm.headline}
                onChange={(e) => setHeroForm({ ...heroForm, headline: e.target.value })}
                placeholder="WE EDIT FOR"
                className="w-full px-3.5 py-2.5 rounded-sm bg-[#09090B] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-white/70 uppercase mb-1">
                Headline Highlight (Second Line)
              </label>
              <input
                type="text"
                value={heroForm.headlineHighlight}
                onChange={(e) => setHeroForm({ ...heroForm, headlineHighlight: e.target.value })}
                placeholder="RETENTION."
                className="w-full px-3.5 py-2.5 rounded-sm bg-[#09090B] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-white/70 uppercase mb-1">
              Subheadline / Studio Value Proposition
            </label>
            <textarea
              rows={3}
              value={heroForm.subheadline}
              onChange={(e) => setHeroForm({ ...heroForm, subheadline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-sm bg-[#09090B] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37] resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-white/70 uppercase mb-1">
              Custom Poster / Thumbnail URL (Optional)
            </label>
            <input
              type="text"
              value={heroForm.thumbnail}
              onChange={(e) => setHeroForm({ ...heroForm, thumbnail: e.target.value })}
              placeholder="https://..."
              className="w-full px-3.5 py-2.5 rounded-sm bg-[#09090B] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Embedded Live Video Preview */}
          {heroForm.youtubeId && (
            <div className="pt-4 border-t border-white/[0.07]">
              <span className="block text-xs font-mono text-white/50 uppercase mb-3">
                Hero Video Embedded Live Preview
              </span>
              <div className="max-w-xl aspect-video rounded-lg overflow-hidden bg-black border border-white/[0.1] shadow-xl">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${heroForm.youtubeId}?rel=0&modestbranding=1`}
                  title="Hero Preview"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4 border-t border-white/[0.07] flex justify-end">
            <button
              type="submit"
              disabled={savingSettings}
              className="px-6 py-3 rounded-sm bg-[#D4AF37] text-[#09090B] font-bold font-mono text-xs uppercase tracking-wider hover:bg-[#F59E0B] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{savingSettings ? "Saving Settings..." : "Save Hero Showreel Settings"}</span>
            </button>
          </div>
        </form>
      </section>
    )}

    {/* HIGH-RETENTION SHORTS & REELS (EXACTLY 3 REELS) TAB */}
    {activeAdminTab === "retention" && (
      <section className="bg-[#121216] border border-white/[0.08] rounded-xl p-6 sm:p-8 space-y-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.07]">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-sm bg-[#09090B] border border-white/[0.08] mb-2 type-timecode text-[#D4AF37]">
              <Smartphone className="w-3.5 h-3.5" />
              <span>HOMEPAGE SECTION 3</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold uppercase text-white tracking-tight">
              High-Retention Shorts &amp; Reels (Choose Exactly 3)
            </h2>
            <p className="text-white/50 text-xs sm:text-sm mt-1 max-w-2xl font-mono">
              Configure which 3 vertical reels appear in the dedicated &quot;HIGH-RETENTION shorts &amp; reels&quot; showcase on the homepage. Only these 3 reels will be shown.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSaveRetentionReels}
            disabled={savingRetention}
            className="px-6 py-3 rounded-sm bg-[#D4AF37] text-[#09090B] font-mono font-bold text-xs uppercase tracking-wider hover:bg-[#F59E0B] transition-all flex items-center gap-2 shrink-0 shadow-lg disabled:opacity-50"
          >
            {savingRetention ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Save 3 Retention Reels</span>
              </>
            )}
          </button>
        </div>

        {/* 3 SLOTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[0, 1, 2].map((slotIndex) => {
            const currentId = retentionReelIds[slotIndex] || "";
            const currentProject = projects.find((p) => p.id === currentId);

            return (
              <div
                key={slotIndex}
                className="p-5 rounded-lg bg-[#09090B] border border-white/[0.08] flex flex-col justify-between space-y-4 shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 rounded-sm bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] font-mono text-xs font-bold uppercase">
                      Reel Slot #{slotIndex + 1}
                    </span>
                    {currentProject && (
                      <span className="text-[10px] font-mono text-white/40">
                        {currentProject.aspectRatio} · {currentProject.duration}
                      </span>
                    )}
                  </div>

                  {/* Dropdown Selector */}
                  <label className="block text-[11px] font-mono text-white/60 uppercase mb-1.5">
                    Assign Project:
                  </label>
                  <select
                    value={currentId}
                    onChange={(e) => {
                      const newIds = [...retentionReelIds];
                      newIds[slotIndex] = e.target.value;
                      setRetentionReelIds(newIds);
                    }}
                    className="w-full px-3 py-2.5 rounded-sm bg-[#121216] border border-white/[0.12] text-white text-xs font-mono focus:border-[#D4AF37] focus:outline-none mb-4 cursor-pointer"
                  >
                    <option value="">-- Choose a Project --</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.aspectRatio}) {p.featured ? "★ Featured" : ""}
                      </option>
                    ))}
                  </select>

                  {/* Live Thumbnail Preview */}
                  {currentProject ? (
                    <div className="relative aspect-[9/16] max-h-[340px] mx-auto rounded-lg overflow-hidden border border-white/[0.1] bg-black group shadow-lg">
                      <img
                        src={currentProject.thumbnail}
                        alt={currentProject.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent p-3.5 flex flex-col justify-end">
                        <span className="text-xs font-display font-semibold uppercase text-white truncate">
                          {currentProject.title}
                        </span>
                        <div className="flex items-center justify-between text-[9px] font-mono text-[#D4AF37] mt-0.5">
                          <span>{currentProject.category}</span>
                          <span>{currentProject.duration}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-[9/16] max-h-[340px] mx-auto rounded-lg border border-dashed border-white/[0.15] flex flex-col items-center justify-center p-4 text-center">
                      <Smartphone className="w-8 h-8 text-white/20 mb-2" />
                      <span className="text-xs font-mono text-white/40 uppercase">
                        No Reel Assigned
                      </span>
                    </div>
                  )}
                </div>

                {currentProject && (
                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-white/50">
                    <span>ID: {currentProject.id.slice(-6)}</span>
                    <button
                      type="button"
                      onClick={() => setPreviewProject(currentProject)}
                      className="text-[#D4AF37] hover:underline flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Preview Reel</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    )}

    {/* BEFORE / AFTER COMPARISON TAB */}
    {activeAdminTab === "beforeAfter" && (
      <section className="bg-[#121216] border border-white/[0.07] rounded-xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-2 text-[10px] font-mono text-[#D4AF37] uppercase tracking-[0.2em] mb-2 font-semibold">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>RAW VS. FINAL MASTER COMPARISON CONFIGURATION</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-display font-bold text-[#F4F4F6] uppercase tracking-tight mb-2">
          Before / After Split Stage
        </h2>
        <p className="text-xs text-white/60 font-sans max-w-2xl mb-8 leading-relaxed">
          Configure the interactive comparison split-viewer displayed on the homepage. Update the raw camera frame, final color-graded master frame, labels, and notices.
        </p>

        <form onSubmit={handleSaveBeforeAfter} className="space-y-6 max-w-4xl">
          {/* Headlines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-white/70 uppercase mb-1">
                Section Headline
              </label>
              <input
                type="text"
                value={beforeAfterForm.headline}
                onChange={(e) => setBeforeAfterForm({ ...beforeAfterForm, headline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-sm bg-[#09090B] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-white/70 uppercase mb-1">
                Headline Highlight (Serif italic)
              </label>
              <input
                type="text"
                value={beforeAfterForm.headlineHighlight}
                onChange={(e) => setBeforeAfterForm({ ...beforeAfterForm, headlineHighlight: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-sm bg-[#09090B] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-white/70 uppercase mb-1">
              Section Subtitle / Description
            </label>
            <input
              type="text"
              value={beforeAfterForm.subheadline}
              onChange={(e) => setBeforeAfterForm({ ...beforeAfterForm, subheadline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-sm bg-[#09090B] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Side-by-side Images & Labels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* Left Side: Raw Log */}
            <div className="p-4 rounded-lg bg-[#09090B] border border-white/[0.07] space-y-3">
              <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest block font-semibold">
                LEFT SIDE {"//"} RAW FOOTAGE
              </span>
              <div>
                <label className="block text-[10px] font-mono text-white/60 uppercase mb-1">
                  Raw Frame Image URL
                </label>
                <input
                  type="text"
                  value={beforeAfterForm.beforeImage}
                  onChange={(e) => setBeforeAfterForm({ ...beforeAfterForm, beforeImage: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm bg-[#121216] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-white/60 uppercase mb-1">
                  Raw Badge Label
                </label>
                <input
                  type="text"
                  value={beforeAfterForm.beforeLabel}
                  onChange={(e) => setBeforeAfterForm({ ...beforeAfterForm, beforeLabel: e.target.value })}
                  placeholder="RAW LOG // CLIP_0042.MOV"
                  className="w-full px-3 py-2 rounded-sm bg-[#121216] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-white/60 uppercase mb-1">
                  Bottom Callout Notice
                </label>
                <input
                  type="text"
                  value={beforeAfterForm.beforeNotice}
                  onChange={(e) => setBeforeAfterForm({ ...beforeAfterForm, beforeNotice: e.target.value })}
                  placeholder="DEAD AIR DETECTED: 00:00:02:14"
                  className="w-full px-3 py-2 rounded-sm bg-[#121216] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Right Side: Final Master */}
            <div className="p-4 rounded-lg bg-[#09090B] border border-white/[0.07] space-y-3">
              <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block font-semibold">
                RIGHT SIDE {"//"} FINAL MASTER
              </span>
              <div>
                <label className="block text-[10px] font-mono text-white/60 uppercase mb-1">
                  Final Frame Image URL
                </label>
                <input
                  type="text"
                  value={beforeAfterForm.afterImage}
                  onChange={(e) => setBeforeAfterForm({ ...beforeAfterForm, afterImage: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm bg-[#121216] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-white/60 uppercase mb-1">
                  Final Master Badge Label
                </label>
                <input
                  type="text"
                  value={beforeAfterForm.afterLabel}
                  onChange={(e) => setBeforeAfterForm({ ...beforeAfterForm, afterLabel: e.target.value })}
                  placeholder="FINAL MASTER // KODAK 2383"
                  className="w-full px-3 py-2 rounded-sm bg-[#121216] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-white/60 uppercase mb-1">
                  Footer Philosophy Quote
                </label>
                <input
                  type="text"
                  value={beforeAfterForm.footerNote}
                  onChange={(e) => setBeforeAfterForm({ ...beforeAfterForm, footerNote: e.target.value })}
                  className="w-full px-3 py-2 rounded-sm bg-[#121216] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>
          </div>

          {/* Interactive Live Split Preview in Admin */}
          <div className="pt-4 border-t border-white/[0.07]">
            <span className="block text-xs font-mono text-white/50 uppercase mb-3">
              Interactive Split Viewer Live Preview
            </span>
            <div className="relative w-full max-w-2xl aspect-video rounded-lg overflow-hidden bg-black border border-white/[0.1] shadow-xl">
              {/* Master Side */}
              <div className="absolute inset-0">
                <img
                  src={beforeAfterForm.afterImage}
                  alt="Final preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-sm bg-black/80 text-[9px] font-mono text-[#D4AF37]">
                  {beforeAfterForm.afterLabel}
                </div>
              </div>

              {/* Raw Side */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `polygon(0% 0%, ${previewSplit}% 0%, ${previewSplit}% 100%, 0% 100%)` }}
              >
                <img
                  src={beforeAfterForm.beforeImage}
                  alt="Raw preview"
                  className="w-full h-full object-cover"
                  style={{ filter: "saturate(0.2) contrast(0.8) brightness(1.15)" }}
                />
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-sm bg-black/80 text-[9px] font-mono text-white/60">
                  {beforeAfterForm.beforeLabel}
                </div>
              </div>

              {/* Divider Line */}
              <div
                className="absolute top-0 bottom-0 w-[1px] bg-[#D4AF37]"
                style={{ left: `${previewSplit}%` }}
              />

              {/* Range Slider */}
              <input
                type="range"
                min="0"
                max="100"
                value={previewSplit}
                onChange={(e) => setPreviewSplit(parseFloat(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-20"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-white/[0.07] flex justify-end">
            <button
              type="submit"
              disabled={savingSettings}
              className="px-6 py-3 rounded-sm bg-[#D4AF37] text-[#09090B] font-bold font-mono text-xs uppercase tracking-wider hover:bg-[#F59E0B] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{savingSettings ? "Saving Changes..." : "Save Before/After Configuration"}</span>
            </button>
          </div>
        </form>
      </section>
    )}

    {/* PRICING & PLANS TAB */}
    {activeAdminTab === "pricing" && (
      <section className="bg-[#121216] border border-white/[0.07] rounded-xl p-6 sm:p-8 shadow-xl space-y-8">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#D4AF37] uppercase tracking-[0.2em] mb-2 font-semibold">
            <DollarSign className="w-3.5 h-3.5" />
            <span>INVESTMENT & RATE CARD CONFIGURATION</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-[#F4F4F6] uppercase tracking-tight mb-2">
            Pricing & Plan Rates Manager
          </h2>
          <p className="text-xs text-white/60 font-sans max-w-2xl leading-relaxed">
            Configure plan prices, deliverables, features, and active currency. Prices default to USD ($) and can be adjusted anytime. Updates reflect immediately on your live portfolio.
          </p>
        </div>

        <form onSubmit={handleSavePricing} className="space-y-8">
          {/* CURRENCY & SECTION HEADER SETTINGS */}
          <div className="p-5 rounded-lg bg-[#09090B] border border-white/[0.07] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.07]">
              <div>
                <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider font-semibold block">
                  1. Active Currency & Section Headlines
                </span>
                <span className="text-[11px] text-white/50 font-sans">
                  Default currency is Dollar ($). Select a preset or type a custom symbol.
                </span>
              </div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#121216] border border-white/[0.08] text-[11px] font-mono text-white/70">
                <span className="text-white/40">Active:</span>
                <span className="font-bold text-[#D4AF37] text-sm">{pricingForm.currencySymbol}</span>
                <span className="text-white/40">({pricingForm.currencyCode || "USD"})</span>
              </div>
            </div>

            {/* Quick Currency Selector */}
            <div>
              <label className="block text-[10px] font-mono text-white/60 uppercase mb-2">
                Quick Currency Presets (Click to apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {CURRENCY_PRESETS.map((curr) => {
                  const isActive = pricingForm.currencySymbol === curr.symbol;
                  return (
                    <button
                      key={curr.symbol}
                      type="button"
                      onClick={() =>
                        setPricingForm((prev) => ({
                          ...prev,
                          currencySymbol: curr.symbol,
                          currencyCode: curr.code,
                        }))
                      }
                      className={`px-3 py-1.5 rounded text-xs font-mono transition-all flex items-center gap-1.5 ${
                        isActive
                          ? "bg-[#D4AF37] text-[#09090B] font-bold shadow-md"
                          : "bg-[#121216] text-white/70 hover:text-white border border-white/[0.08] hover:border-[#D4AF37]/50"
                      }`}
                    >
                      <span className="font-bold">{curr.symbol}</span>
                      <span className="text-[10px] opacity-80">{curr.code}</span>
                      {curr.symbol === "$" && (
                        <span className="text-[9px] bg-black/20 px-1 rounded uppercase font-semibold">
                          Default
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Currency Symbol and Code inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono text-white/60 uppercase mb-1">
                  Custom Currency Symbol
                </label>
                <input
                  type="text"
                  value={pricingForm.currencySymbol}
                  onChange={(e) =>
                    setPricingForm((prev) => ({ ...prev, currencySymbol: e.target.value }))
                  }
                  placeholder="$"
                  className="w-full px-3 py-2 rounded-sm bg-[#121216] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-white/60 uppercase mb-1">
                  Currency Code (Optional)
                </label>
                <input
                  type="text"
                  value={pricingForm.currencyCode || ""}
                  onChange={(e) =>
                    setPricingForm((prev) => ({ ...prev, currencyCode: e.target.value.toUpperCase() }))
                  }
                  placeholder="USD"
                  className="w-full px-3 py-2 rounded-sm bg-[#121216] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Section Headline & Highlight */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/[0.05]">
              <div>
                <label className="block text-[10px] font-mono text-white/60 uppercase mb-1">
                  Section Headline
                </label>
                <input
                  type="text"
                  value={pricingForm.headline || ""}
                  onChange={(e) =>
                    setPricingForm((prev) => ({ ...prev, headline: e.target.value }))
                  }
                  placeholder="SIMPLE PRICING."
                  className="w-full px-3 py-2 rounded-sm bg-[#121216] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-white/60 uppercase mb-1">
                  Headline Highlight (Serif italic)
                </label>
                <input
                  type="text"
                  value={pricingForm.headlineHighlight || ""}
                  onChange={(e) =>
                    setPricingForm((prev) => ({ ...prev, headlineHighlight: e.target.value }))
                  }
                  placeholder="zero guesswork."
                  className="w-full px-3 py-2 rounded-sm bg-[#121216] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-mono text-white/60 uppercase mb-1">
                  Section Subtitle
                </label>
                <input
                  type="text"
                  value={pricingForm.subheadline || ""}
                  onChange={(e) =>
                    setPricingForm((prev) => ({ ...prev, subheadline: e.target.value }))
                  }
                  placeholder="Choose a package that fits your publishing schedule. No surprise fees."
                  className="w-full px-3 py-2 rounded-sm bg-[#121216] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>
          </div>

          {/* PLANS LIST */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-display font-bold text-white uppercase">
                  2. Pricing Plans & Rates ({pricingForm.plans.length} Tiers)
                </h3>
                <p className="text-xs text-white/50 font-sans">
                  Adjust rates, volumes, popular badges, and features for each plan.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetPricingDefaults}
                  className="px-3 py-1.5 rounded-sm bg-[#121216] hover:bg-white/10 text-white/60 hover:text-white text-xs font-mono border border-white/[0.08] transition-colors flex items-center gap-1.5"
                  title="Reset plans to default $299 / $499 / CUSTOM"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset to Defaults</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddNewPlan}
                  className="px-3 py-1.5 rounded-sm bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#D4AF37] text-xs font-mono border border-[#D4AF37]/30 transition-colors flex items-center gap-1.5 font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Plan</span>
                </button>
              </div>
            </div>

            {/* Individual Plan Cards */}
            <div className="space-y-6">
              {pricingForm.plans.map((plan, planIdx) => {
                const formattedPrice = formatPlanPrice(plan.price, pricingForm.currencySymbol);
                const isPop = !!plan.popular;

                return (
                  <div
                    key={plan.id}
                    className={`rounded-xl border p-5 sm:p-6 transition-all ${
                      isPop
                        ? "bg-[#121216] border-[#D4AF37] ring-1 ring-[#D4AF37]/40 shadow-xl"
                        : "bg-[#09090B] border-white/[0.08]"
                    }`}
                  >
                    {/* Top Control Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-white/[0.07]">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-white/5 border border-white/10 text-white/70 font-mono text-xs flex items-center justify-center font-bold">
                          {planIdx + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-display font-bold text-white text-base uppercase">
                              {plan.name || "Untitled Plan"}
                            </span>
                            <span className="text-[10px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/20 font-bold">
                              {formattedPrice} {plan.cadence || ""}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Controls: Reorder, Popular Toggle, Delete */}
                      <div className="flex items-center gap-2">
                        {/* Toggle Popular Choice */}
                        <button
                          type="button"
                          onClick={() => handleTogglePlanPopular(planIdx)}
                          className={`px-2.5 py-1 rounded text-[11px] font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                            isPop
                              ? "bg-[#D4AF37] text-[#09090B] font-bold shadow-sm"
                              : "bg-[#121216] text-white/50 hover:text-white border border-white/[0.08]"
                          }`}
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{isPop ? "Recommended Choice" : "Set Recommended"}</span>
                        </button>

                        {/* Move Up */}
                        <button
                          type="button"
                          disabled={planIdx === 0}
                          onClick={() => handleMovePlan(planIdx, "up")}
                          className="p-1.5 rounded bg-[#121216] hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-30 disabled:hover:bg-[#121216] border border-white/[0.08]"
                          title="Move Up"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>

                        {/* Move Down */}
                        <button
                          type="button"
                          disabled={planIdx === pricingForm.plans.length - 1}
                          onClick={() => handleMovePlan(planIdx, "down")}
                          className="p-1.5 rounded bg-[#121216] hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-30 disabled:hover:bg-[#121216] border border-white/[0.08]"
                          title="Move Down"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Remove Plan */}
                        <button
                          type="button"
                          onClick={() => handleRemovePlan(planIdx)}
                          className="p-1.5 rounded bg-[#121216] hover:bg-red-500/20 text-white/40 hover:text-red-400 border border-white/[0.08] transition-colors"
                          title="Delete Plan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Plan Fields Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* Name */}
                      <div className="md:col-span-4">
                        <label className="block text-[10px] font-mono text-white/60 uppercase mb-1">
                          Plan Name
                        </label>
                        <input
                          type="text"
                          value={plan.name}
                          onChange={(e) =>
                            handleUpdatePlan(planIdx, { name: e.target.value.toUpperCase() })
                          }
                          placeholder="STARTER"
                          className="w-full px-3 py-2 rounded-sm bg-[#121216] border border-white/[0.08] text-white text-xs font-mono font-bold focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>

                      {/* Volume */}
                      <div className="md:col-span-4">
                        <label className="block text-[10px] font-mono text-white/60 uppercase mb-1">
                          Deliverables / Volume Badge
                        </label>
                        <input
                          type="text"
                          value={plan.volume}
                          onChange={(e) =>
                            handleUpdatePlan(planIdx, { volume: e.target.value.toUpperCase() })
                          }
                          placeholder="30 REELS / MO"
                          className="w-full px-3 py-2 rounded-sm bg-[#121216] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>

                      {/* Price Input with Currency Prefix & Quick Custom Button */}
                      <div className="md:col-span-4">
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] font-mono text-white/60 uppercase">
                            Price Amount
                          </label>
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdatePlan(planIdx, {
                                price: plan.price === "CUSTOM" ? "299" : "CUSTOM",
                                cadence: plan.price === "CUSTOM" ? "/ month" : "",
                              })
                            }
                            className="text-[9px] font-mono text-[#D4AF37] hover:underline"
                          >
                            {plan.price === "CUSTOM" ? "Switch to Numeric Rate" : "Switch to CUSTOM Quote"}
                          </button>
                        </div>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 font-mono font-bold text-xs text-[#D4AF37] select-none">
                            {pricingForm.currencySymbol}
                          </span>
                          <input
                            type="text"
                            value={plan.price}
                            onChange={(e) =>
                              handleUpdatePlan(planIdx, { price: e.target.value })
                            }
                            placeholder="299"
                            className="w-full pl-8 pr-3 py-2 rounded-sm bg-[#121216] border border-white/[0.08] text-white text-xs font-mono font-bold focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                      </div>

                      {/* Cadence */}
                      <div className="md:col-span-4">
                        <label className="block text-[10px] font-mono text-white/60 uppercase mb-1">
                          Billing Cadence / Period
                        </label>
                        <input
                          type="text"
                          value={plan.cadence ?? ""}
                          onChange={(e) =>
                            handleUpdatePlan(planIdx, { cadence: e.target.value })
                          }
                          placeholder="/ month"
                          className="w-full px-3 py-2 rounded-sm bg-[#121216] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>

                      {/* CTA Label */}
                      <div className="md:col-span-4">
                        <label className="block text-[10px] font-mono text-white/60 uppercase mb-1">
                          CTA Button Label
                        </label>
                        <input
                          type="text"
                          value={plan.ctaText}
                          onChange={(e) =>
                            handleUpdatePlan(planIdx, { ctaText: e.target.value })
                          }
                          placeholder="Start with 30"
                          className="w-full px-3 py-2 rounded-sm bg-[#121216] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>

                      {/* Tagline */}
                      <div className="md:col-span-4">
                        <label className="block text-[10px] font-mono text-white/60 uppercase mb-1">
                          Target Tagline
                        </label>
                        <input
                          type="text"
                          value={plan.tagline}
                          onChange={(e) =>
                            handleUpdatePlan(planIdx, { tagline: e.target.value })
                          }
                          placeholder="For creators looking for consistent weekly posts."
                          className="w-full px-3 py-2 rounded-sm bg-[#121216] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>

                      {/* WhatsApp Inquiry Message */}
                      <div className="md:col-span-12">
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] font-mono text-white/60 uppercase">
                            WhatsApp Inquiry Message Template
                          </label>
                          <button
                            type="button"
                            onClick={() => handleAutoFillWhatsApp(planIdx)}
                            className="text-[9px] font-mono text-[#D4AF37] hover:underline"
                          >
                            Auto-Sync Message With Current Price
                          </button>
                        </div>
                        <input
                          type="text"
                          value={plan.whatsappMessage}
                          onChange={(e) =>
                            handleUpdatePlan(planIdx, { whatsappMessage: e.target.value })
                          }
                          placeholder={`Hi Zenith! I want to start a project with the ${plan.name} package...`}
                          className="w-full px-3 py-2 rounded-sm bg-[#121216] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                        />
                      </div>

                      {/* Features List Manager */}
                      <div className="md:col-span-12 pt-3 border-t border-white/[0.05]">
                        <label className="block text-[10px] font-mono text-white/60 uppercase mb-2">
                          Deliverables & Features Included ({plan.features.length} items)
                        </label>

                        <div className="space-y-2 mb-3">
                          {plan.features.map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-center gap-2">
                              <span className="text-[#D4AF37] text-xs">✓</span>
                              <input
                                type="text"
                                value={feat}
                                onChange={(e) => {
                                  const updated = [...plan.features];
                                  updated[fIdx] = e.target.value;
                                  handleUpdatePlan(planIdx, { features: updated });
                                }}
                                className="flex-1 px-3 py-1.5 rounded-sm bg-[#121216] border border-white/[0.08] text-white text-xs font-sans focus:outline-none focus:border-[#D4AF37]"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveFeatureFromPlan(planIdx, fIdx)}
                                className="p-1.5 rounded bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
                                title="Remove Feature"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Add Feature input */}
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={newFeatureInputs[plan.id] || ""}
                            onChange={(e) =>
                              setNewFeatureInputs((prev) => ({
                                ...prev,
                                [plan.id]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddFeatureToPlan(planIdx);
                              }
                            }}
                            placeholder="Add another deliverable / feature bullet..."
                            className="flex-1 px-3 py-2 rounded-sm bg-[#121216] border border-white/[0.08] text-white text-xs font-sans placeholder-white/30 focus:outline-none focus:border-[#D4AF37]"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddFeatureToPlan(planIdx)}
                            className="px-3.5 py-2 rounded-sm bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#D4AF37] text-xs font-mono font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Feature</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* REAL-TIME PREVIEW IN ADMIN */}
          <div className="pt-6 border-t border-white/[0.07] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider font-semibold block">
                  3. Real-Time Pricing Cards Preview
                </span>
                <span className="text-[11px] text-white/50 font-sans">
                  This is how the pricing section appears to visitors on your live website.
                </span>
              </div>
              <span className="text-[10px] font-mono text-white/40 uppercase">
                Active Currency: {pricingForm.currencySymbol}
              </span>
            </div>

            {/* Rendered Live Cards Preview Strip */}
            <div
              className={`grid gap-5 items-stretch ${
                pricingForm.plans.length === 1
                  ? "grid-cols-1 max-w-sm mx-auto"
                  : pricingForm.plans.length === 2
                  ? "grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto"
                  : "grid-cols-1 md:grid-cols-3"
              }`}
            >
              {pricingForm.plans.map((plan) => {
                const isPop = !!plan.popular;
                const displayPrice = formatPlanPrice(plan.price, pricingForm.currencySymbol);
                const isCustom = /^custom$/i.test((plan.price || "").trim());
                const cadence =
                  plan.cadence !== undefined && plan.cadence !== null
                    ? plan.cadence
                    : isCustom
                    ? ""
                    : "/ month";

                return (
                  <div
                    key={`preview-${plan.id}`}
                    className={`p-5 rounded-xl border transition-all relative flex flex-col justify-between ${
                      isPop
                        ? "bg-[#121216] border-[#D4AF37] shadow-lg ring-1 ring-[#D4AF37]/40"
                        : "bg-[#09090B] border-white/[0.08]"
                    }`}
                  >
                    {isPop && (
                      <div className="absolute -top-3 left-4 px-2.5 py-0.5 rounded-sm bg-[#D4AF37] text-[#09090B] font-mono text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-2.5 h-2.5 fill-current" />
                        <span>RECOMMENDED CHOICE</span>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-display font-bold text-base text-white tracking-tight uppercase">
                          {plan.name}
                        </span>
                        {plan.volume && (
                          <span className="text-[9px] font-mono uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded-sm border border-[#D4AF37]/20 font-semibold">
                            {plan.volume}
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline gap-1 my-2">
                        <span className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                          {displayPrice}
                        </span>
                        {cadence && (
                          <span className="text-[9px] font-mono text-white/40">{cadence}</span>
                        )}
                      </div>

                      {plan.tagline && (
                        <p className="text-[11px] text-white/60 font-sans leading-relaxed mb-4">
                          {plan.tagline}
                        </p>
                      )}

                      <div className="space-y-2 pt-3 border-t border-white/[0.07] mb-4">
                        {plan.features.map((feat, i) => (
                          <div key={i} className="flex items-center gap-2 text-[11px] text-white/80">
                            <Check className="w-3 h-3 text-[#D4AF37] shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div
                      className={`w-full py-2.5 rounded-sm text-[11px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 ${
                        isPop
                          ? "bg-[#D4AF37] text-[#09090B]"
                          : "bg-[#18181E] text-white border border-white/[0.08]"
                      }`}
                    >
                      <span>{plan.ctaText || "Select Plan"}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SAVE BUTTON */}
          <div className="pt-6 border-t border-white/[0.07] flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-mono text-white/40">
              * Rates and currency changes are deployed immediately upon saving.
            </span>

            <button
              type="submit"
              disabled={savingSettings}
              className="px-6 py-3 rounded-sm bg-[#D4AF37] text-[#09090B] font-bold font-mono text-xs uppercase tracking-wider hover:bg-[#F59E0B] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{savingSettings ? "Saving Settings..." : "Save Pricing & Currency Configuration"}</span>
            </button>
          </div>
        </form>
      </section>
    )}
      </main>

      {/* EDIT MODAL */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-[#121216] border border-white/[0.1] rounded-xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.07]">
              <h3 className="font-display font-bold text-lg text-white uppercase">
                Edit Video Cut
              </h3>
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="p-1 rounded-sm text-white/50 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-white/50 uppercase mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={editingProject.title}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, title: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-sm bg-[#09090B] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Category Pills & Select */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[10px] font-mono text-white/50 uppercase">
                    Editorial Category & Filter Target
                  </label>
                  <span className="text-[10px] font-mono text-[#D4AF37]">
                    Current: {editingProject.category}
                  </span>
                </div>

                {/* Quick Category Select Pills */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {EDITORIAL_CATEGORIES.map((cat) => {
                    const isSelected =
                      editingProject.category === cat ||
                      (cat === "Shorts & Reels" && editingProject.category === "Short-Form / Reel");
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setEditingProject({ ...editingProject, category: cat })}
                        className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase tracking-wider transition-all border cursor-pointer ${
                          isSelected
                            ? "bg-[#D4AF37] text-black border-[#D4AF37] font-bold shadow-sm shadow-[#D4AF37]/20"
                            : "bg-white/[0.04] text-white/70 border-white/[0.1] hover:border-[#D4AF37]/50 hover:text-white"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-white/50 uppercase mb-1">
                      Category Dropdown
                    </label>
                    <select
                      value={
                        editingProject.category === "Short-Form / Reel"
                          ? "Shorts & Reels"
                          : editingProject.category
                      }
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, category: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-sm bg-[#09090B] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                    >
                      {EDITORIAL_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                <div>
                  <label className="block text-[10px] font-mono text-white/50 uppercase mb-1">
                    Aspect Ratio
                  </label>
                  <select
                    value={editingProject.aspectRatio}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        aspectRatio: e.target.value as "16:9" | "9:16",
                      })
                    }
                    className="w-full px-3 py-2 rounded-sm bg-[#09090B] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                  >
                    <option value="16:9">16:9 Landscape</option>
                    <option value="9:16">9:16 Vertical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-white/50 uppercase mb-1">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={editingProject.clientContext}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, clientContext: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-sm bg-[#09090B] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-white/50 uppercase mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={editingProject.duration}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, duration: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-sm bg-[#09090B] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-white/50 uppercase mb-1">
                  Thumbnail URL
                </label>
                <input
                  type="text"
                  value={editingProject.thumbnail}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, thumbnail: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-sm bg-[#09090B] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-white/50 uppercase mb-1">
                  Overview
                </label>
                <textarea
                  rows={3}
                  value={editingProject.description}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, description: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-sm bg-[#09090B] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37] resize-none"
                />
              </div>

              {/* Public Website Visibility Toggle */}
              <div className="p-4 rounded-lg bg-[#09090B] border border-white/[0.08] flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-mono font-bold uppercase text-white">
                      Public Website Visibility
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                        editingProject.published !== false
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {editingProject.published !== false
                        ? "● Live on Website"
                        : "○ Hidden / Draft (Admin Only)"}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/50 font-sans leading-relaxed">
                    {editingProject.published !== false
                      ? "This cut is visible to all visitors on the homepage and archive."
                      : "This cut is hidden from visitors. Only visible to you inside this admin panel."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditingProject({
                      ...editingProject,
                      published: !(editingProject.published !== false),
                    })
                  }
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    editingProject.published !== false ? "bg-[#D4AF37]" : "bg-white/20"
                  }`}
                  role="switch"
                  aria-checked={editingProject.published !== false}
                  title="Toggle public visibility"
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      editingProject.published !== false ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.07]">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 rounded-sm bg-transparent hover:bg-white/[0.05] border border-white/[0.08] text-white/60 text-xs font-mono uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2 rounded-sm bg-[#D4AF37] text-[#09090B] font-bold text-xs uppercase tracking-wider hover:bg-[#F59E0B] transition-colors disabled:opacity-50"
                >
                  {savingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STUDIO PREVIEW & INSPECTOR MODAL */}
      {previewProject && (
        <AdminVideoPreviewModal
          project={previewProject}
          onClose={() => setPreviewProject(null)}
          onEdit={(proj) => setEditingProject(proj)}
          onTogglePublish={handleTogglePublish}
        />
      )}
    </div>
  );
}
