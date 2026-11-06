"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";

import { COOKIE_CONSENT_KEY, cookieBannerContent } from "@/data/cookieBanner";

import "./CookieBanner.scss";

type Consent = "accepted" | "rejected" | null;
type ConsentSnapshot = Consent | "loading";

const getConsent = (): Consent => {
  const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);

  if (storedConsent === "accepted" || storedConsent === "rejected") {
    return storedConsent;
  }

  return null;
};

const getServerSnapshot = (): ConsentSnapshot => "loading";

const subscribe = (callback: () => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener("cookie-consent-change", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("cookie-consent-change", callback);
  };
};

export default function CookieBanner() {
  const consent = useSyncExternalStore(
    subscribe,
    getConsent,
    getServerSnapshot,
  );

  const [showSettings, setShowSettings] = useState(false);

  const handleConsent = (value: Exclude<Consent, null>) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, value);

    window.dispatchEvent(new Event("cookie-consent-change"));

    setShowSettings(false);
  };

  const {
    eyebrow,
    title,
    description,
    privacyLink,
    privacyHref,
    acceptButton,
    rejectButton,
    settingsButton,
  } = cookieBannerContent;

  if (consent === "loading") return null;

  const showBanner = consent === null || showSettings;

  return (
    <>
      {consent === "accepted" && <Analytics />}

      {showBanner ? (
        <section className="cookie-banner" aria-label="Privacy preferences">
          <div className="cookie-banner__content">
            <span className="cookie-banner__eyebrow">{eyebrow}</span>

            <h2>{title}</h2>

            <p>{description}</p>

            <Link href={privacyHref}>{privacyLink}</Link>
          </div>

          <div className="cookie-banner__actions">
            <button
              type="button"
              className="cookie-banner__reject"
              onClick={() => handleConsent("rejected")}
            >
              {rejectButton}
            </button>

            <button
              type="button"
              className="cookie-banner__accept"
              onClick={() => handleConsent("accepted")}
            >
              {acceptButton}
            </button>
          </div>
        </section>
      ) : (
        <button
          type="button"
          className="cookie-banner__settings"
          onClick={() => setShowSettings(true)}
        >
          {settingsButton}
        </button>
      )}
    </>
  );
}
