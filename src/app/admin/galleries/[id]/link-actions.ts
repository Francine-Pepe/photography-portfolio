"use server";

import { createHash, randomBytes } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type GalleryLinkState = {
  error?: string;
  link?: string;
};

export async function generateGalleryLink(
  galleryId: string,
): Promise<GalleryLinkState> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user || user.app_metadata?.role !== "admin") {
    return { error: "Unauthorized access." };
  }

  const token = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(token).digest("hex");

  const { data, error } = await supabase
    .from("galleries")
    .update({ access_token_hash: tokenHash })
    .eq("id", galleryId)
    .select("id")
    .single();

  if (error || !data) {
    console.error("Gallery link generation error:", error);
    return { error: "Unable to generate a new link." };
  }

  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ).replace(/\/$/, "");

  revalidatePath(`/admin/galleries/${galleryId}`);

  return {
    link: `${siteUrl}/download/${token}`,
  };
}
