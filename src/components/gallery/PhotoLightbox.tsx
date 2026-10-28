"use client";

import { useEffect } from "react";
import Image from "next/image";
import type { Photo } from "@/types";
import styles from "./PhotoLightbox.module.scss";

type PhotoLightboxProps = {
  photos: Photo[];
  activeIndex: number;
  description?: string;
  onClose: () => void;
  onNavigate: (direction: -1 | 1) => void;
};

export default function PhotoLightbox({
  photos,
  activeIndex,
  description,
  onClose,
  onNavigate,
}: PhotoLightboxProps) {
  const photo = photos[activeIndex];

  useEffect(() => {
    if (!photo) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onNavigate(-1);
      if (event.key === "ArrowRight") onNavigate(1);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [photo, onClose, onNavigate]);

  if (!photo) return null;

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={`Photograph: ${photo.name}`}
      onClick={onClose}
    >
      <button
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Close photograph"
      >
        ×
      </button>

      <button
        className={`${styles.navigationButton} ${styles.previous}`}
        onClick={(event) => {
          event.stopPropagation();
          onNavigate(-1);
        }}
        aria-label="Previous photograph"
      >
        ←
      </button>

      <div
        className={styles.content}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.imageWrapper}>
          <Image
            src={photo.image}
            alt={photo.name}
            fill
            priority
            sizes="(max-width: 768px) 95vw, 85vw"
            className={styles.image}
          />
        </div>

        <div className={styles.caption}>
          <h2>{photo.name}</h2>

          {description && <p>{description}</p>}

          <span>
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(photos.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      <button
        className={`${styles.navigationButton} ${styles.next}`}
        onClick={(event) => {
          event.stopPropagation();
          onNavigate(1);
        }}
        aria-label="Next photograph"
      >
        →
      </button>
    </div>
  );
}
