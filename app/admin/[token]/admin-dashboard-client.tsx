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
} from "lucide-react";
import { Project, CATEGORIES } from "@/data/projects";
import { VideoLightbox } from "@/components/video-lightbox";

interface AdminDashboardClientProps {
  token: string;
}

export default function AdminDashboardClient({ token }: AdminDashboardClientProps) {
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

  // Active Tab: "projects" | "hero" | "beforeAfter"
  const [activeAdminTab, setActiveAdminTab] = useState<"projects" | "hero" | "beforeAfter">("projects");

  // Showcase Settings State
  const [heroForm, setHeroForm] = useState({
    youtubeUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    youtubeId: "aqz-KE-bpKQ",
    title: "2026 Master Editorial Showreel",
    headline: "WE EDIT FOR",
    headlineHighlight: "RETENTION.",
    subheadline: "High-impact commercial and creator post-production engineered for ruthless retention. Surgical cut pacing, 12-track Foley sound design, and razor-sharp kinetic typography.",
    thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200&auto=format&fit=crop",
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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 4000);
  };

  // Fetch projects from API
  const loadProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        headers: { "x-admin-token": token },
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
  }, [token]);

  // Fetch Showcase Settings (Hero & Before/After)
  const loadSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        if (data.hero) {
          setHeroForm((prev) => ({ ...prev, ...data.hero }));
        }
        if (data.beforeAfter) {
          setBeforeAfterForm((prev) => ({ ...prev, ...data.beforeAfter }));
        }
      }
    } catch {
      // Keep initial
    }
  }, []);

  useEffect(() => {
    loadProjects();
    loadSettings();
  }, [loadProjects, loadSettings]);

  // Fetch Hero Video Meta
  const handleFetchHeroMeta = async () => {
    if (!heroForm.youtubeUrl.trim()) return;
    setFetchingHeroMeta(true);
    try {
      const res = await fetch(
        `/api/youtube-meta?url=${encodeURIComponent(heroForm.youtubeUrl.trim())}`,
        { headers: { "x-admin-token": token } }
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
          "x-admin-token": token,
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

  // Save Before/After Settings
  const handleSaveBeforeAfter = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
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
          headers: { "x-admin-token": token },
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setMetaError(data.error || "Unable to extract YouTube video metadata");
        return;
      }

      setNewProject({
        youtubeId: data.videoId,
        title: data.title || "Untitled Video Cut",
        clientContext: data.authorName || "Creator / Brand",
        category: data.isShorts ? "Short-Form / Reel" : "Commercial",
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
          "x-admin-token": token,
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
          "x-admin-token": token,
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
          "x-admin-token": token,
        },
        body: JSON.stringify({ featured: newFeatured }),
      });
      showToast(newFeatured ? "Marked as Featured on Home" : "Removed from Featured");
    } catch {
      showError("Failed to update featured state");
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
        headers: { "x-admin-token": token },
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
          "x-admin-token": token,
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
        headers: { "x-admin-token": token },
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
                  <div>
                    <label className="block text-[10px] font-mono text-white/50 uppercase mb-1">
                      Editorial Category
                    </label>
                    <select
                      value={newProject.category}
                      onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-sm bg-[#09090B] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                    >
                      <option value="Commercial">Commercial</option>
                      <option value="Short-Form / Reel">Short-Form / Reel</option>
                      <option value="YouTube Longform">YouTube Longform</option>
                      <option value="Talking Head">Talking Head</option>
                      <option value="Documentary">Documentary</option>
                      <option value="Motion Graphics">Motion Graphics</option>
                      <option value="Promotional">Promotional</option>
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
                        <span className="px-2 py-0.2 rounded-sm bg-[#09090B] border border-white/[0.08] text-[9px] font-mono text-[#D4AF37] uppercase">
                          {project.category}
                        </span>
                        <span className="text-[10px] font-mono text-white/40">
                          {project.aspectRatio} · {project.duration}
                        </span>
                        {project.featured && (
                          <span className="px-1.5 py-0.2 rounded-sm bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[9px] font-mono text-[#D4AF37] font-semibold">
                            FEATURED
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
                      onClick={() => handleToggleFeatured(project)}
                      className={`px-2.5 py-1.5 rounded-sm border text-[10px] font-mono uppercase transition-colors ${
                        project.featured
                          ? "bg-[#D4AF37]/15 border-[#D4AF37] text-[#D4AF37]"
                          : "bg-[#09090B] border-white/[0.08] text-white/50 hover:text-white"
                      }`}
                      title="Toggle Featured status"
                    >
                      {project.featured ? "★ Featured" : "☆ Set Featured"}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-white/50 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={editingProject.category}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, category: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-sm bg-[#09090B] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                  >
                    <option value="Commercial">Commercial</option>
                    <option value="Short-Form / Reel">Short-Form / Reel</option>
                    <option value="YouTube Longform">YouTube Longform</option>
                    <option value="Talking Head">Talking Head</option>
                    <option value="Documentary">Documentary</option>
                    <option value="Motion Graphics">Motion Graphics</option>
                    <option value="Promotional">Promotional</option>
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

      {/* FULLSCREEN PREVIEW MODAL */}
      {previewProject && (
        <VideoLightbox
          project={previewProject}
          onClose={() => setPreviewProject(null)}
        />
      )}
    </div>
  );
}
