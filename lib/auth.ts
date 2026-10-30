import {
  timingSafeCompare,
  verifyFirebaseIdToken,
  extractToken,
  verifyAdminToken,
  verifyAdminRequest,
  enforceRateLimit,
} from "@/lib/auth-guard";

export function getAdminSecretToken(): string {
  return (
    process.env.ADMIN_SECRET_TOKEN ||
    process.env.NEXT_PUBLIC_ADMIN_SECRET_TOKEN ||
    "zenith-vault-2026"
  );
}

export {
  timingSafeCompare,
  verifyFirebaseIdToken,
  extractToken as extractAuthToken,
  verifyAdminToken,
  verifyAdminRequest,
  enforceRateLimit,
};
