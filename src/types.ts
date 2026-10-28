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
