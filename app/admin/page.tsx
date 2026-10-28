"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import {
  Youtube,
  Plus,
  Trash2,
  Edit3,
  MoveUp,
  MoveDown,
  ExternalLink,
  Lock,
  Unlock,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Eye,
  EyeOff,
  Video,
  Film,
  Layers,
  ArrowRight,
  Sliders,
  Scissors,
  Music,
  BarChart3,
  X,
  Play,
  Check,
  AlertCircle,
} from "lucide-react";
import { Project, CATEGORIES, extractYouTubeId, getYouTubeEmbedUrl } from "@/data/projects";

const DEFAULT_PIN = "zenith2026";
const SECRET_TOKEN = "zenith-vault-2026";

interface AdminPageProps {
  params?: { token?: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

function AdminContent({ params, searchParams }: AdminPageProps) {
  const isDirectMatch =
    params?.token === SECRET_TOKEN ||
    params?.token === DEFAULT_PIN ||
    searchParams?.token === SECRET_TOKEN ||
    searchParams?.token === DEFAULT_PIN;

  const [isAuthenticated, setIsAuthenticated] = useState(isDirectMatch);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // YouTube Importer Form State
  const [ytUrl, setYtUrl] = useState("");
  const [fetchingMeta, setFetchingMeta] = useState(false);
  const [fetchError, setFetchError] = useState("");

  // Edit or New Project modal
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isEditingExisting, setIsEditingExisting] = useState(false);

  // Video Preview Modal
  const [previewProject, setPreviewProject] = useState<Project | null>(null);

  // Check session auth or URL query params on mount
  useEffect(() => {
    if (isDirectMatch) {
      setIsAuthenticated(true);
      sessionStorage.setItem("zenith_admin_auth", "true");
      return;
    }
    const auth = sessionStorage.getItem("zenith_admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
      return;
    }
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      if (token === SECRET_TOKEN || token === DEFAULT_PIN || token === "admin") {
        setIsAuthenticated(true);
        sessionStorage.setItem("zenith_admin_auth", "true");
      }
    }
  }, [isDirectMatch]);

  // Fetch projects from API
  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error("Failed to load projects", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadProjects();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === DEFAULT_PIN || pinInput.trim() === "admin") {
      setIsAuthenticated(true);
      sessionStorage.setItem("zenith_admin_auth", "true");
      setPinError("");
    } else {
      setPinError("Invalid Studio PIN. Default is zenith2026");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("zenith_admin_auth");
  };

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  // 1-Click YouTube Metadata Fetcher
  const handleFetchYoutubeMeta = async (urlToFetch?: string) => {
    const targetUrl = urlToFetch || ytUrl;
    if (!targetUrl.trim()) return;

    setFetchingMeta(true);
    setFetchError("");

    try {
      const res = await fetch(`/api/youtube-meta?url=${encodeURIComponent(targetUrl.trim())}`);
      const data = await res.json();

      if (!res.ok || data.error) {
        setFetchError(data.error || "Could not fetch YouTube video details. Ensure URL is valid.");
        return;
      }

      // Initialize project form with YouTube details
      setEditingProject({
        title: data.title || "New Video Edit",
        category: data.aspectRatio === "9:16" ? "Shorts & Reels" : "YouTube Longform",
        clientContext: data.authorName ? `${data.authorName}` : "Creator",
        description: `High-retention edit with pacing optimization, custom kinetic typography, and surgical audio design.`,
        duration: data.aspectRatio === "9:16" ? "0:35" : "8:45",
        aspectRatio: data.aspectRatio,
        videoType: "youtube",
        youtubeId: data.youtubeId,
        thumbnail: data.thumbnail,
        videoSrc: data.watchUrl,
        metrics: data.aspectRatio === "9:16" ? "4K 60FPS · Multi-Track Foley" : "4K UHD · Color Grade 2383",
        editBreakdown: [
          "Dynamic zoom punch-ins on punchlines",
          "Word-by-word synchronized caption glow",
          "Layered sound design with risers and sub-bass impacts",
        ],
        soundDesignNotes: "Multi-track audio mix with subtle whooshes and vocal EQ mastering.",
        pacingStyle: data.aspectRatio === "9:16" ? "1.0s cut rhythm / Staccato momentum" : "Cinematic documentary pacing",
        featured: false,
        published: true,
        timecode: "00:00:35:00",
      });
      setIsEditingExisting(false);
      setYtUrl("");
    } catch (err) {
      setFetchError("Network error while connecting to YouTube service.");
    } finally {
      setFetchingMeta(false);
    }
  };

