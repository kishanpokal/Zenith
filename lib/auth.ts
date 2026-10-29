import crypto from "crypto";
import { getCachedFirestoreToken } from "@/lib/firebase";

const FIREBASE_PROJECT_ID =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "zenith-digital-studio";

/**
 * Retrieves the secret admin fallback token from server environment variables.
 */
export function getAdminSecretToken(): string {
  return (
    process.env.ADMIN_SECRET_TOKEN ||
    process.env.NEXT_PUBLIC_ADMIN_SECRET_TOKEN ||
    "zenith-vault-2026"
  );
}

/**
 * Validates a Firebase Auth ID Token (JWT) issued by Google Firebase Authentication.
 */
export function verifyFirebaseIdToken(token: string): { valid: boolean; email?: string } {
  if (!token) return { valid: false };

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return { valid: false };

    // Decode header & payload
    const payloadJson = Buffer.from(parts[1], "base64url").toString("utf-8");
    const payload = JSON.parse(payloadJson);

    const now = Math.floor(Date.now() / 1000);

    // Validate Firebase Auth standard claims
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
 * Validates a request token using:
 * 1. Firebase Auth ID Token (from client sign-in)
 * 2. Current dynamic token stored in Firestore ('admin_config/secret_vault')
 * 3. Or fallback comparison against ADMIN_SECRET_TOKEN
 */
export function verifyAdminToken(providedToken: string | null | undefined): boolean {
  if (!providedToken) return false;

  const trimmed = providedToken.trim();

  // 1. Verify as Firebase Auth ID Token (Standard JWT format starts with eyJ)
  if (trimmed.startsWith("eyJ")) {
    const firebaseResult = verifyFirebaseIdToken(trimmed);
    if (firebaseResult.valid) {
      return true;
    }
  }

  // 2. Verify against dynamic token from Firestore
  try {
    const firestoreToken = getCachedFirestoreToken();
    if (firestoreToken && trimmed === firestoreToken) {
      return true;
    }
  } catch {}

  // 3. Fallback: Constant-time comparison against master secret token in env
  const secret = getAdminSecretToken();
  if (!secret) return false;

  try {
    const a = Buffer.from(trimmed);
    const b = Buffer.from(secret.trim());
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return trimmed === secret.trim();
  }
}

/**
 * Extracts the admin token from request headers (Authorization: Bearer <token>, x-admin-token) or URL query.
 */
export function extractAuthToken(req: Request): string | null {
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    return authHeader.substring(7).trim();
  }

  const xAdminToken = req.headers.get("x-admin-token");
  if (xAdminToken) {
    return xAdminToken.trim();
  }

  try {
    const url = new URL(req.url);
    const queryToken = url.searchParams.get("token");
    if (queryToken) return queryToken.trim();
  } catch {
    // ignore
  }

  return null;
}
