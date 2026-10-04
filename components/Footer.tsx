import Link from "next/link";
import { footerColumns, type FooterLink } from "@/content/nav";
import styles from "./Footer.module.css";

function FooterAnchor({ link }: { link: FooterLink }) {
  if (link.external) {
    const offsite = link.href.startsWith("http");
    return (
      <a href={link.href} className={styles.link} {...(offsite ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {link.label}
      </a>
    );
  }
  return (
    <Link href={link.href} className={styles.link}>
      {link.label}
    </Link>
  );
}

/** Global footer: one instance below every shell, on the established page background. */
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.main}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo} aria-label="ATRX home">
              <img src="/brand/atrx.svg" alt="ATRX" width={139} height={28} />
            </Link>
            <p className={styles.descriptor}>
              <span>Alpha Technology</span>
              <span>Risk Execution</span>
            </p>
          </div>
          <div className={styles.navigation}>
            {footerColumns.map((column) => (
              <nav key={column.id} className={styles.column} aria-label={`${column.groups[0].title} links`}>
                {column.groups.map((group) => (
                  <div key={group.title} className={styles.group}>
                    <h2 className={styles.title}>{group.title}</h2>
                    <ul className={styles.list}>
                      {group.links.map((link) => (
                        <li key={link.href}>
                          <FooterAnchor link={link} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            ))}
          </div>
        </div>
        <p className={styles.legal}>© 2026 Haldane Technologies Inc</p>
      </div>
    </footer>
  );
}
