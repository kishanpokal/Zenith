"use client";

import React, { useState } from "react";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AdminLoginProps {
  onSuccess: (token: string, email: string) => void;
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        cleanEmail,
        cleanPassword
      );
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      setSuccessMsg("Confirmed! Unlocking Vault...");

      setTimeout(() => {
        onSuccess(idToken, user.email || cleanEmail);
      }, 500);
    } catch (err: any) {
      const code = err?.code || "";
      console.error("Firebase Auth login error:", code, err);

      if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
        setError("Invalid email or password. Please verify your credentials.");
      } else if (code === "auth/operation-not-allowed") {
        setError("Email/Password provider is disabled. Enable it in Firebase Console > Authentication > Sign-in method.");
      } else if (code === "auth/too-many-requests") {
        setError("Access temporarily blocked due to many failed login attempts. Try again later or reset password.");
      } else if (code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError(err?.message || "Failed to authenticate with Firebase.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col justify-center items-center px-4 py-12 relative selection:bg-[#D4AF37] selection:text-[#09090B]">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(212,175,55,0.06),transparent_60%)] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#121216] border border-white/[0.08] mb-4 text-[10px] font-mono uppercase tracking-wider text-[#D4AF37]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            <span>ZENITH VAULT ACCESS</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-bold uppercase tracking-tight text-white mb-2">
            ADMIN GATEWAY
          </h1>
          <p className="text-xs text-white/50 font-sans">
            Enter your admin email and password to access the studio control panel.
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-[#121216] border border-white/[0.08] rounded-sm p-6 sm:p-8 shadow-2xl relative">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-white/60 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@zenithstudio.com"
                  required
                  autoComplete="email"
                  className="w-full bg-[#09090B] border border-white/[0.1] rounded-sm pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37] transition-colors font-mono"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-white/60 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full bg-[#09090B] border border-white/[0.1] rounded-sm pl-10 pr-10 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37] transition-colors font-mono tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-white transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-sm bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="p-3 rounded-sm bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-sm bg-[#D4AF37] hover:bg-[#F59E0B] text-[#09090B] font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-[#D4AF37]/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Account...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sign In & Unlock</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security Footer Note */}
        <div className="text-center mt-6 text-[10px] font-mono text-white/30 uppercase tracking-wider flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]/60" />
          <span>Protected by Firebase Authentication</span>
        </div>
      </div>
    </div>
  );
}
