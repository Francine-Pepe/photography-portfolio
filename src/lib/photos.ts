import type { Photo } from "@/types";

const API_URL = "https://dasilva-fotografie-api-tau.vercel.app/fotos";

export async function getPhotos(): Promise<Photo[]> {
  const response = await fetch(API_URL, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch photos: ${response.status}`);
  }

  const result: unknown = await response.json();

  let photos: unknown;

  if (Array.isArray(result)) {
    // The API returns an array directly.
    photos = result;
  } else if (
    typeof result === "object" &&
    result !== null &&
    "fotos" in result &&
    Array.isArray(result.fotos)
  ) {
    // The API returns an object containing the fotos array.
    photos = result.fotos;
  } else {
    throw new Error("The photos API returned an unexpected response.");
  }

  return photos as Photo[];
}
