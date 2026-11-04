"use server";

import { randomUUID } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const BUCKET = "client-galleries";
const MAX_FILE_SIZE = 50 * 1024 * 1024;

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/tiff"];

export async function createPhotoUploadUrl(
  galleryId: string,
  fileName: string,
  fileType: string,
  fileSize: number,
) {
  const supabase = await createClient();

  // Verify admin
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== "admin") {
    return { error: "Unauthorized access." };
  }

  // Validate file
  if (!ALLOWED_TYPES.includes(fileType)) {
    return { error: "Unsupported image format." };
  }

  if (fileSize <= 0 || fileSize > MAX_FILE_SIZE) {
    return { error: "File must be smaller than 50 MB." };
  }

  // Verify gallery
  const { data: gallery, error: galleryError } = await supabase
    .from("galleries")
    .select("id, is_active, expires_at")
    .eq("id", galleryId)
    .single();

  if (galleryError || !gallery) {
    return { error: "Gallery not found." };
  }

  if (
    !gallery.is_active ||
    (gallery.expires_at && new Date(gallery.expires_at) <= new Date())
  ) {
    return { error: "This gallery is inactive or expired." };
  }

  // Generate a unique storage path
  const extension = fileName.split(".").pop()?.toLowerCase() || "jpg";
  const safeExtension = /^[a-z0-9]+$/.test(extension) ? extension : "jpg";

  const storagePath = `${galleryId}/${randomUUID()}.${safeExtension}`;

  // Generate signed upload URL
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUploadUrl(storagePath);

  if (error) {
    console.error("Upload URL error:", error);
    return { error: "Unable to prepare photo upload." };
  }

  return {
    path: data.path,
    token: data.token,
    fileName,
    fileType,
    fileSize,
  };
}

export async function savePhotoRecord(
  galleryId: string,
  fileName: string,
  storagePath: string,
  fileType: string,
  fileSize: number,
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role !== "admin") {
    return { error: "Unauthorized access." };
  }

  if (!storagePath.startsWith(`${galleryId}/`)) {
    return { error: "Invalid storage path." };
  }

  if (!ALLOWED_TYPES.includes(fileType)) {
    return { error: "Unsupported image format." };
  }

  if (fileSize <= 0 || fileSize > MAX_FILE_SIZE) {
    return { error: "Invalid file size." };
  }

  const { data: gallery, error: galleryError } = await supabase
    .from("galleries")
    .select("id, is_active, expires_at")
    .eq("id", galleryId)
    .single();

  if (galleryError || !gallery) {
    return { error: "Gallery not found." };
  }

  if (
    !gallery.is_active ||
    (gallery.expires_at && new Date(gallery.expires_at) <= new Date())
  ) {
    return { error: "This gallery is inactive or expired." };
  }

  const { error } = await supabase.from("gallery_photos").insert({
    gallery_id: galleryId,
    file_name: fileName,
    storage_path: storagePath,
    mime_type: fileType,
    file_size: fileSize,
  });

  if (error) {
    console.error("Photo record error:", error);
    return { error: "Unable to save photo information." };
  }

  return { success: true };
}

export async function toggleGalleryStatus(galleryId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user || user.app_metadata?.role !== "admin") {
    return { error: "Unauthorized access." };
  }

  const { data: gallery, error: fetchError } = await supabase
    .from("galleries")
    .select("id, is_active")
    .eq("id", galleryId)
    .single();

  if (fetchError || !gallery) {
    return { error: "Gallery not found." };
  }

  const newStatus = !gallery.is_active;

  const { error: updateError } = await supabase
    .from("galleries")
    .update({ is_active: newStatus })
    .eq("id", galleryId);

  if (updateError) {
    console.error("Gallery status update error:", updateError);
    return { error: "Unable to update gallery status." };
  }

  revalidatePath(`/admin/galleries/${galleryId}`);
  revalidatePath("/admin/galleries");

  return {
    success: true,
    isActive: newStatus,
  };
}
