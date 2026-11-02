import Link from "next/link";
import { contactContent } from "@/data/contact";
import styles from "./page.module.scss";

export default function ContactPage() {
  return (
    <main>
      <section className={styles.introduction}>
        <span className={styles.span}>{contactContent.eyebrow}</span>
        <h1>{contactContent.title}</h1>

        <p className={styles.description}>{contactContent.description}</p>
      </section>

      <section className={styles.details}>
        <div className={styles.message}>
          <h2>{contactContent.message.title}</h2>

          <p>{contactContent.message.closingText}</p>

          <ul className={styles.services}>
            {contactContent.services.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
        </div>

        <div className={styles.contactDetails}>
          <div className={styles.contactItem}>
            <span className={styles.label}>
              {contactContent.contactDetails.email.label}
            </span>

            <a href={`mailto:${contactContent.contactDetails.email.address}`}>
              {contactContent.contactDetails.email.address}
            </a>
          </div>

          <div className={styles.contactItem}>
            <span className={styles.label}>
              {contactContent.contactDetails.instagram.label}
            </span>

            <Link
              href={contactContent.contactDetails.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {contactContent.contactDetails.instagram.linkText} ↗
            </Link>
          </div>
        </div>
      </section>

      <p className={styles.signature}>{contactContent.signature}</p>
    </main>
  );
}
