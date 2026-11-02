import Link from "next/link";
import { getPhotos } from "@/lib/photos";
import { photographyContent } from "@/data/photography";
import { photoCaptions } from "@/data/photoCaption";
import EditorialGallery from "@/components/gallery/EditorialGallery";
import styles from "./page.module.scss";

export default async function PhotographyPage() {
  const photos = await getPhotos();

  return (
    <main>
      <section className={styles.photography_page_description}>
        <span className={styles.span}>{photographyContent.eyebrow}</span>
        <h1>{photographyContent.title}</h1>
        <p className={styles.description}>{photographyContent.description}</p>
      </section>
      <nav className={styles.categories} aria-label="Photography categories">
        {photographyContent.categories.map((category) => (
          <Link
            key={category.slug}
            href={
              category.slug === "all"
                ? "/photography"
                : `/photography/${category.slug}`
            }
            className={
              category.slug === "all"
                ? styles.activeCategory
                : styles.categoryLink
            }
            aria-current={category.slug === "all" ? "page" : undefined}
          >
            {category.label}
          </Link>
        ))}
      </nav>
      <p className={styles.photoCount}>{photos.length} photographs</p>
      <EditorialGallery photos={photos} captions={photoCaptions} />
      <section className={styles.closing}>
        <h2>{photographyContent.closing.title}</h2>
        <p>{photographyContent.closing.description}</p>
      </section>
    </main>
  );
}
