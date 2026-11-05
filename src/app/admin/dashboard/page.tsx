import { requireAdmin } from "@/lib/supabase/require-admin";
import { createClient } from "@/lib/supabase/server";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

import "@/styles/admin/dashboard.scss";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const user = await requireAdmin();
  const supabase = await createClient();

  const now = new Date().toISOString();

  const [
    { count: totalCount, error: totalError },
    { count: activeCount, error: activeError },
  ] = await Promise.all([
    supabase.from("galleries").select("id", { count: "exact", head: true }),

    supabase
      .from("galleries")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true)
      .or(`expires_at.is.null,expires_at.gt.${now}`),
  ]);

  if (totalError) {
    console.error("Total galleries count error:", totalError);
  }

  if (activeError) {
    console.error("Active galleries count error:", activeError);
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-main">
        <AdminHeader />

        <main className="admin-content">
          <div className="admin-content__heading">
            <h1>Overview</h1>
            <p>Welcome back, {user.email}.</p>
          </div>

          <section className="admin-stats">
            <article>
              <span>Total galleries</span>
              <strong>{totalError ? "—" : (totalCount ?? 0)}</strong>
            </article>

            <article>
              <span>Active galleries</span>
              <strong>{activeError ? "—" : (activeCount ?? 0)}</strong>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}
