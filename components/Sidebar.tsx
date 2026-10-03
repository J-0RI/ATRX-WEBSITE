"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { sidebar } from "@/content/nav";
import styles from "./Sidebar.module.css";

const anchoredHrefs = new Set(
  sidebar.flatMap((s) => s.items.map((i) => i.href)).filter((href) => href.includes("#")),
);

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const update = () => setHash(window.location.hash);
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, [pathname]);

  const isActive = (href: string) => {
    const [path, anchor] = href.split("#");
    if (path !== pathname) return false;
    if (anchor) return hash === `#${anchor}`;
    // A plain page link stays current unless one of its anchors is selected.
    return !hash || !anchoredHrefs.has(`${pathname}${hash}`);
  };

  return (
    <nav className={styles.nav}>
      {sidebar.map((section) => (
        <div key={section.title} className={styles.section}>
          <p className={styles.heading}>{section.title}</p>
          <ul className={styles.list}>
            {section.items.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={styles.link}
                    aria-current={active ? "page" : undefined}
                    onClick={() => {
                      const anchor = item.href.split("#")[1];
                      setHash(anchor ? `#${anchor}` : "");
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
