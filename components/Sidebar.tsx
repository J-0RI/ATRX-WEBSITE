"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import type { LocalSection } from "@/content/nav";
import styles from "./Sidebar.module.css";

/** Product selection is exclusively pathname-based; hashes never change it. */
export function useActiveItem(section: LocalSection) {
  const pathname = usePathname();
  const selected = section.groups.flatMap((group) => group.items)
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
  return { isActive: (href: string) => href === selected };
}

/** Persistent local product navigation, also reused by the mobile section menu. */
export default function Sidebar({
  section,
  onNavigate,
  showHeader = true,
  className,
}: {
  section: LocalSection;
  onNavigate?: () => void;
  showHeader?: boolean;
  className?: string;
}) {
  const { isActive } = useActiveItem(section);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    const viewport = nav?.closest<HTMLElement>("[data-sidebar-viewport]");
    const active = nav?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!viewport || !active || !viewport.clientHeight) return;
    // Adjust only the rail, and only when clipped. Never scroll the document.
    const rail = viewport.getBoundingClientRect();
    const row = active.getBoundingClientRect();
    if (row.top < rail.top) viewport.scrollTop += row.top - rail.top;
    else if (row.bottom > rail.bottom) viewport.scrollTop += row.bottom - rail.bottom;
  }, [pathname]);

  return (
    <nav ref={navRef} className={`${styles.nav} ${className ?? ""}`} aria-label={`${section.label} navigation`}>
      {showHeader && !section.hideContext ? (
        <div className={styles.context}>
          <p className={styles.contextTitle}>
            <span>{section.label}</span>
            {section.badge ? <span className={styles.badge}>{section.badge}</span> : null}
          </p>
          {section.subtitle ? <p className={styles.contextSubtitle}>{section.subtitle}</p> : null}
        </div>
      ) : null}
      {section.groups.map((group, index) => (
        <div key={group.title ?? index} className={styles.section}>
          {group.title ? <p className={styles.heading}>{group.title}</p> : null}
          <ul className={styles.list}>
            {group.items.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={styles.link}
                    aria-current={active ? "page" : undefined}
                    onClick={() => {
                      onNavigate?.();
                    }}
                  >
                    <span>{item.label}</span>
                    {item.badge ? <span className={styles.badge}>{item.badge}</span> : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
