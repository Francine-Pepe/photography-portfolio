import { createClient } from "@/lib/supabase/client";

import {
  createPhotoUploadUrl,
  savePhotoRecord,
} from "@/app/admin/galleries/[id]/actions";

import { PHOTO_UPLOAD_CONFIG } from "@/data/admin/photo-upload";
import { ADMIN_LABELS } from "@/data/admin/labels";

export async function uploadPhoto(galleryId: string, file: File) {
  const { allowedTypes, maxFileSize, bucket } = PHOTO_UPLOAD_CONFIG;

  if (!allowedTypes.includes(file.type)) {
    throw new Error(ADMIN_LABELS.uploads.unsupported);
  }

  if (file.size <= 0 || file.size > maxFileSize) {
    throw new Error(ADMIN_LABELS.uploads.tooLarge);
  }

  const upload = await createPhotoUploadUrl(
    galleryId,
    file.name,
    file.type,
    file.size,
  );

  if ("error" in upload) {
    throw new Error(upload.error);
  }

  const supabase = createClient();

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .uploadToSignedUrl(upload.path, upload.token, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const result = await savePhotoRecord(
    galleryId,
    file.name,
    upload.path,
    file.type,
    file.size,
  );

  if ("error" in result) {
    throw new Error(result.error);
  }

  return {
    success: true,
    path: upload.path,
  };
}
