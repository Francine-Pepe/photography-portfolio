import { createHash } from "node:crypto";
import { Readable, PassThrough } from "node:stream";
import * as archiver from "archiver";

import { createAdminClient } from "@/lib/supabase/admin";
import { PHOTO_UPLOAD_CONFIG } from "@/data/admin/photo-upload";

export const runtime = "nodejs";

type Props = {
  params: Promise<{ token: string }>;
};

export async function GET(_request: Request, { params }: Props) {
  const { token } = await params;

  // Validate token format
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) {
    return new Response("Gallery not found.", { status: 404 });
  }

  const tokenHash = createHash("sha256").update(token).digest("hex");

  const supabase = createAdminClient();

  // Find gallery
  const { data: gallery, error: galleryError } = await supabase
    .from("galleries")
    .select("id, client_name, expires_at, is_active")
    .eq("access_token_hash", tokenHash)
    .maybeSingle();

  if (
    galleryError ||
    !gallery ||
    !gallery.is_active ||
    (gallery.expires_at && new Date(gallery.expires_at).getTime() <= Date.now())
  ) {
    return new Response("Gallery not found or expired.", {
      status: 404,
    });
  }

  // Get gallery photos
  const { data: photos, error: photosError } = await supabase
    .from("gallery_photos")
    .select("file_name, storage_path")
    .eq("gallery_id", gallery.id);

  if (photosError) {
    console.error("ZIP photo lookup error:", photosError);

    return new Response("Unable to retrieve gallery photos.", {
      status: 500,
    });
  }

  if (!photos || photos.length === 0) {
    return new Response("No photos available.", { status: 404 });
  }

  const archive = archiver("zip", {
    zlib: { level: 5 },
  });

  const output = new PassThrough();

  archive.on("warning", (error) => {
    console.warn("ZIP warning:", error);
  });

  archive.on("error", (error) => {
    console.error("ZIP creation error:", error);
    output.destroy(error);
  });

  archive.pipe(output);

  try {
    for (const photo of photos) {
      const { data, error } = await supabase.storage
        .from(PHOTO_UPLOAD_CONFIG.bucket)
        .createSignedUrl(photo.storage_path, 3600);

      if (error || !data?.signedUrl) {
        throw new Error(`Unable to access photo: ${photo.file_name}`);
      }

      const response = await fetch(data.signedUrl);

      if (!response.ok || !response.body) {
        throw new Error(`Unable to download photo: ${photo.file_name}`);
      }

      const stream = Readable.fromWeb(response.body as never);

      archive.append(stream, {
        name: photo.file_name.replace(/[\\/]/g, "_"),
      });
    }

    await archive.finalize();
  } catch (error) {
    console.error("ZIP download error:", error);
    archive.destroy(error as Error);

    return new Response("Unable to create ZIP file.", {
      status: 500,
    });
  }

  const safeName =
    gallery.client_name
      .replace(/[^a-zA-Z0-9-_ ]/g, "")
      .trim()
      .replace(/\s+/g, "-") || "gallery";

  const filename = `${safeName}-photos.zip`;

  return new Response(Readable.toWeb(output) as ReadableStream, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
