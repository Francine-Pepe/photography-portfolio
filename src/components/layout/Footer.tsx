import Image from "next/image";
import Link from "next/link";
import { navigation } from "@/data/navigation";
import { footerContent } from "@/data/footer";
import styles from "./Footer.module.scss";

export default async function Footer() {
  const copyrightYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <Link href="/" className={styles.brand} aria-label="Home">
          <Image
            src="/Francine_fotografie_logo.png"
            alt="Francine M. da Silva Fotografie"
            width={240}
            height={100}
          />
        </Link>

        <p className={styles.tagline}>{footerContent.tagline}</p>

        <nav className={styles.navigation} aria-label="Footer navigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href={footerContent.social.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.social}
        >
          {footerContent.social.label} ↗
        </Link>
      </div>

      <div className={styles.bottom}>
        <span>
          © {copyrightYear} {footerContent.copyright}
        </span>
        <span>{footerContent.credit}</span>
      </div>
    </footer>
  );
}
