import Image from "next/image";
import { aboutContent } from "@/data/about";

import styles from "./page.module.scss";

export default function AboutPage() {
  return (
    <main className={styles.about}>
      <section className={styles.introduction}>
        <div className={styles.imageWrapper}>
          <Image
            src="/about_image.jpg"
            alt="A photograph from my collection"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className={styles.image}
          />
        </div>

        <div className={styles.content}>
          <p className={styles.eyebrow}>{aboutContent.eyebrow}</p>

          <h1>{aboutContent.title}</h1>

          {aboutContent.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </section>
    </main>
  );
}
