import type { Metadata } from "next";
import { privacyPolicy } from "@/data/privacyPolicy";
import "@/styles/privacyPolicy.scss";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description:
    "Informationen zur Verarbeitung personenbezogener Daten auf dieser Website.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="privacy-policy">
      <header className="privacy-policy__header">
        <h1>{privacyPolicy.title}</h1>
        <p>{privacyPolicy.subtitle}</p>
        <span>{privacyPolicy.lastUpdated}</span>
      </header>

      <div className="privacy-policy__content">
        {privacyPolicy.sections.map((section, index) => (
          <section className="privacy-policy__section" key={section.title}>
            <h2>{section.title}</h2>

            {section.paragraphs?.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}

            {section.list && (
              <ul>
                {section.list.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}

            {section.paragraphsAfter?.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}

            {section.links?.map((link) => (
              <p key={link.href}>
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </p>
            ))}
          </section>
        ))}
      </div>
    </main>
  );
}
