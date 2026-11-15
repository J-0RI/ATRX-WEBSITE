"use client";

import { useState, type RefObject } from "react";
import { CONTACT_EMAIL } from "@/content/nav";
import { countries, regionsFor, REGION_NOT_APPLICABLE, REGION_NOT_APPLICABLE_LABEL } from "@/lib/geography";
import EngagementFields from "./EngagementFields";
import { engagements, engagementOptions, emptyEngagementAnswers, modeOf, parseEngagement, plansFor, prepareRequest, requestMailto, validateApplication, type Engagement, type Identity } from "./engagements";
import styles from "./contact.module.css";

function clearCustomValidity(event: React.SyntheticEvent<HTMLFormElement>) {
  const field = event.target;
  if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) field.setCustomValidity("");
}

const accessEngagements =engagementOptions.filter((key) => modeOf(key));
const otherEngagements = engagementOptions.filter((key) => !modeOf(key));

function LocationFields({ value, onChange }: { value: Identity; onChange: (value: Identity) => void }) {
  const regions = regionsFor(value.country);
  const notApplicable = value.country !== "" && regions.length === 0;
  return (
    <div className={styles.row}>
      <label className={styles.field}>
        <span>Country</span>
        <select name="country" required autoComplete="country" value={value.country}
          onChange={(e) => {
            const country = e.target.value;
            // A region never survives a country change; "Not applicable" is preselected only
            // when it is the sole valid answer for the new country.
            onChange({ ...value, country, region: country && regionsFor(country).length === 0 ? REGION_NOT_APPLICABLE : "" });
          }}>
          <option value="">Select a country</option>
          {countries.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
        </select>
      </label>
      <label className={styles.field}>
        <span>State / Province / Region</span>
        <select name="region" required disabled={!value.country} value={value.region}
          onChange={(e) => onChange({ ...value, region: e.target.value })}>
          <option value="">{value.country ? "Select a region" : "Select a country first"}</option>
          {notApplicable
            ? <option value={REGION_NOT_APPLICABLE}>{REGION_NOT_APPLICABLE_LABEL}</option>
            : regions.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
      </label>
    </div>
  );
}

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
      <LocationFields value={value} onChange={onChange} />
    </fieldset>
  );
}

/** State stays in memory, including answers for temporarily unselected engagements. */
export default function ContactForm({ engagement, plan, onEngagementChange, onPlanChange, selectorRef }: {
  engagement: Engagement | "";
  plan: string;
  onEngagementChange: (value: Engagement | "") => void;
  onPlanChange: (value: string) => void;
  selectorRef: RefObject<HTMLSelectElement | null>;
}) {
  const [identity, setIdentity] = useState<Identity>({ name: "", entity: "", role: "", country: "", region: "" });
  const [answers, setAnswers] = useState(emptyEngagementAnswers);
  const config = engagement ? engagements[engagement] : null;
  const plans = plansFor(engagement);
  const showPlan = engagement === "" || plans.length > 0;

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!engagement) return;
    // Native required validation handles empty fields; catch whitespace-only answers too.
    for (const field of form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input[required], textarea[required]")) {
      if (!field.value.trim()) {
        field.setCustomValidity("Please enter a response.");
        field.reportValidity();
        return;
      }
    }
    // Submission boundary: selections are re-resolved against the catalogue and dataset.
    const result = validateApplication(engagement, plan, identity);
    if (!result.ok) {
      const field = form.elements.namedItem(result.field);
      if (field instanceof HTMLSelectElement) {
        field.setCustomValidity(result.message);
        field.reportValidity();
      }
      return;
    }
    window.location.href = requestMailto(CONTACT_EMAIL, prepareRequest(result.application, identity, answers[engagement]));
  };

  return (
    <form className={styles.form} onSubmit={onSubmit} aria-label={config?.heading ?? "Application"}
      onInput={clearCustomValidity} onChange={clearCustomValidity}>
      <div className={showPlan ? styles.row : undefined}>
        <label className={styles.field}>
          <span>What can we help you with?</span>
          <select ref={selectorRef} name="engagement" value={engagement} required aria-describedby="request-description" onChange={(e) => onEngagementChange(parseEngagement(e.target.value))}>
            <option value="">Select an engagement</option>
            <optgroup label="Access mode">
              {accessEngagements.map((key) => <option key={key} value={key}>{engagements[key].label}</option>)}
            </optgroup>
            <optgroup label="Technical materials">
              {otherEngagements.map((key) => <option key={key} value={key}>{engagements[key].label}</option>)}
            </optgroup>
          </select>
        </label>
        {showPlan ? (
          <label className={styles.field}>
            <span>Plan</span>
            <select name="plan" required disabled={plans.length === 0} value={plan} onChange={(e) => onPlanChange(e.target.value)}>
              <option value="">{plans.length ? "Select a plan" : "Select an access mode first"}</option>
              {plans.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </label>
        ) : null}
      </div>
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
