import { createHash } from "node:crypto";
import JSZip from "jszip";

import { createAdminClient } from "@/lib/supabase/admin";
import { PHOTO_UPLOAD_CONFIG } from "@/data/admin/photo-upload";

export const runtime = "nodejs";

type Props = {
  params: Promise<{ token: string }>;
};

export async function GET(_request: Request, { params }: Props) {
  const { token } = await params;

  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) {
    return new Response("Gallery not found.", { status: 404 });
  }

  const tokenHash = createHash("sha256").update(token).digest("hex");
  const supabase = createAdminClient();

  // Validate gallery
  const { data: gallery, error } = await supabase
    .from("galleries")
    .select("id, client_name, expires_at, is_active")
    .eq("access_token_hash", tokenHash)
    .maybeSingle();

  if (
    error ||
    !gallery ||
    !gallery.is_active ||
    (gallery.expires_at && new Date(gallery.expires_at) <= new Date())
  ) {
    return new Response("Gallery not found or expired.", {
      status: 404,
    });
  }

  // Get photos
  const { data: photos, error: photosError } = await supabase
    .from("gallery_photos")
    .select("file_name, storage_path")
    .eq("gallery_id", gallery.id);

  if (photosError || !photos?.length) {
    return new Response("No photos available.", { status: 404 });
  }

  try {
    const zip = new JSZip();

    for (const photo of photos) {
      const { data, error } = await supabase.storage
        .from(PHOTO_UPLOAD_CONFIG.bucket)
        .createSignedUrl(photo.storage_path, 3600);

      if (error || !data?.signedUrl) {
        throw new Error(`Unable to access ${photo.file_name}`);
      }

      const response = await fetch(data.signedUrl);

      if (!response.ok) {
        throw new Error(`Unable to download ${photo.file_name}`);
      }

      const file = await response.arrayBuffer();

      zip.file(photo.file_name, file);
    }

    const zipBuffer = await zip.generateAsync({
      type: "uint8array",
      compression: "DEFLATE",
      compressionOptions: { level: 5 },
    });

    const zipBlob = new Blob([zipBuffer.buffer as ArrayBuffer], {
      type: "application/zip",
    });

    const safeName =
      gallery.client_name.replace(/[^a-zA-Z0-9-_ ]/g, "").trim() || "gallery";

    return new Response(zipBlob, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${safeName}-photos.zip"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("ZIP download error:", error);

    return new Response("Unable to create ZIP file.", {
      status: 500,
    });
  }
}
