"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { LocalSection } from "@/content/nav";
import styles from "./Sidebar.module.css";

/** Current item within one section: anchors win over their page, page wins when no anchor is selected. */
export function useActiveItem(section: LocalSection) {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const update = () => setHash(window.location.hash);
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, [pathname]);

  const hrefs = section.groups.flatMap((g) => g.items.map((i) => i.href));
  const anchored = new Set(hrefs.filter((href) => href.includes("#")));

  const isActive = (href: string) => {
    const [path, anchor] = href.split("#");
    if (path !== pathname) return false;
    if (anchor) return hash === `#${anchor}`;
    return !hash || !anchored.has(`${pathname}${hash}`);
  };

  const select = (href: string) => {
    const anchor = href.split("#")[1];
    setHash(anchor ? `#${anchor}` : "");
  };

  return { isActive, select };
}

/** Local navigation for the current domain only. */
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
  const { isActive, select } = useActiveItem(section);

  return (
    <nav className={`${styles.nav} ${className ?? ""}`} aria-label={`${section.label} navigation`}>
      {showHeader ? (
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
                      select(item.href);
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
