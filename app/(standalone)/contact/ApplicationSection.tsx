"use client";

import { Suspense, useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { useSearchParams } from "next/navigation";
import { CONTACT_EMAIL } from "@/content/nav";
import { planById, tiers } from "@/content/tiers";
import ContactForm from "./ContactForm";
import { engagements, parseEngagement, parsePlan, type Engagement } from "./engagements";
import styles from "./contact.module.css";

type Selection = { engagement: Engagement | ""; plan: string };

/**
 * Resolves ?engagement=&plan= against the catalogue. A plan outside the requested mode is
 * dropped; a valid plan with no engagement implies its own mode. Unknown values resolve to no selection.
 */
function selectionFromParams(params: URLSearchParams): Selection {
  const requestedPlan = params.get("plan");
  let engagement = parseEngagement(params.get("engagement"));
  if (!params.has("engagement") && requestedPlan) {
    const mode = planById.get(requestedPlan)?.mode;
    engagement = parseEngagement(tiers.find((t) => t.id === mode)?.engagement ?? null);
  }
  return { engagement, plan: parsePlan(engagement, requestedPlan) };
}

function SelectionFromUrl({ onChange, selectorRef, ownSearch }: {
  onChange: (value: Selection) => void;
  selectorRef: RefObject<HTMLSelectElement | null>;
  ownSearch: RefObject<string | null>;
}) {
  const params = useSearchParams();

  useEffect(() => {
    // URL updates written by the form itself mirror state that is already current:
    // never move focus away from the control the applicant is using.
    const own = ownSearch.current === params.toString();
    ownSearch.current = null;
    if (own) return;
    onChange(selectionFromParams(new URLSearchParams(params.toString())));
    if (window.location.hash === "#request") {
      requestAnimationFrame(() => selectorRef.current?.focus({ preventScroll: true }));
    }
  }, [params, onChange, selectorRef, ownSearch]);
  return null;
}

function ApplicationContent() {
  const selectorRef = useRef<HTMLSelectElement>(null);
  const ownSearch = useRef<string | null>(null);
  const [{ engagement, plan }, setSelection] = useState<Selection>({ engagement: "", plan: "" });

  /** Manual choices replace the URL query in place so a refresh restores them. */
  const choose = useCallback((next: Selection) => {
    setSelection(next);
    const url = new URL(window.location.href);
    url.searchParams.delete("engagement");
    url.searchParams.delete("plan");
    if (next.engagement) url.searchParams.set("engagement", next.engagement);
    if (next.plan) url.searchParams.set("plan", next.plan);
    ownSearch.current = url.searchParams.toString();
    window.history.replaceState(window.history.state, "", url);
  }, []);

  const config = engagement ? engagements[engagement] : null;

  return (
    <section id="request" className={styles.band} aria-labelledby="request-title">
      <Suspense fallback={null}>
        <SelectionFromUrl onChange={setSelection} selectorRef={selectorRef} ownSearch={ownSearch} />
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
            plan={plan}
            // A plan belongs to exactly one mode, so a mode change always clears it.
            onEngagementChange={(next) => choose({ engagement: next, plan: next === engagement ? plan : "" })}
            onPlanChange={(next) => choose({ engagement, plan: parsePlan(engagement, next) })}
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
