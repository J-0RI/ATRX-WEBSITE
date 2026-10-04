import type { Metadata } from "next";
import Link from "next/link";
import { CheckIcon, ChevronRight } from "@/components/Icons";
import { CONTACT_EMAIL } from "@/content/nav";
import ContactForm from "./ContactForm";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Request Access",
  description: "Request pipeline access or technical documentation. Qualified inbound only.",
};

const pathways = [
  {
    title: "Request pipeline access",
    body: "Apply for a Prosumer Node, Capital Desk or Institutional deployment. Applications are evaluated against available compute capacity and infrastructural alignment.",
    fit: "Best if you represent a qualified desk or allocator with a defined deployment objective.",
    action: "Start application",
    href: "/contact?engagement=tier-1#request",
  },
  {
    title: "Request technical documentation",
    body: "Whitepapers, ablation studies and risk disclosures, maintained for qualified quantitative evaluators and capital allocators.",
    fit: "Best if you are evaluating the architecture and Phase 1 metrics before applying.",
    action: "Request documentation",
    href: "/contact?engagement=documentation#request",
  },
];

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <h1 className={styles.title}>Request pipeline access or technical documentation.</h1>
        <p className={styles.lead}>
          ATRX is operating in a closed deployment phase. Every submission is routed directly for
          engineering review.
        </p>
      </header>

      <section className={styles.band} aria-labelledby="pathways-title">
        <div className={styles.intro}>
          <h2 id="pathways-title" className={styles.bandTitle}>
            Choose a pathway
          </h2>
          <p>Access is granted by application. Select the request that matches your evaluation stage.</p>
        </div>

        <div className={styles.stack}>
          <div className={styles.cards}>
            {pathways.map((p, i) => (
              <article key={p.title} className={styles.card} aria-labelledby={`pathway-${i}`}>
                <h3 id={`pathway-${i}`} className={styles.cardTitle}>
                  {p.title}
                </h3>
                <p className={styles.cardBody}>{p.body}</p>
                <p className={styles.fit}>
                  <CheckIcon size={14} />
                  {p.fit}
                </p>
                <Link href={p.href} className={`btn btn-primary ${styles.cardAction}`}>
                  {p.action}
                </Link>
              </article>
            ))}
          </div>

          <div className={styles.strip}>
            <p>
              <strong>Compare access tiers first.</strong> Pipeline scope, instrument topology and
              commercial model for each tier.
            </p>
            <Link href="/access" className="btn btn-secondary">
              View access tiers
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <section id="request" className={styles.band} aria-labelledby="request-title">
        <div className={styles.intro}>
          <h2 id="request-title" className={styles.bandTitle}>
            Application
          </h2>
          <p>
            Submissions are routed to Haldane for engineering review. The form composes a formatted
            message in your local mail client; nothing is sent until you send it.
          </p>
        </div>

        <div className={styles.stack}>
          <div className={styles.formPanel}>
            <ContactForm />
          </div>

          <div className={styles.direct}>
            <div>
              <p className={styles.directLabel}>Engineering inquiries</p>
              <a href={`mailto:${CONTACT_EMAIL}`} className={styles.directEmail}>
                {CONTACT_EMAIL}
              </a>
            </div>
            <p className={styles.directNote}>Contact Haldane regarding technical questions outside a formal application.</p>
          </div>
        </div>
      </section>

      <section className={styles.closing} aria-labelledby="closing-title">
        <h2 id="closing-title" className={styles.closingTitle}>
          Compute constrained. <span>Qualified allocators only.</span>
        </h2>
        <p className={styles.closingLead}>Pricing is provided upon technical qualification.</p>
        <Link href="#request" className="btn btn-primary">
          Begin application
          <ChevronRight size={14} />
        </Link>
      </section>
    </div>
  );
}
