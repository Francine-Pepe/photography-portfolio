import type { Route } from "next";

export type NavigationItem = {
  label: string;
  href: Route;
};

export type Photo = {
  id: number;
  name: string;
  image: string;
  type: string;
  link: string;
  rows?: number;
  cols?: number;
};

export type CategorySlug =
  | "animals"
  | "flowers"
  | "food"
  | "landscape"
  | "moon"
  | "portrait"
  | "product"
  | "event";

export type Category = {
  label: string;
  slug: CategorySlug;
  coverPhotoId?: number;
  layout: "featured" | "standard";
};

/* admin types */

export type UploadStatusType = "uploading" | "success" | "error";

export type UploadFile = {
  id: string;
  name: string;
  status: UploadStatusType;
  message?: string;
};

export type PhotoUploadResult = {
  success?: boolean;
  error?: string;
};

export type GalleryStatus = "active" | "inactive" | "expired";

export type Gallery = {
  id: string;
  client_name: string;
  created_at: string;
  expires_at: string | null;
  is_active: boolean;
};
