import Link from "next/link";
import { ArrowUpRight } from "./Icons";
import styles from "./DocsDirectory.module.css";

type Column = { title: string; links: { label: string; href: string }[] };

const columns: Column[] = [
  {
    title: "Get started",
    links: [
      { label: "Request access", href: "/contact" },
      { label: "Access tiers", href: "/access" },
      { label: "Enterprise tenancy", href: "/partnerships" },
      { label: "Deployment process", href: "/partnerships#deployment" },
      { label: "Risk disclosure", href: "/risk" },
    ],
  },
  {
    title: "Architecture",
    links: [
      { label: "Structural pillars", href: "/architecture#pillars" },
      { label: "Inference pipeline", href: "/architecture#pipeline" },
      { label: "Transport layer", href: "/architecture#transport" },
      { label: "State gating", href: "/architecture#conditioning" },
      { label: "Instrument topology", href: "/instruments" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Systemic Macro Intelligence", href: "/architecture" },
      { label: "Structural Philosophy", href: "/philosophy" },
      { label: "Phase 1 Validation Metrics", href: "/performance" },
      { label: "Technical library", href: "/documentation" },
      { label: "Documentation request", href: "/contact?engagement=documentation#request" },
    ],
  },
];

export default function DocsDirectory() {
  return (
    <div className={styles.grid}>
      {columns.map((col) => (
        <div key={col.title}>
          <h3 className={styles.title}>{col.title}</h3>
          <ul className={styles.list}>
            {col.links.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className={styles.link}>
                  <span>{link.label}</span>
                  <ArrowUpRight size={12} className={styles.arrow} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
