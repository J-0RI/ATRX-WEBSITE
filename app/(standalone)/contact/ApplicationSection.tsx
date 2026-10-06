"use client";

import { Suspense, useEffect, useRef, useState, type RefObject } from "react";
import { useSearchParams } from "next/navigation";
import { CONTACT_EMAIL } from "@/content/nav";
import ContactForm from "./ContactForm";
import { engagements, parseEngagement, type Engagement } from "./engagements";
import styles from "./contact.module.css";

function EngagementFromUrl({ onChange, selectorRef }: {
  onChange: (value: Engagement | "") => void;
  selectorRef: RefObject<HTMLSelectElement | null>;
}) {
  const params = useSearchParams();

  useEffect(() => {
    const requested = parseEngagement(params.get("engagement"));
    onChange(requested);
    if (window.location.hash === "#request") {
      requestAnimationFrame(() => selectorRef.current?.focus({ preventScroll: true }));
    }
  }, [params, onChange, selectorRef]);
  return null;
}

function ApplicationContent() {
  const selectorRef = useRef<HTMLSelectElement>(null);
  const [engagement, setEngagement] = useState<Engagement | "">("");

  const config = engagement ? engagements[engagement] : null;

  return (
    <section id="request" className={styles.band} aria-labelledby="request-title">
      <Suspense fallback={null}>
        <EngagementFromUrl onChange={setEngagement} selectorRef={selectorRef} />
      </Suspense>
      <div className={styles.intro}>
        <h2 id="request-title" className={styles.bandTitle}>
          {config?.heading ?? "Application"}
        </h2>
        <p id="request-description">
          {config?.description ?? "Select the engagement that best matches your request. The application will ask only for information relevant to that engagement."}
        </p>
      </div>

      <div className={styles.stack}>
        <div className={styles.formPanel}>
          <ContactForm
            engagement={engagement}
            onEngagementChange={setEngagement}
            selectorRef={selectorRef}
          />
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
  );
}

export default function ApplicationSection() {
  return <ApplicationContent />;
}
