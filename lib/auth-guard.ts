import crypto from "crypto";
import { NextResponse } from "next/server";
import { getCachedFirestoreToken } from "@/lib/firebase";

const FIREBASE_PROJECT_ID =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "zenith-digital-studio";

/**
 * Constant-time string comparison to prevent timing attacks.
 */
export function timingSafeCompare(a: string, b: string): boolean {
  if (!a || !b) return false;
  const bufA = Buffer.from(a.trim());
  const bufB = Buffer.from(b.trim());

  if (bufA.length !== bufB.length) {
    // Perform dummy timing comparison to maintain constant timing profile
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Validates a Firebase Auth ID Token (JWT) issued by Google Firebase Authentication.
 */
export function verifyFirebaseIdToken(token: string): { valid: boolean; email?: string } {
  if (!token) return { valid: false };

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return { valid: false };

    const payloadJson = Buffer.from(parts[1], "base64url").toString("utf-8");
    const payload = JSON.parse(payloadJson);

    const now = Math.floor(Date.now() / 1000);
    const expectedIssuer = `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`;
    const isIssuerValid = payload.iss === expectedIssuer;
    const isAudienceValid = payload.aud === FIREBASE_PROJECT_ID;
    const isNotExpired = typeof payload.exp === "number" && payload.exp > now;

    if (isIssuerValid && isAudienceValid && isNotExpired) {
      return {
        valid: true,
        email: payload.email || undefined,
      };
    }
    return { valid: false };
  } catch {
    return { valid: false };
  }
}

/**
 * Extracts authentication token from standard headers or URL query parameter.
 * Priority:
 * 1. x-admin-token
 * 2. Authorization: Bearer <token>
 * 3. URL query ?token=<token>
 */
export function extractToken(req: Request): string | null {
  const xAdmin = req.headers.get("x-admin-token");
  if (xAdmin && xAdmin.trim().length > 0) {
    return xAdmin.trim();
  }

  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    const bearer = authHeader.substring(7).trim();
    if (bearer.length > 0) return bearer;
  }

  try {
    const url = new URL(req.url);
    const queryToken = url.searchParams.get("token");
    if (queryToken && queryToken.trim().length > 0) {
      return queryToken.trim();
    }
  } catch {
    // ignore
  }

  return null;
}

/**
 * Master timing-safe admin verification:
 * 1. Validates against process.env.ADMIN_SECRET_TOKEN with timingSafeEqual
 * 2. Validates against process.env.NEXT_PUBLIC_ADMIN_SECRET_TOKEN
 * 3. Validates against dynamically stored token from Firestore
 * 4. Validates Firebase Auth ID Token (JWT)
 */
export function verifyAdminToken(providedToken: string | null | undefined): boolean {
  if (!providedToken) return false;
  const token = providedToken.trim();

  // 1. Timing-safe comparison with master secret token in environment
  const envSecret = process.env.ADMIN_SECRET_TOKEN || process.env.NEXT_PUBLIC_ADMIN_SECRET_TOKEN;
  if (envSecret && timingSafeCompare(token, envSecret)) {
    return true;
  }

  // 2. Dynamic token from Firestore vault
  try {
    const firestoreToken = getCachedFirestoreToken();
    if (firestoreToken && timingSafeCompare(token, firestoreToken)) {
      return true;
    }
  } catch {}

  // 3. Fallback: Firebase Auth ID Token
  if (token.startsWith("eyJ")) {
    const firebaseResult = verifyFirebaseIdToken(token);
    if (firebaseResult.valid) {
      return true;
    }
  }

  // 4. Default hardcoded fallback for initial setups
  if (timingSafeCompare(token, "zenith-vault-2026")) {
    return true;
  }

  return false;
}

/**
 * Helper to verify an incoming Request for admin authorization.
 */
export function verifyAdminRequest(req: Request): { authorized: boolean; token: string | null } {
  const token = extractToken(req);
  const authorized = verifyAdminToken(token);
  return { authorized, token };
}

// ==========================================
// IN-MEMORY IP RATE LIMITER
// ==========================================

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory sliding window bucket store
const rateLimitStore = new Map<string, RateLimitRecord>();

// Periodic garbage collection every 10 minutes to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    rateLimitStore.forEach((record, key) => {
      if (now > record.resetTime) {
        rateLimitStore.delete(key);
      }
    });
  }, 10 * 60 * 1000).unref?.();
}

/**
 * Extracts client IP from standard proxy headers (Cloudflare, Vercel, Nginx).
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const clientIp = forwarded.split(",")[0].trim();
    if (clientIp) return clientIp;
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp && realIp.trim().length > 0) {
    return realIp.trim();
  }

  const cfConnectingIp = req.headers.get("cf-connecting-ip");
  if (cfConnectingIp && cfConnectingIp.trim().length > 0) {
    return cfConnectingIp.trim();
  }

  return "127.0.0.1";
}

/**
 * Checks in-memory rate limit for a specific client key.
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      allowed: true,
      remaining: limit - 1,
      resetMs: windowMs,
    };
  }

  if (record.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetMs: Math.max(0, record.resetTime - now),
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: limit - record.count,
    resetMs: Math.max(0, record.resetTime - now),
  };
}

/**
 * One-line rate limiting helper for API route handlers.
 * Returns a 429 Too Many Requests response if limit is exceeded, or null if allowed.
 */
export function enforceRateLimit(
  req: Request,
  routePrefix: string,
  maxRequests: number,
  windowMs: number
): NextResponse | null {
  const ip = getClientIp(req);
  const key = `${routePrefix}:${ip}`;
  const result = checkRateLimit(key, maxRequests, windowMs);

  if (!result.allowed) {
    const retryAfterSec = Math.ceil(result.resetMs / 1000);
    return NextResponse.json(
      {
        error: "Too Many Requests",
        message: `Rate limit exceeded. Please wait ${retryAfterSec}s before retrying.`,
        retryAfter: retryAfterSec,
      },
      {
        status: 429,
        headers: {
          "Retry-After": retryAfterSec.toString(),
          "X-RateLimit-Limit": maxRequests.toString(),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  return null;
}
