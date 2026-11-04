"use server";

import { createHash, randomBytes } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type GalleryState = {
  error?: string;
  link?: string;
};

export async function createGallery(
  _prevState: GalleryState,
  formData: FormData,
): Promise<GalleryState> {
  const supabase = await createClient();

  // Verify authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user || user.app_metadata?.role !== "admin") {
    return { error: "Unauthorized access." };
  }

  // Get form values
  const clientName = String(formData.get("clientName") || "").trim();
  const expirationDate = String(formData.get("expirationDate") || "");

  if (!clientName) {
    return { error: "Please enter the client's name." };
  }

  // Generate a secure access token
  const token = randomBytes(32).toString("base64url");

  // Store only the token hash
  const tokenHash = createHash("sha256").update(token).digest("hex");

  let expiresAt: string | null = null;

  if (expirationDate) {
    const date = new Date(`${expirationDate}T23:59:59.999Z`);

    if (Number.isNaN(date.getTime()) || date <= new Date()) {
      return { error: "Please select a valid future expiration date." };
    }

    expiresAt = date.toISOString();
  }

  // Save gallery in Supabase
  const { error } = await supabase.from("galleries").insert({
    client_name: clientName,
    access_token_hash: tokenHash,
    expires_at: expiresAt,
  });

  if (error) {
    console.error("Gallery creation error:", error);
    return { error: "Unable to create gallery. Please try again." };
  }

  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ).replace(/\/$/, "");

  const link = `${siteUrl}/download/${token}`;

  revalidatePath("/admin/galleries");

  return { link };
}
