import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { verifyAdminToken } from "@/lib/auth";
import AdminDashboardClient from "./admin-dashboard-client";

export const metadata: Metadata = {
  title: "Console — Zenith Studio Vault",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function SecretAdminPage({
  params,
}: {
  params: { token: string };
}) {
  const { token } = params;

  // Strict server-side verification against ADMIN_SECRET_TOKEN
  if (!verifyAdminToken(token)) {
    notFound();
  }

  return <AdminDashboardClient token={token} />;
}
