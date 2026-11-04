import "server-only";

import { createHash } from "node:crypto";

import { createAdminClient } from "@/lib/supabase/admin";
import { PHOTO_UPLOAD_CONFIG } from "@/data/admin/photo-upload";

export async function getClientGallery(token: string) {
  // Validate token format (32 bytes encoded as base64url)
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) {
    return null;
  }

  // Hash token using the same algorithm as createGallery
  const tokenHash = createHash("sha256").update(token).digest("hex");

  const supabase = createAdminClient();

  // Find gallery using its token hash
  const { data: gallery, error: galleryError } = await supabase
    .from("galleries")
    .select("id, client_name, created_at, expires_at, is_active")
    .eq("access_token_hash", tokenHash)
    .maybeSingle();

  if (galleryError) {
    console.error("Gallery lookup error:", galleryError);
    return null;
  }

  if (!gallery || !gallery.is_active) {
    return null;
  }

  // Check expiration
  if (
    gallery.expires_at &&
    new Date(gallery.expires_at).getTime() <= Date.now()
  ) {
    return null;
  }

  // Retrieve gallery photos
  const { data: photos, error: photosError } = await supabase
    .from("gallery_photos")
    .select("id, file_name, storage_path, mime_type, file_size, created_at")
    .eq("gallery_id", gallery.id)
    .order("created_at", { ascending: false });

  if (photosError) {
    console.error("Gallery photos lookup error:", photosError);
    throw new Error("Unable to retrieve gallery photos.");
  }

  // Generate temporary signed URLs
  const photosWithUrls = await Promise.all(
    (photos ?? []).map(async (photo) => {
      const { data, error } = await supabase.storage
        .from(PHOTO_UPLOAD_CONFIG.bucket)
        .createSignedUrl(photo.storage_path, 3600);

      return {
        id: photo.id,
        fileName: photo.file_name,
        mimeType: photo.mime_type,
        fileSize: photo.file_size,
        signedUrl: error ? null : data.signedUrl,
      };
    }),
  );

  // Return only the information needed by the client
  return {
    id: gallery.id,
    clientName: gallery.client_name,
    createdAt: gallery.created_at,
    expiresAt: gallery.expires_at,
    photos: photosWithUrls,
  };
}
