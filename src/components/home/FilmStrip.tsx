import Image from "next/image";
import type { CSSProperties } from "react";
import type { Photo } from "@/types";
import styles from "./FilmStrip.module.scss";

type FilmStripProps = {
  photos: Photo[];
  categoryLabel: string;
};

export default function FilmStrip({ photos, categoryLabel }: FilmStripProps) {
  if (photos.length === 0) return null;

  const loopPhotos = [...photos, ...photos];

  const stripStyle = {
    "--photo-count": photos.length,
  } as CSSProperties;

  return (
    <div
      className={styles.frame}
      role="img"
      aria-label={`${categoryLabel} photography`}
    >
      <div className={styles.strip} style={stripStyle}>
        {loopPhotos.map((photo, index) => (
          <div className={styles.slide} key={`${photo.id}-${index}`}>
            <Image
              src={photo.image}
              alt=""
              fill
              sizes="(max-width: 600px) 92vw, 45vw"
              className={styles.image}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
