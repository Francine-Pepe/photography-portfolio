import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { createClient } from "@/lib/supabase/server";
import CreateGalleryForm from "@/components/admin/CreateGalleryForm";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { ADMIN_LABELS } from "@/data/admin/labels";
import { GALLERY_CONFIG } from "@/data/admin/gallery";
import "@/styles/admin/galleries.scss";
import "@/styles/admin/photo-uploader.scss";

export const dynamic = "force-dynamic";

export default async function GalleriesPage() {
  await requireAdmin();

  const supabase = await createClient();

  const { data: galleries, error } = await supabase
    .from("galleries")
    .select("id, client_name, created_at, expires_at, is_active")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching galleries:", error);
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-main">
        <AdminHeader />

        <main className="admin-content">
          <div className="admin-content__heading">
            <h1>Client galleries</h1>
            <p>Create and manage private client galleries.</p>
          </div>

          <section className="gallery-create">
            <h2 className="font-heading">Create a new gallery</h2>
            <CreateGalleryForm />
          </section>

          <section className="gallery-list">
            <h2 className="font-heading">All galleries</h2>

            {error ? (
              <p>Unable to load galleries.</p>
            ) : !galleries?.length ? (
              <p>No galleries created yet.</p>
            ) : (
              <div className="gallery-list__table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>{ADMIN_LABELS.galleries.client}</th>
                      <th>{ADMIN_LABELS.galleries.created}</th>
                      <th>{ADMIN_LABELS.galleries.expires}</th>
                      <th>{ADMIN_LABELS.galleries.status}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {galleries.map((gallery) => {
                      const expired =
                        gallery.expires_at &&
                        new Date(gallery.expires_at) <= new Date();

                      const status = !gallery.is_active
                        ? GALLERY_CONFIG.status.inactive
                        : expired
                          ? GALLERY_CONFIG.status.expired
                          : GALLERY_CONFIG.status.active;

                      return (
                        <tr key={gallery.id}>
                          <td>
                            <Link href={`/admin/galleries/${gallery.id}`}>
                              {gallery.client_name}
                            </Link>
                          </td>

                          <td>
                            {new Date(gallery.created_at).toLocaleDateString(
                              GALLERY_CONFIG.dateLocale,
                            )}
                          </td>

                          <td>
                            {gallery.expires_at
                              ? new Date(gallery.expires_at).toLocaleDateString(
                                  GALLERY_CONFIG.dateLocale,
                                )
                              : "No expiration"}
                          </td>

                          <td>
                            <span
                              className={`gallery-status gallery-status--${status.className}`}
                            >
                              {status.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <Link href="/admin/dashboard" className="galleries-back">
            ← Back to dashboard
          </Link>
        </main>
      </div>
    </div>
  );
}
