import { requireAdmin } from "@/lib/supabase/require-admin";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import "@/styles/admin/dashboard.scss";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const user = await requireAdmin();

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-main">
        <AdminHeader />

        <main className="admin-content">
          <div className="admin-content__heading">
            <div>
              <h1>Overview</h1>
              <p>Welcome back, {user.email}.</p>
            </div>
          </div>

          <section className="admin-stats">
            <article>
              <span>Total galleries</span>
              <strong>0</strong>
            </article>

            <article>
              <span>Active galleries</span>
              <strong>0</strong>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}
