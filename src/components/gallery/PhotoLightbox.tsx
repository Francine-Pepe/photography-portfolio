"use client";

import { useEffect, useRef } from "react";
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
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!photo) return;

    previouslyFocusedElement.current = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onNavigate(-1);
      if (event.key === "ArrowRight") onNavigate(1);

      if (event.key === "Tab" && dialogRef.current) {
        const focusableControls = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );

        if (focusableControls.length === 0) return;

        const firstControl = focusableControls[0];
        const lastControl = focusableControls[focusableControls.length - 1];

        if (event.shiftKey && document.activeElement === firstControl) {
          event.preventDefault();
          lastControl.focus();
        } else if (!event.shiftKey && document.activeElement === lastControl) {
          event.preventDefault();
          firstControl.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previouslyFocusedElement.current?.focus();
    };
  }, [photo, onClose, onNavigate]);

  if (!photo) return null;

  return (
    <div
      ref={dialogRef}
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={`Photograph: ${photo.name}`}
      tabIndex={-1}
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
          <span>{photo.name}</span>

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
