"use client";

import type { Photo } from "@/types";
import PhotoCard from "./PhotoCard";
import styles from "./EditorialGallery.module.scss";
import { useCallback, useState } from "react";
import PhotoLightbox from "./PhotoLightbox";

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

  const closeLightbox = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const navigatePhoto = useCallback(
    (direction: -1 | 1) => {
      setActiveIndex((currentIndex) => {
        if (currentIndex === null || photos.length === 0) {
          return currentIndex;
        }

        return (currentIndex + direction + photos.length) % photos.length;
      });
    },

    [photos.length],
  );

  return (
    <>
      <section
        className={styles.gallery}
        aria-label="Editorial photography gallery"
      >
        {photos.map((photo, index) => {
          const isWide = photo.cols ? photo.cols >= 4 : index % 5 === 0;
          const isNarrow = photo.cols === 1 && !isWide;
          const classNames = [
            styles.item,
            isWide ? styles.wide : "",
            isNarrow ? styles.narrow : "",
            index % 7 === 3 ? styles.offset : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <div key={photo.id} className={classNames}>
              <PhotoCard
                photo={photo}
                description={captions[String(photo.id)]?.description}
                featured={isWide}
                onClick={() => setActiveIndex(index)}
              />
            </div>
          );
        })}
      </section>

      {activeIndex !== null && (
        <PhotoLightbox
          photos={photos}
          activeIndex={activeIndex}
          description={captions[String(photos[activeIndex].id)]?.description}
          onClose={closeLightbox}
          onNavigate={navigatePhoto}
        />
      )}
    </>
  );
}
