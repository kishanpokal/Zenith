import crypto from "crypto";

/**
 * Retrieves the secret admin token from server environment variables.
 */
export function getAdminSecretToken(): string {
  return (
    process.env.ADMIN_SECRET_TOKEN ||
    process.env.NEXT_PUBLIC_ADMIN_SECRET_TOKEN ||
    ""
  );
}

/**
 * Validates a provided token using constant-time comparison against ADMIN_SECRET_TOKEN.
 */
export function verifyAdminToken(providedToken: string | null | undefined): boolean {
  const secret = getAdminSecretToken();
  if (!secret || !providedToken) return false;

  try {
    const a = Buffer.from(providedToken.trim());
    const b = Buffer.from(secret.trim());
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return providedToken.trim() === secret.trim();
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
