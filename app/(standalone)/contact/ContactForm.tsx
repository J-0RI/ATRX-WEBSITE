"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CONTACT_EMAIL } from "@/content/nav";
import styles from "./contact.module.css";

const engagements = [
  { value: "tier-1", label: "Tier I · Prosumer Node" },
  { value: "tier-2", label: "Tier II · Capital Desk" },
  { value: "tier-3", label: "Tier III · Institutional" },
  { value: "documentation", label: "Ablation Studies / Documentation" },
];

/** Follows ?engagement= on load and on in-page pathway links, without making the form wait for the URL. */
function EngagementFromUrl({ onChange }: { onChange: (value: string) => void }) {
  const requested = useSearchParams().get("engagement");
  useEffect(() => {
    if (requested && engagements.some((e) => e.value === requested)) onChange(requested);
  }, [requested, onChange]);
  return null;
}

/** Composes a message in the visitor's own mail client; nothing is submitted to a server. */
export default function ContactForm() {
  const [engagement, setEngagement] = useState(engagements[0].value);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const field = (k: string) => String(data.get(k) ?? "").trim();
    const engagementLabel = engagements.find((x) => x.value === engagement)?.label ?? "";
    const subject = `ATRX access request · ${engagementLabel}`;
    const body = [
      `Name: ${field("name")}`,
      `Entity: ${field("entity")}`,
      `Role: ${field("role")}`,
      `Engagement: ${engagementLabel}`,
      "",
      "Deployment objective:",
      field("objective"),
    ].join("\n");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form className={styles.form} onSubmit={onSubmit} aria-label="Access request">
      <Suspense fallback={null}>
        <EngagementFromUrl onChange={setEngagement} />
      </Suspense>
      <div className={styles.row}>
        <label className={styles.field}>
          <span>Name</span>
          <input name="name" type="text" autoComplete="name" required />
        </label>
        <label className={styles.field}>
          <span>Entity</span>
          <input name="entity" type="text" autoComplete="organization" />
        </label>
      </div>
      <div className={styles.row}>
        <label className={styles.field}>
          <span>Role</span>
          <input name="role" type="text" autoComplete="organization-title" />
        </label>
        <label className={styles.field}>
          <span>Engagement</span>
          <select name="engagement" value={engagement} onChange={(e) => setEngagement(e.target.value)}>
            {engagements.map((e) => (
              <option key={e.value} value={e.value}>
                {e.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className={styles.field}>
        <span>Deployment objective</span>
        <textarea name="objective" rows={5} />
      </label>
      <div className={styles.submitRow}>
        <button type="submit" className="btn btn-primary">
          Prepare message
        </button>
        <p className={styles.hint}>Opens your local mail client with a formatted message.</p>
      </div>
    </form>
  );
}
