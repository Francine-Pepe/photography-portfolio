import Image from "next/image";
import Link from "next/link";
import type { Photo } from "@/types";
import { categories } from "@/data/categories";
import FilmStrip from "./FilmStrip";
import styles from "./CategoryGrid.module.scss";

type CategoryGridProps = {
  photos: Photo[];
};

export default function CategoryGrid({ photos }: CategoryGridProps) {
  return (
    <section className={styles.section} aria-label="Photography categories">
      <div className={styles.grid}>
        {categories.map((category) => {
          const categoryPhotos = photos.filter(
            (photo) => photo.type.toLowerCase() === category.slug,
          );

          const coverPhoto =
            categoryPhotos.find(
              (photo) => photo.id === category.coverPhotoId,
            ) ?? categoryPhotos[0];

          if (!coverPhoto) {
            return null;
          }

          const tileClassName =
            category.layout === "featured"
              ? `${styles.tile} ${styles.featured}`
              : styles.tile;

          return (
            <Link
              key={category.slug}
              href={`/photography/${category.slug}`}
              className={tileClassName}
            >
              <FilmStrip
                photos={categoryPhotos}
                categoryLabel={category.label}
              />

              <div className={styles.caption}>
                <h2>{category.label}</h2>
                <span>{String(categoryPhotos.length).padStart(2, "0")}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
