"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

import { ADMIN_LABELS } from "@/data/admin/labels";

export default function AdminHeader() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <header className="admin-header">
      <span>{ADMIN_LABELS.header.title}</span>

      <button onClick={handleLogout}>{ADMIN_LABELS.navigation.logout}</button>
    </header>
  );
}
