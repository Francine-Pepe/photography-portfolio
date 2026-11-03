"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import type { Photo } from "@/types";
import PhotoCard from "./PhotoCard";
import styles from "./EditorialGallery.module.scss";

// Only loaded when the first photo is opened
const PhotoLightbox = dynamic(() => import("./PhotoLightbox"));

type PhotoCaption = {
  description?: string;
};

type EditorialGalleryProps = {
  photos: Photo[];
  captions?: Record<string, PhotoCaption>;
};

export default function EditorialGallery({
  photos,
  captions = {},
}: EditorialGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Derived and safe if `photos` shrinks while the lightbox is open
  const activePhoto = activeIndex !== null ? photos[activeIndex] : undefined;

  const getDescription = (photo: Photo) =>
    captions[String(photo.id)]?.description;

  const closeLightbox = useCallback(() => setActiveIndex(null), []);

  const navigatePhoto = useCallback(
    (direction: -1 | 1) => {
      setActiveIndex((current) => {
        if (current === null || photos.length === 0) return current;
        return (current + direction + photos.length) % photos.length;
      });
    },
    [photos.length],
  );

  return (
    <>
      <ul
        className={styles.gallery}
        role="list"
        aria-label="Editorial photography gallery"
      >
        {photos.map((photo, index) => {
          const isWide = photo.cols ? photo.cols >= 4 : index % 5 === 0;
          const isNarrow = photo.cols === 1;
          const isOffset = index % 7 === 3;

          const className = [
            styles.item,
            isWide && styles.wide,
            isNarrow && styles.narrow,
            isOffset && styles.offset,
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <li key={photo.id} className={className}>
              <PhotoCard
                photo={photo}
                description={getDescription(photo)}
                featured={isWide}
                onClick={() => setActiveIndex(index)}
              />
            </li>
          );
        })}
      </ul>

      {activePhoto && activeIndex !== null && (
        <PhotoLightbox
          photos={photos}
          activeIndex={activeIndex}
          description={getDescription(activePhoto)}
          onClose={closeLightbox}
          onNavigate={navigatePhoto}
        />
      )}
    </>
  );
}
