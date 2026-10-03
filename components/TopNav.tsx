"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNav, requestAccessMenu, type NavItem } from "@/content/nav";
import MenuButton from "./MenuButton";
import MobileNav from "./MobileNav";
import Search from "./Search";
import { ChevronDown } from "./Icons";
import styles from "./TopNav.module.css";

const documentationMenu: NavItem[] = [
  { label: "Overview", href: "/" },
  { label: "Access tiers", href: "/access" },
  { label: "System architecture", href: "/architecture" },
  { label: "Enterprise tenancy", href: "/partnerships" },
  { label: "Instruments", href: "/instruments" },
  { label: "Technical library", href: "/documentation" },
];

export default function TopNav() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label="ATRX home">
          {/* Supplied brand asset, rendered at its native 1012:204 ratio. */}
          <img src="/brand/atrx.svg" alt="ATRX" width={84} height={17} />
        </Link>

        <nav className={styles.center} aria-label="Primary">
          <MenuButton
            label={
              <>
                Documentation
                <ChevronDown size={14} />
              </>
            }
            items={documentationMenu}
            buttonClassName={styles.link}
          />
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.link} ${pathname.startsWith(item.href) ? styles.current : ""}`}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <Search />
          <div className={styles.split}>
            <Link href="/contact" className={styles.splitMain}>
              Request access
            </Link>
            <MenuButton
              label={<ChevronDown size={14} />}
              ariaLabel="More access options"
              items={requestAccessMenu}
              buttonClassName={styles.splitToggle}
              align="end"
            />
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
