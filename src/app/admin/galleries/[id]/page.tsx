import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/supabase/require-admin";
import { createClient } from "@/lib/supabase/server";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import PhotoUploader from "@/components/admin/PhotoUploader";

import { ADMIN_LABELS } from "@/data/admin/labels";
import { GALLERY_CONFIG } from "@/data/admin/gallery";
import { PHOTO_UPLOAD_CONFIG } from "@/data/admin/photo-upload";
import GalleryLinkManager from "@/components/admin/GalleryLinkManager";
import GalleryStatusButton from "@/components/admin/GalleryStatusButton";

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

  const { data: photos, error: photosError } = await supabase
    .from("gallery_photos")
    .select("id, file_name, storage_path")
    .eq("gallery_id", id)
    .order("created_at", { ascending: false });

  const photosWithUrls = await Promise.all(
    (photos ?? []).map(async (photo) => {
      const { data, error } = await supabase.storage
        .from(PHOTO_UPLOAD_CONFIG.bucket)
        .createSignedUrl(photo.storage_path, 3600);

      return {
        ...photo,
        signedUrl: error ? null : data.signedUrl,
      };
    }),
  );

  const expired =
    gallery.expires_at && new Date(gallery.expires_at) <= new Date();

  const statusKey = !gallery.is_active
    ? "inactive"
    : expired
      ? "expired"
      : "active";

  const status = GALLERY_CONFIG.status[statusKey];

  const labels = ADMIN_LABELS.galleries;

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-main">
        <AdminHeader />

        <main className="admin-content">
          <Link href="/admin/galleries" className="gallery-details__back">
            ← {labels.back}
          </Link>

          <div className="admin-content__heading">
            <h1>{gallery.client_name}</h1>
            <p>{labels.detailsDescription}</p>
          </div>

          <section className="gallery-details">
            <div className="gallery-details__header">
              <h2>{labels.information}</h2>

              <div className="gallery-details__actions">
                <span
                  className={`gallery-details__status gallery-details__status--${status.className}`}
                >
                  {status.label}
                </span>

                <GalleryStatusButton
                  galleryId={id}
                  isActive={gallery.is_active}
                />
              </div>
            </div>

            <dl>
              <div>
                <dt>{labels.client}</dt>
                <dd>{gallery.client_name}</dd>
              </div>

              <div>
                <dt>{labels.created}</dt>
                <dd>
                  {new Date(gallery.created_at).toLocaleDateString(
                    GALLERY_CONFIG.dateLocale,
                  )}
                </dd>
              </div>

              <div>
                <dt>{labels.expiration}</dt>
                <dd>
                  {gallery.expires_at
                    ? new Date(gallery.expires_at).toLocaleDateString(
                        GALLERY_CONFIG.dateLocale,
                      )
                    : labels.noExpiration}
                </dd>
              </div>

              <div>
                <dt>{labels.photos}</dt>
                <dd>{photosError ? "—" : photosWithUrls.length}</dd>
              </div>
            </dl>
          </section>

          <section className="gallery-details__link">
            <GalleryLinkManager galleryId={id} />
          </section>

          <section className="gallery-details__photos">
            <h2>{labels.photoSection}</h2>

            <PhotoUploader galleryId={id} />
          </section>

          <section className="gallery-details__photo-grid">
            <h2>{labels.uploadedPhotos}</h2>

            {photosError ? (
              <p>{labels.photosLoadError}</p>
            ) : photosWithUrls.length === 0 ? (
              <p>{labels.noPhotos}</p>
            ) : (
              <div className="photo-grid">
                {photosWithUrls.map((photo) => (
                  <article className="photo-grid__item" key={photo.id}>
                    {photo.signedUrl ? (
                      <>
                        <Image
                          src={photo.signedUrl}
                          alt={photo.file_name}
                          width={600}
                          height={450}
                          unoptimized
                        />

                        <div className="photo-grid__info">
                          <span title={photo.file_name}>{photo.file_name}</span>

                          <a href={photo.signedUrl} download={photo.file_name}>
                            {labels.download}
                          </a>
                        </div>
                      </>
                    ) : (
                      <p>{labels.photoLoadError}</p>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
