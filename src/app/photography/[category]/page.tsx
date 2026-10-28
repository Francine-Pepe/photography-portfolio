import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getPhotos } from "@/lib/photos";
import { categories } from "@/data/categories";
import EditorialGallery from "@/components/gallery/EditorialGallery";
import { photoCaptions } from "@/data/photoCaption";
import styles from "./page.module.scss";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

const categoryDescriptions: Record<string, string> = {
  animals: "Small encounters with the natural world.",
  flowers: "Colours, textures, and quiet botanical details.",
  food: "Everyday ingredients, carefully observed.",
  landscape: "Places, light, and the feeling of being somewhere.",
  moon: "A little collection of moments beneath the night sky.",
  portrait: "People, expressions, and fleeting moments.",
  product: "Objects, details, and thoughtful compositions.",
  event: "People and moments worth remembering.",
};

export function generateStaticParams() {
  return categories.map((category) => ({
    category: category.slug,
  }));
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return (
    <Suspense fallback={<p className={styles.loading}>Loading gallery...</p>}>
      <CategoryContent params={params} />
    </Suspense>
  );
}

async function CategoryContent({ params }: CategoryPageProps) {
  const { category: slug } = await params;

  const category = categories.find((item) => item.slug === slug);

  if (!category) {
    notFound();
  }

  const photos = await getPhotos();

  const categoryPhotos = photos
    .filter((photo) => photo.type.toLowerCase() === slug)
    .sort((a, b) => a.id - b.id);

  if (categoryPhotos.length === 0) {
    notFound();
  }

  return (
    <main>
      <header className={styles.introduction}>
        <p className={styles.eyebrow}>Photography / Collection</p>

        <h1 className={styles.title}>{category.label}</h1>

        <p className={styles.description}>{categoryDescriptions[slug]}</p>

        <p className={styles.count}>
          {String(categoryPhotos.length).padStart(2, "0")} photographs
        </p>
      </header>

      <EditorialGallery photos={categoryPhotos} captions={photoCaptions} />
    </main>
  );
}
