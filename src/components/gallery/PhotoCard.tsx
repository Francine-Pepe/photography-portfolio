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
  const cardClassName = featured
    ? `${styles.card} ${styles.featured}`
    : styles.card;
  return (
    <article className={cardClassName}>
      <button
        type="button"
        className={styles.imageButton}
        onClick={onClick}
        aria-label={`View ${photo.name}`}
      >
        <div className={styles.imageWrapper}>
          <PhotoImage photo={photo} />
        </div>
      </button>

      <div className={styles.caption}>
        <h2 className={styles.title}>{photo.name}</h2>

        {description && <p className={styles.description}>{description}</p>}
      </div>
    </article>
  );
}
