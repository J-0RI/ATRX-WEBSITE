"use client";

import { useState, type RefObject } from "react";
import { CONTACT_EMAIL } from "@/content/nav";
import EngagementFields from "./EngagementFields";
import { engagements, engagementOptions, emptyEngagementAnswers, parseEngagement, prepareRequest, requestMailto, type Engagement, type Identity } from "./engagements";
import styles from "./contact.module.css";

function IdentityFields({ value, onChange }: { value: Identity; onChange: (value: Identity) => void }) {
  return (
    <fieldset className={styles.fieldGroup}>
      <legend className={styles.visuallyHidden}>Your details</legend>
      <div className={styles.row}>
        <label className={styles.field}>
          <span>Name</span>
          <input name="name" type="text" autoComplete="name" required value={value.name} onChange={(e) => onChange({ ...value, name: e.target.value })} />
        </label>
        <label className={styles.field}>
          <span>Entity (optional)</span>
          <input name="entity" type="text" autoComplete="organization" value={value.entity} onChange={(e) => onChange({ ...value, entity: e.target.value })} />
        </label>
      </div>
      <label className={styles.field}>
        <span>Role (optional)</span>
        <input name="role" type="text" autoComplete="organization-title" value={value.role} onChange={(e) => onChange({ ...value, role: e.target.value })} />
      </label>
    </fieldset>
  );
}

/** State stays in memory, including answers for temporarily unselected engagements. */
export default function ContactForm({ engagement, onEngagementChange, selectorRef }: {
  engagement: Engagement | "";
  onEngagementChange: (value: Engagement | "") => void;
  selectorRef: RefObject<HTMLSelectElement | null>;
}) {
  const [identity, setIdentity] = useState<Identity>({ name: "", entity: "", role: "" });
  const [answers, setAnswers] = useState(emptyEngagementAnswers);
  const config = engagement ? engagements[engagement] : null;

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!engagement) return;
    // Native required validation handles empty fields; catch whitespace-only answers too.
    for (const field of event.currentTarget.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input[required], textarea[required]")) {
      if (!field.value.trim()) {
        field.setCustomValidity("Please enter a response.");
        field.reportValidity();
        return;
      }
    }
    window.location.href = requestMailto(CONTACT_EMAIL, prepareRequest(engagement, identity, answers[engagement]));
  };

  return (
    <form className={styles.form} onSubmit={onSubmit} aria-label={config?.heading ?? "Application"}
      onInput={(event) => {
        const field = event.target;
        if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) field.setCustomValidity("");
      }}>
      <label className={styles.field}>
        <span>What can we help you with?</span>
        <select ref={selectorRef} name="engagement" value={engagement} required aria-describedby="request-description" onChange={(e) => onEngagementChange(parseEngagement(e.target.value))}>
          <option value="">Select an engagement</option>
          {engagementOptions.map((key) => <option key={key} value={key}>{engagements[key].label}</option>)}
        </select>
      </label>
      {engagement && config ? <>
        <IdentityFields value={identity} onChange={setIdentity} />
        <EngagementFields engagement={engagement} answers={answers[engagement]} onChange={(key, value) => {
          setAnswers((current) => ({ ...current, [engagement]: { ...current[engagement], [key]: value } }));
        }} />
        <div className={styles.submitRow}>
          <button type="submit" className="btn btn-primary">{config.action}</button>
        </div>
      </> : null}
    </form>
  );
}
