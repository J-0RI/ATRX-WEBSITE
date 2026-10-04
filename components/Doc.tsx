import Link from "next/link";
import { ArrowUpRight } from "./Icons";
import styles from "./Doc.module.css";

export function DocHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className={styles.header}>
      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
      <h1 className={styles.title}>{title}</h1>
      {children ? <div className={styles.lead}>{children}</div> : null}
    </header>
  );
}

export function DocSection({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={styles.section} aria-labelledby={id ? `${id}-heading` : undefined}>
      <h2 id={id ? `${id}-heading` : undefined} className={styles.sectionTitle}>
        {title}
      </h2>
      {children}
    </section>
  );
}

export function Prose({ children }: { children: React.ReactNode }) {
  return <div className={styles.prose}>{children}</div>;
}

/** Ruled list of labelled entries: the spec-row language used across the site. */
export function EntryList({
  entries,
  mono = false,
}: {
  entries: { id?: string; label: string; title?: string; body: React.ReactNode }[];
  mono?: boolean;
}) {
  return (
    <dl className={styles.entries}>
      {entries.map((e) => (
        <div key={e.label + (e.title ?? "")} id={e.id} className={styles.entry}>
          <dt>
            <span className={`${styles.entryLabel} ${mono ? styles.mono : ""}`}>{e.label}</span>
            {e.title ? <span className={styles.entryTitle}>{e.title}</span> : null}
          </dt>
          <dd>{e.body}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Panel({ children }: { children: React.ReactNode }) {
  return <div className={styles.panel}>{children}</div>;
}

export function Actions({ children }: { children: React.ReactNode }) {
  return <div className={styles.actions}>{children}</div>;
}

export function Note({ children }: { children: React.ReactNode }) {
  return <p className={styles.note}>{children}</p>;
}

export function Related({ links }: { links: { label: string; href: string }[] }) {
  return (
    <nav className={styles.related} aria-label="Related documentation">
      <h2 className={styles.relatedTitle}>Related</h2>
      <ul>
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className={styles.relatedLink}>
              <span>{l.label}</span>
              <ArrowUpRight size={12} />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
