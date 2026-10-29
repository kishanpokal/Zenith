import { notFound } from "next/navigation";

/**
 * Direct access to `/admin` is permanently blocked (404 Page Not Found).
 * The studio control panel is ONLY accessible via the secret token URL
 * configured in Firestore: `/admin/[token]`.
 */
export default function AdminRootPage() {
  notFound();
}
