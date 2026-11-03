import { useId } from "react";
import type { Photo } from "@/types";
import PhotoImage from "./PhotoImage";
import styles from "./PhotoCard.module.scss";

type PhotoCardProps = {
  photo: Photo;
  description?: string;
  featured?: boolean;
  onClick?: () => void;
};

export default function PhotoCard({
  photo,
  description,
  featured = false,
  onClick,
}: PhotoCardProps) {
  const descriptionId = useId();

  const cardClassName = featured
    ? `${styles.card} ${styles.featured}`
    : styles.card;

  const image = (
    <span className={styles.imageWrapper}>
      <PhotoImage photo={photo} />
    </span>
  );

  return (
    <article className={cardClassName}>
      {onClick ? (
        <button
          type="button"
          className={styles.imageButton}
          onClick={onClick}
          aria-label={`View ${photo.name}`}
          aria-describedby={description ? descriptionId : undefined}
        >
          {image}
        </button>
      ) : (
        <div className={styles.imageButton}>{image}</div>
      )}

      <div className={styles.caption}>
        <h3 className={styles.title}>{photo.name}</h3>

        {description && (
          <p id={descriptionId} className={styles.description}>
            {description}
          </p>
        )}
      </div>
    </article>
  );
}
