import Link from "next/link";
import { homeContent } from "@/data/home";
import styles from "./Introduction.module.scss";

function Introduction() {
  return (
    <section className={styles.introduction}>
      <p className={styles.eyebrow}>{homeContent.eyebrow}</p>
      <h1 className={styles.title}>{homeContent.title}</h1>
      <p className={styles.description}>{homeContent.description}</p>

      <Link href="/photography" className={styles.link}>
        {homeContent.galleryLinkLabel}
        <span className={styles.linkIcon} aria-hidden="true">
          ↗
        </span>
      </Link>
    </section>
  );
}

export default Introduction;
