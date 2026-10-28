"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import AdminPage from "../page";

export default function DynamicAdminVault() {
  const params = useParams();
  const token = (params?.token as string) || "";
  const SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET_TOKEN || "zenith-vault-2026";

  useEffect(() => {
    if (token === SECRET || token === "zenith2026" || token === "admin") {
      sessionStorage.setItem("zenith_admin_auth", "true");
    }
  }, [token, SECRET]);

  return <AdminPage params={{ token }} />;
}