  // Save new or updated project
  const handleSaveProject = async () => {
    if (!editingProject?.title || (!editingProject?.youtubeId && !editingProject?.videoSrc)) {
      alert("Please provide at least a Title and a YouTube Video link or ID.");
      return;
    }

    setSaveLoading(true);
    try {
      if (isEditingExisting && editingProject.id) {
        // Update
        const res = await fetch(`/api/projects/${editingProject.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingProject),
        });
        if (res.ok) {
          triggerToast("Project updated successfully!");
          setEditingProject(null);
          loadProjects();
        } else {
          alert("Failed to update project.");
        }
      } else {
        // Create new
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingProject),
        });
        if (res.ok) {
          triggerToast("New video published to portfolio!");
          setEditingProject(null);
          loadProjects();
        } else {
          alert("Failed to save project.");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save project.");
    } finally {
      setSaveLoading(false);
    }
  };

  // Delete project
  const handleDeleteProject = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        triggerToast("Project deleted.");
        loadProjects();
      }
    } catch {
      alert("Failed to delete project.");
    }
  };

  // Toggle Published
  const handleTogglePublish = async (project: Project) => {
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !project.published }),
      });
      if (res.ok) {
        loadProjects();
      }
    } catch {
      alert("Failed to update status.");
    }
  };

  // Toggle Featured Hero
  const handleToggleFeatured = async (project: Project) => {
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !project.featured }),
      });
      if (res.ok) {
        loadProjects();
      }
    } catch {
      alert("Failed to update featured state.");
    }
  };

  // Reorder: Move Up or Down
  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const reordered = [...projects];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    setProjects(reordered);

    try {
      await fetch("/api/projects/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: reordered.map((p) => p.id) }),
      });
      triggerToast("Order updated.");
    } catch {
      loadProjects();
    }
  };

  // Reset to Defaults
  const handleResetDefaults = async () => {
    if (!confirm("Reset all projects to curated default showroom list? Any newly added videos will be reset.")) return;
    try {
      const res = await fetch("/api/projects/reset", { method: "POST" });
      if (res.ok) {
        triggerToast("Restored default curated showroom projects!");
        loadProjects();
      }
    } catch {
      alert("Failed to reset.");
    }
  };

  // If not logged in, show PIN Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4 selection:bg-blue-600 selection:text-white">
        <div className="relative w-full max-w-md bg-[#080E1C] border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-400 mx-auto mb-6">
            <Lock className="w-7 h-7" />
          </div>

          <h1 className="text-2xl font-black text-white text-center tracking-tight mb-2 uppercase">
            Studio Admin Portal
          </h1>
          <p className="text-xs text-[#94A3B8] text-center mb-8 font-mono">
            Direct YouTube Import & Portfolio Control Center
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-[#94A3B8] mb-2">
                Studio Security PIN
              </label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter PIN (Default: zenith2026)"
                className="w-full px-4 py-3 rounded-xl bg-[#030712] border border-white/15 text-white placeholder-white/30 text-center tracking-widest font-mono text-lg focus:outline-none focus:border-cyan-400 transition-colors"
                autoFocus
              />
            </div>

            {pinError && (
              <p className="text-xs text-rose-400 font-mono text-center flex items-center justify-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {pinError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm uppercase tracking-wider transition-all duration-200 shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
            >
              <span>Unlock Studio Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#94A3B8]">
            <span>Hint: <strong className="text-white">zenith2026</strong></span>
            <Link href="/" className="hover:text-white transition-colors">
              ← Return to Portfolio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-[#D7FF64] selection:text-black">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl bg-[#D7FF64] text-[#030712] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-2xl animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#030712]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D7FF64]/10 border border-[#D7FF64]/30 flex items-center justify-center text-[#D7FF64]">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black tracking-tight uppercase">
                  Zenith Studio Admin
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
                  ● LIVE DB CONNECTED
                </span>
              </div>
              <p className="text-[11px] font-mono text-[#94A3B8]">
                {projects.length} Video Projects Active · Instant YouTube Integration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center gap-2 transition-colors"
            >
              <span>View Live Portfolio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3 py-2 rounded-lg bg-white/5 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 border border-white/10 text-[#94A3B8] transition-colors"
              title="Reset projects to default showroom seed"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[#94A3B8] hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* SECTION 1: INSTANT YOUTUBE IMPORTER (The Main Superpower) */}
        <section className="bg-gradient-to-b from-[#091122] to-[#060B16] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D7FF64]/5 blur-3xl pointer-events-none rounded-full" />

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D7FF64]/10 border border-[#D7FF64]/20 text-[#D7FF64] text-xs font-mono uppercase tracking-widest mb-3">
              <Youtube className="w-4 h-4 text-rose-500" />
              <span>Instant YouTube Importer</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-2">
              Paste Any YouTube or Shorts Link
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] mb-6">
              Paste a public or unlisted YouTube video URL, short link, or vertical Shorts URL. The system automatically extracts the ID, grabs the max-res thumbnail, title, and configures the cinema player.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={ytUrl}
                  onChange={(e) => setYtUrl(e.target.value)}
                  onPaste={(e) => {
                    const pasted = e.clipboardData.getData("text");
                    if (pasted) {
                      setTimeout(() => handleFetchYoutubeMeta(pasted), 100);
                    }
                  }}
                  placeholder="https://www.youtube.com/watch?v=... or https://youtube.com/shorts/..."
                  className="w-full px-4 py-3.5 rounded-xl bg-[#030712] border border-white/20 text-white placeholder-white/30 font-mono text-xs sm:text-sm focus:outline-none focus:border-[#D7FF64] transition-colors"
                />
              </div>

              <button
                type="button"
                onClick={() => handleFetchYoutubeMeta()}
                disabled={fetchingMeta || !ytUrl.trim()}
                className="px-6 py-3.5 rounded-xl bg-[#D7FF64] hover:bg-[#c6f052] disabled:opacity-50 text-[#030712] font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-[#D7FF64]/20"
              >
                {fetchingMeta ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Import Video</span>
                  </>
                )}
              </button>
            </div>

            {fetchError && (
              <p className="mt-3 text-xs text-rose-400 font-mono flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {fetchError}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-mono text-[#94A3B8]">
              <span>Supported formats:</span>
              <span className="px-2 py-0.5 rounded bg-white/5 text-white/80">youtube.com/watch?v=ID</span>
              <span className="px-2 py-0.5 rounded bg-white/5 text-white/80">youtu.be/ID</span>
              <span className="px-2 py-0.5 rounded bg-[#D7FF64]/10 text-[#D7FF64] border border-[#D7FF64]/20">youtube.com/shorts/ID (9:16)</span>
              <span className="px-2 py-0.5 rounded bg-white/5 text-white/80">Unlisted YouTube Links</span>
            </div>
          </div>
        </section>

        {/* SECTION 2: EDITING / CREATING MODAL */}
        {editingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-3xl bg-[#080E1C] border border-white/20 rounded-2xl p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#D7FF64] mb-2">
                <Scissors className="w-4 h-4" />
                <span>{isEditingExisting ? "Edit Video Entry" : "Publish Imported Video"}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black uppercase text-white mb-6">
                {editingProject.title || "Configure Video"}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-[#94A3B8] uppercase tracking-wider mb-2">
                    Project / Edit Title *
                  </label>
                  <input
                    type="text"
                    value={editingProject.title || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#030712] border border-white/15 text-white font-medium text-sm focus:border-[#D7FF64] focus:outline-none"
                    placeholder="e.g. Founder Framework: Zero to Scale"
                  />
                </div>

                {/* YouTube Video ID / Link */}
                <div>
                  <label className="block text-xs font-mono text-[#94A3B8] uppercase tracking-wider mb-2">
                    YouTube Video ID or Link *
                  </label>
                  <input
                    type="text"
                    value={editingProject.youtubeId || ""}
                    onChange={(e) => {
                      const id = extractYouTubeId(e.target.value) || e.target.value;
                      setEditingProject({
                        ...editingProject,
                        youtubeId: id,
                        thumbnail: editingProject.thumbnail || `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
                        videoSrc: `https://www.youtube.com/watch?v=${id}`,
                      });
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#030712] border border-white/15 text-white font-mono text-sm focus:border-[#D7FF64] focus:outline-none"
                    placeholder="e.g. 1FLYZdxsteo"
                  />
                </div>

                {/* Aspect Ratio Toggle (9:16 Shorts vs 16:9 Longform) */}
                <div>
                  <label className="block text-xs font-mono text-[#94A3B8] uppercase tracking-wider mb-2">
                    Aspect Ratio Framing *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingProject({ ...editingProject, aspectRatio: "9:16" })}
                      className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold uppercase transition-colors flex items-center justify-center gap-1.5 ${
                        editingProject.aspectRatio === "9:16"
                          ? "bg-[#D7FF64] text-[#030712] border-[#D7FF64]"
                          : "bg-[#030712] text-[#94A3B8] border-white/15 hover:text-white"
                      }`}
                    >
                      <span>9:16 Vertical (Shorts/Reels)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingProject({ ...editingProject, aspectRatio: "16:9" })}
                      className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold uppercase transition-colors flex items-center justify-center gap-1.5 ${
                        editingProject.aspectRatio === "16:9"
                          ? "bg-[#D7FF64] text-[#030712] border-[#D7FF64]"
                          : "bg-[#030712] text-[#94A3B8] border-white/15 hover:text-white"
                      }`}
                    >
                      <span>16:9 Widescreen (Cinema)</span>
                    </button>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-mono text-[#94A3B8] uppercase tracking-wider mb-2">
                    Category Tag
                  </label>
                  <select
                    value={editingProject.category || "Shorts & Reels"}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#030712] border border-white/15 text-white font-mono text-sm focus:border-[#D7FF64] focus:outline-none"
                  >
                    {CATEGORIES.filter((c) => c !== "All Work").map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="Shorts & Reels">Shorts & Reels</option>
                    <option value="YouTube Longform">YouTube Longform</option>
                    <option value="Documentary">Documentary</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>

                {/* Client / Creator Context */}
                <div>
                  <label className="block text-xs font-mono text-[#94A3B8] uppercase tracking-wider mb-2">
                    Client / Creator Profile
                  </label>
                  <input
                    type="text"
                    value={editingProject.clientContext || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, clientContext: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#030712] border border-white/15 text-white text-sm focus:border-[#D7FF64] focus:outline-none"
                    placeholder="e.g. Tech CEO & Creator"
                  />
                </div>

                {/* Technical / Craft Specifications */}
                <div>
                  <label className="block text-xs font-mono text-[#94A3B8] uppercase tracking-wider mb-2">
                    Technical / Craft Specifications
                  </label>
                  <input
                    type="text"
                    value={editingProject.metrics || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, metrics: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#030712] border border-white/15 text-white text-sm font-mono focus:border-[#D7FF64] focus:outline-none"
                    placeholder="e.g. 4K 60FPS · Kodak 2383 LUT · 24-Track Foley"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-xs font-mono text-[#94A3B8] uppercase tracking-wider mb-2">
                    Duration (MM:SS)
                  </label>
                  <input
                    type="text"
                    value={editingProject.duration || "0:30"}
                    onChange={(e) => setEditingProject({ ...editingProject, duration: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#030712] border border-white/15 text-white text-sm font-mono focus:border-[#D7FF64] focus:outline-none"
                    placeholder="0:45"
                  />
                </div>

                {/* Thumbnail Preview and URL */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-[#94A3B8] uppercase tracking-wider mb-2">
                    Thumbnail Image URL
                  </label>
                  <div className="flex gap-4 items-center">
                    {editingProject.thumbnail && (
                      <div className="w-24 h-16 rounded-lg overflow-hidden border border-white/20 bg-black shrink-0">
                        <img
                          src={editingProject.thumbnail}
                          alt="Thumbnail preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <input
                      type="text"
                      value={editingProject.thumbnail || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, thumbnail: e.target.value })}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-[#030712] border border-white/15 text-white text-xs font-mono focus:border-[#D7FF64] focus:outline-none"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono text-[#94A3B8] uppercase tracking-wider mb-2">
                    Editorial Breakdown / Brief
                  </label>
                  <textarea
                    rows={2}
                    value={editingProject.description || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#030712] border border-white/15 text-white text-sm focus:border-[#D7FF64] focus:outline-none"
                    placeholder="Explain the pacing, story structure, and why this edit succeeded..."
                  />
                </div>

                {/* Sound & Pacing Notes */}
                <div>
                  <label className="block text-xs font-mono text-[#94A3B8] uppercase tracking-wider mb-2">
                    Sound Design Notes
                  </label>
                  <input
                    type="text"
                    value={editingProject.soundDesignNotes || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, soundDesignNotes: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#030712] border border-white/15 text-white text-xs font-mono focus:border-[#D7FF64] focus:outline-none"
                    placeholder="e.g. 4-track mix with custom risers and bass drops"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#94A3B8] uppercase tracking-wider mb-2">
                    Pacing Style / Cut Rhythm
                  </label>
                  <input
                    type="text"
                    value={editingProject.pacingStyle || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, pacingStyle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#030712] border border-white/15 text-white text-xs font-mono focus:border-[#D7FF64] focus:outline-none"
                    placeholder="e.g. 1.2s average cut duration / Staccato cadence"
                  />
                </div>

                {/* Checkboxes: Featured & Published */}
                <div className="sm:col-span-2 flex flex-wrap items-center gap-6 pt-3 border-t border-white/10">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-mono">
                    <input
                      type="checkbox"
                      checked={editingProject.featured || false}
                      onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                      className="w-4 h-4 accent-[#D7FF64] rounded cursor-pointer"
                    />
                    <span className="text-white">Pin as Hero / Featured Showcase Reel</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-mono">
                    <input
                      type="checkbox"
                      checked={editingProject.published ?? true}
                      onChange={(e) => setEditingProject({ ...editingProject, published: e.target.checked })}
                      className="w-4 h-4 accent-[#D7FF64] rounded cursor-pointer"
                    />
                    <span className="text-white">Published (Visible on Portfolio)</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-[#94A3B8] uppercase"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProject}
                  disabled={saveLoading}
                  className="px-6 py-2.5 rounded-xl bg-[#D7FF64] hover:bg-[#c6f052] text-[#030712] font-black text-xs font-mono uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#D7FF64]/20"
                >
                  {saveLoading ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{isEditingExisting ? "Save Changes" : "Publish to Portfolio"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: ALL PROJECTS DIRECTORY & REORDERING */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                <span>Active Portfolio Videos</span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-xs font-mono">
                  {projects.length}
                </span>
              </h2>
              <p className="text-xs text-[#94A3B8] font-mono">
                Drag or use arrows to change the exact order videos appear on the live website.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditingProject({
                  title: "",
                  category: "Shorts & Reels",
                  clientContext: "Creator",
                  description: "",
                  duration: "0:30",
                  aspectRatio: "9:16",
                  videoType: "youtube",
                  youtubeId: "",
                  thumbnail: "",
                  videoSrc: "",
                  metrics: "",
                  editBreakdown: ["Precision cuts", "Active word captions", "Sound design master"],
                  soundDesignNotes: "Multi-track audio mix",
                  pacingStyle: "1.2s average cut rhythm",
                  featured: false,
                  published: true,
                  timecode: "00:00:30:00",
                });
                setIsEditingExisting(false);
              }}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-mono text-white flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4 text-[#D7FF64]" />
              <span>Add Custom Project Manually</span>
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs font-mono text-[#94A3B8] flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Loading projects from database...</span>
            </div>
          ) : projects.length === 0 ? (
            <div className="p-12 text-center bg-[#080E1C] border border-white/10 rounded-2xl">
              <p className="text-sm text-[#94A3B8] mb-4">No video projects currently in the portfolio.</p>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="px-4 py-2 rounded-xl bg-[#D7FF64] text-[#030712] font-bold text-xs uppercase"
              >
                Seed with Sample Videos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {projects.map((project, idx) => (
                <div
                  key={project.id}
                  className={`group relative bg-[#080E1C] hover:bg-[#0c1428] border ${
                    project.featured ? "border-[#D7FF64]/40" : "border-white/10"
                  } rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-200`}
                >
                  {/* Left: Reorder controls + Thumbnail + Details */}
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* Move Up / Down */}
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMove(idx, "up")}
                        className="p-1 rounded bg-white/5 hover:bg-white/15 disabled:opacity-20 text-white transition-colors"
                        title="Move Up"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === projects.length - 1}
                        onClick={() => handleMove(idx, "down")}
                        className="p-1 rounded bg-white/5 hover:bg-white/15 disabled:opacity-20 text-white transition-colors"
                        title="Move Down"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Thumbnail preview */}
                    <div
                      className={`relative ${
                        project.aspectRatio === "9:16" ? "w-14 h-20" : "w-24 h-16"
                      } rounded-lg overflow-hidden bg-black shrink-0 border border-white/15 cursor-pointer group/thumb`}
                      onClick={() => setPreviewProject(project)}
                    >
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
                        <Play className="w-4 h-4 fill-white text-white" />
                      </div>
                      <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-[9px] font-mono text-white/80">
                        {project.aspectRatio}
                      </span>
                    </div>

                    {/* Details */}
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white uppercase font-bold">
                          #{idx + 1}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D7FF64]/10 text-[#D7FF64] border border-[#D7FF64]/20 uppercase font-semibold">
                          {project.category}
                        </span>
                        {project.featured && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 uppercase font-semibold">
                            ★ Featured Hero
                          </span>
                        )}
                        {!project.published && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 uppercase font-semibold">
                            Hidden / Draft
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-white line-clamp-1">{project.title}</h3>
                      <div className="text-xs text-[#94A3B8] font-mono flex items-center gap-3 mt-1">
                        <span>{project.clientContext}</span>
                        <span>•</span>
                        <span>{project.duration}</span>
                        {project.metrics && (
                          <>
                            <span>•</span>
                            <span className="text-white/80">{project.metrics}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Action buttons */}
                  <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
                    {/* Preview Button */}
                    <button
                      type="button"
                      onClick={() => setPreviewProject(project)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-white flex items-center gap-1.5 transition-colors"
                      title="Preview Video Player"
                    >
                      <Play className="w-3.5 h-3.5 text-[#D7FF64]" />
                      <span className="hidden sm:inline">Preview</span>
                    </button>

                    {/* Toggle Featured */}
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(project)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors ${
                        project.featured
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                          : "bg-white/5 text-[#94A3B8] border-white/10 hover:text-white"
                      }`}
                      title={project.featured ? "Unfeature" : "Make Featured Hero"}
                    >
                      ★
                    </button>

                    {/* Toggle Visibility */}
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(project)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors"
                      title={project.published ? "Hide from portfolio" : "Publish to portfolio"}
                    >
                      {project.published ? (
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5 text-rose-400" />
                      )}
                    </button>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProject(project);
                        setIsEditingExisting(true);
                      }}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors"
                      title="Edit project details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDeleteProject(project.id, project.title)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/20 text-[#94A3B8] hover:text-rose-400 transition-colors"
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
      </main>

      {/* IN-ADMIN VIDEO PREVIEW MODAL */}
      {previewProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in"
          onClick={() => setPreviewProject(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-[#080E1C] border border-white/20 rounded-2xl overflow-hidden shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D7FF64]/10 text-[#D7FF64] uppercase font-bold">
                  {previewProject.category} · {previewProject.aspectRatio}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{previewProject.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewProject(null)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-center bg-black/60 rounded-xl overflow-hidden p-2">
              <div
                className={`relative w-full ${
                  previewProject.aspectRatio === "9:16" ? "max-w-[340px] aspect-[9/16]" : "max-w-3xl aspect-[16/9]"
                } rounded-lg overflow-hidden border border-white/10`}
              >
                {previewProject.youtubeId ? (
                  <iframe
                    src={getYouTubeEmbedUrl(previewProject.youtubeId, { autoplay: true, mute: false })}
                    title={previewProject.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <video
                    src={previewProject.videoSrc}
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminPage(props: AdminPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#030712] flex items-center justify-center font-mono text-cyan-400 text-xs">
          LOADING STUDIO ADMIN...
        </div>
      }
    >
      <AdminContent {...props} />
    </Suspense>
  );
}

export default AdminPage;
