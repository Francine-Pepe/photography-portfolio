"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { navigation } from "@/data/navigation";
import LogoImage from "../../../public/Francine_fotografie_logo.png";
import styles from "./Header.module.scss";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand} aria-label="Home">
        <Image
          src={LogoImage}
          alt="Francine M. da Silva Fotografie"
          priority
          className={styles.logo}
          width={240}
          height={100}
        />
      </Link>

      {/* Desktop navigation */}
      <nav className={styles.navigation} aria-label="Main site navigation">
        <span aria-hidden="true">• •</span>

        {navigation.map((item) => {
          const isCurrentPage = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={styles.link}
              aria-current={isCurrentPage ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}

        <span aria-hidden="true">• •</span>
      </nav>

      {/* Mobile hamburger button */}
      <button
        type="button"
        className={styles.menuButton}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={isMenuOpen}
        aria-controls="mobile-navigation"
      >
        <span className={isMenuOpen ? styles.barOpen : ""} aria-hidden="true" />
        <span className={isMenuOpen ? styles.barOpen : ""} aria-hidden="true" />
        <span className={isMenuOpen ? styles.barOpen : ""} aria-hidden="true" />
      </button>

      {/* Mobile navigation */}
      <nav
        id="mobile-navigation"
        className={`${styles.mobileNavigation} ${
          isMenuOpen ? styles.mobileNavigationOpen : ""
        }`}
        aria-label="Mobile site navigation"
        inert={!isMenuOpen}
      >
        {navigation.map((item) => {
          const isCurrentPage = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={styles.mobileLink}
              onClick={closeMenu}
              aria-current={isCurrentPage ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

export default Header;
