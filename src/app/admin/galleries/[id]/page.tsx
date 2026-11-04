import Link from "next/link";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/supabase/require-admin";
import { createClient } from "@/lib/supabase/server";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import PhotoUploader from "@/components/admin/PhotoUploader";
import { ADMIN_LABELS } from "@/data/admin/labels";
import { GALLERY_CONFIG } from "@/data/admin/gallery";

import "@/styles/admin/gallery-details.scss";

type Props = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function GalleryDetailsPage({ params }: Props) {
  await requireAdmin();

  const { id } = await params;
  const supabase = await createClient();

  const { data: gallery, error } = await supabase
    .from("galleries")
    .select("id, client_name, created_at, expires_at, is_active")
    .eq("id", id)
    .single();

  if (error || !gallery) {
    notFound();
  }

  const { count, error: photosError } = await supabase
    .from("gallery_photos")
    .select("*", { count: "exact", head: true })
    .eq("gallery_id", id);

  const expired =
    gallery.expires_at && new Date(gallery.expires_at) <= new Date();

  const status = !gallery.is_active
    ? "Inactive"
    : expired
      ? "Expired"
      : "Active";

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-main">
        <AdminHeader />

        <main className="admin-content">
          <Link href="/admin/galleries" className="gallery-details__back">
            ← Back to galleries
          </Link>

          <div className="admin-content__heading">
            <h1>{gallery.client_name}</h1>
            <p>Manage the client private photo gallery.</p>
          </div>

          <section className="gallery-details">
            <div className="gallery-details__header">
              <h2>Gallery information</h2>

              <span
                className={`gallery-details__status gallery-details__status--${status.toLowerCase()}`}
              >
                {status}
              </span>
            </div>

            <dl>
              <div>
                <dt>Client</dt>
                <dd>{gallery.client_name}</dd>
              </div>

              <div>
                <dt>Created</dt>
                <dd>
                  {new Date(gallery.created_at).toLocaleDateString("en-GB")}
                </dd>
              </div>

              <div>
                <dt>Expiration date</dt>
                <dd>
                  {gallery.expires_at
                    ? new Date(gallery.expires_at).toLocaleDateString("en-GB")
                    : "No expiration"}
                </dd>
              </div>

              <div>
                <dt>Photos uploaded</dt>
                <dd>{photosError ? "Unable to load" : (count ?? 0)}</dd>
              </div>
            </dl>
          </section>

          <section className="gallery-details__photos">
            <h2>Photos</h2>

            <PhotoUploader galleryId={id} />
          </section>
        </main>
      </div>
    </div>
  );
}
