import { notFound } from "next/navigation";

/**
 * Access to the root `/admin` path is permanently blocked.
 * The administration CMS is only accessible via secret URL `/admin/[token]`.
 */
export default function AdminRootPage() {
  notFound();
}
