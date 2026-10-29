import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAdminUrlTokenFromDb } from "@/lib/firebase";
import AdminDashboardClient from "./admin-dashboard-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Console — Zenith Studio Vault",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default async function SecretAdminPage({
  params,
}: {
  params: { token: string };
}) {
  const { token } = params;

  // Strict dynamic verification against Firestore collection 'admin_config/secret_vault'
  const expectedToken = await getAdminUrlTokenFromDb();

  // If token does not match Firestore record, immediately reject with 404
  if (!expectedToken || token !== expectedToken) {
    notFound();
  }

  return <AdminDashboardClient token={token} />;
}
