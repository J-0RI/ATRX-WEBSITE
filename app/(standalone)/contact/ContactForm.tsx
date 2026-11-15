"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { CONTACT_EMAIL } from "@/content/nav";
import { countries, regionsFor, REGION_NOT_APPLICABLE, REGION_NOT_APPLICABLE_LABEL } from "@/lib/geography";
import EngagementFields from "./EngagementFields";
import { FieldError, invalidProps, type Feedback } from "./fieldFeedback";
import PhoneField from "./PhoneField";
import {
  contactPolicy, emptyEngagementAnswers, emptyIdentity, engagementOptions, engagements, limits, modeOf, parseEngagement, plansFor,
  OTHER_FUNCTION, prepareRequest, primaryFunctions, requestMailto, validateApplication, type Engagement, type FieldErrors, type Identity,
} from "./engagements";
import styles from "./contact.module.css";

const accessEngagements = engagementOptions.filter((key) => modeOf(key));
const otherEngagements = engagementOptions.filter((key) => !modeOf(key));

type Policy = ReturnType<typeof contactPolicy>;
type FieldsProps = { policy: Policy; value: Identity; onChange: (value: Identity) => void; feedback: Feedback };
const optional = (requirement: string) => (requirement === "required" ? "" : " (optional)");

/**
 * Applicant and organization details share one two-column grid, in reading order. Fields the
 * mode omits are simply not rendered, so the grid reflows; an odd final field spans both
 * columns rather than leaving an empty cell.
 */
function ContactFields({ policy, value, onChange, feedback, onPhoneChange }: FieldsProps & { onPhoneChange: (phone: Pick<Identity, "phone" | "phoneCountry">) => void }) {
  const fields = [
    <label key="name" className={styles.field}>
      <span>Full name</span>
      <input name="name" type="text" autoComplete="name" required maxLength={limits.name} placeholder="First and last name"
        value={value.name} onChange={(e) => onChange({ ...value, name: e.target.value })} onBlur={() => feedback.touch("name")}
        {...invalidProps(feedback, "name")} />
      <FieldError feedback={feedback} name="name" />
    </label>,
    <label key="email" className={styles.field}>
      <span>{policy.emailLabel}</span>
      <input name="email" type="email" autoComplete="email" required maxLength={limits.email} spellCheck={false}
        placeholder={policy.emailLabel === "Business email" ? "name@company.com" : "name@example.com"}
        value={value.email} onChange={(e) => onChange({ ...value, email: e.target.value })} onBlur={() => feedback.touch("email")}
        {...invalidProps(feedback, "email")} />
      <FieldError feedback={feedback} name="email" />
    </label>,
    <label key="organization" className={styles.field}>
      <span>Company / Organization{optional(policy.organization)}</span>
      <input name="organization" type="text" autoComplete="organization" required={policy.organization === "required"} maxLength={limits.organization}
        placeholder="Company name" value={value.organization} onChange={(e) => onChange({ ...value, organization: e.target.value })}
        onBlur={() => feedback.touch("organization")} {...invalidProps(feedback, "organization")} />
      <FieldError feedback={feedback} name="organization" />
    </label>,
    policy.jobTitle !== "omitted" && (
      <label key="jobTitle" className={styles.field}>
        <span>Job title{optional(policy.jobTitle)}</span>
        <input name="jobTitle" type="text" autoComplete="organization-title" required={policy.jobTitle === "required"} maxLength={limits.jobTitle}
          placeholder="e.g. Portfolio Manager" value={value.jobTitle} onChange={(e) => onChange({ ...value, jobTitle: e.target.value })}
          onBlur={() => feedback.touch("jobTitle")} {...invalidProps(feedback, "jobTitle")} />
        <FieldError feedback={feedback} name="jobTitle" />
      </label>
    ),
    <PhoneField key="phone" country={value.phoneCountry} number={value.phone} hint={value.country} required={policy.phone === "required"}
      error={feedback.errors.phoneCountry ?? feedback.errors.phone}
      onChange={onPhoneChange}
      onBlurNumber={(phone) => feedback.touch("phone", phone)} />,
    policy.primaryFunction !== "omitted" && (
      <div key="primaryFunction" className={styles.fieldStack}>
        <label className={styles.field}>
          <span>Primary function{optional(policy.primaryFunction)}</span>
          <select name="primaryFunction" required={policy.primaryFunction === "required"} value={value.primaryFunction}
            {...invalidProps(feedback, "primaryFunction")}
            onChange={(e) => {
              // Leaving "Other" discards its description so it can never be submitted stale.
              const next = e.target.value;
              onChange({ ...value, primaryFunction: next, primaryFunctionOther: next === OTHER_FUNCTION ? value.primaryFunctionOther : "" });
            }}>
            <option value="">Select primary function</option>
            {primaryFunctions.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
          </select>
          <FieldError feedback={feedback} name="primaryFunction" />
        </label>
        {value.primaryFunction === OTHER_FUNCTION ? (
          <label className={styles.field}>
            <span>Please specify your primary function</span>
            <input name="primaryFunctionOther" type="text" required maxLength={limits.primaryFunctionOther} placeholder="Enter your role or function"
              value={value.primaryFunctionOther} onChange={(e) => onChange({ ...value, primaryFunctionOther: e.target.value })}
              onBlur={() => feedback.touch("primaryFunctionOther")} {...invalidProps(feedback, "primaryFunctionOther")} />
            <FieldError feedback={feedback} name="primaryFunctionOther" />
          </label>
        ) : null}
      </div>
    ),
    policy.website !== "omitted" && (
      <label key="website" className={styles.field}>
        <span>Organization website{optional(policy.website)}</span>
        <input name="website" type="text" inputMode="url" autoComplete="url" placeholder="https://company.com" spellCheck={false} maxLength={limits.website}
          required={policy.website === "required"} value={value.website} onChange={(e) => onChange({ ...value, website: e.target.value })}
          onBlur={() => feedback.touch("website")} {...invalidProps(feedback, "website")} />
        <FieldError feedback={feedback} name="website" />
      </label>
    ),
  ].filter((field) => field !== false);
  const last = fields.length - 1;
  return (
    <fieldset className={styles.fieldGroup}>
      <legend className={styles.visuallyHidden}>Applicant and organization</legend>
      <div className={styles.grid}>
        {fields.map((field, i) => (fields.length % 2 === 1 && i === last
          ? <div key={field.key} className={styles.spanAll}>{field}</div>
          : field))}
      </div>
    </fieldset>
  );
}

function LocationFields({ value, onChange, feedback }: Omit<FieldsProps, "policy">) {
  const regions = regionsFor(value.country);
  const notApplicable = value.country !== "" && regions.length === 0;
  return (
    <fieldset className={styles.fieldGroup}>
      <legend className={styles.visuallyHidden}>Location</legend>
      <div className={styles.row}>
        <label className={styles.field}>
          <span>Country</span>
          <select name="country" required autoComplete="country" value={value.country} {...invalidProps(feedback, "country")}
            onChange={(e) => {
              const country = e.target.value;
              // A region never survives a country change; "Not applicable" is preselected only
              // when it is the sole valid answer for the new country.
              onChange({ ...value, country, region: country && regionsFor(country).length === 0 ? REGION_NOT_APPLICABLE : "" });
            }}>
            <option value="">Select country</option>
            {countries.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
          </select>
          <FieldError feedback={feedback} name="country" />
        </label>
        <label className={styles.field}>
          <span>State / Province / Region</span>
          <select name="region" required disabled={!value.country} value={value.region} {...invalidProps(feedback, "region")}
            onChange={(e) => onChange({ ...value, region: e.target.value })}>
            <option value="">{value.country ? "Select state or region" : "Select a country first"}</option>
            {notApplicable
              ? <option value={REGION_NOT_APPLICABLE}>{REGION_NOT_APPLICABLE_LABEL}</option>
              : regions.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <FieldError feedback={feedback} name="region" />
        </label>
      </div>
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
  const [identity, setIdentity] = useState<Identity>(emptyIdentity);
  // Phone edits stay in PhoneField; the submission boundary always reads its latest raw value.
  const phoneValue = useRef({ phoneCountry: identity.phoneCountry, phone: identity.phone });
  const onPhoneChange = (phone: Pick<Identity, "phone" | "phoneCountry">) => {
    phoneValue.current = phone;
    setErrors((shown) => {
      if (!shown.phone && !shown.phoneCountry) return shown;
      const next = { ...shown };
      delete next.phone;
      delete next.phoneCountry;
      return next;
    });
  };
  const [answers, setAnswers] = useState(emptyEngagementAnswers);
  const [errors, setErrors] = useState<FieldErrors>({});
  const config = engagement ? engagements[engagement] : null;
  const plans = plansFor(engagement);
  const showPlan = engagement === "" || plans.length > 0;

  const validate = (override?: Partial<Identity>) =>
    validateApplication(engagement, plan, { ...identity, ...phoneValue.current, ...override }, engagement ? answers[engagement] : {});

  // Shown errors follow the current values: corrected fields clear, and fields that no longer
  // apply after a mode change drop out. New errors appear only on blur or submit.
  useEffect(() => {
    setErrors((shown) => {
      const keys = Object.keys(shown);
      if (keys.length === 0) return shown;
      const result = validateApplication(engagement, plan, { ...identity, ...phoneValue.current }, engagement ? answers[engagement] : {});
      const next: FieldErrors = {};
      if (!result.ok) for (const key of keys) if (result.errors[key]) next[key] = result.errors[key];
      return keys.every((key) => next[key] === shown[key]) ? shown : next;
    });
  }, [engagement, plan, identity, answers]);

  const feedback: Feedback = {
    errors,
    // Leaving a field checks its format; an untouched empty field waits for submit.
    touch: (field, override) => {
      const values = { ...identity, ...phoneValue.current, ...override } as Record<string, string>;
      const current = values[field] ?? (engagement ? (answers[engagement] as Record<string, string>)[field] : "") ?? "";
      if (!current.trim() && !errors[field]) return;
      const result = validate(override);
      const keys = field === "phone" ? ["phone", "phoneCountry"] : [field];
      setErrors((shown) => {
        const next = { ...shown };
        for (const key of keys) {
          const message = result.ok ? undefined : result.errors[key];
          if (message) next[key] = message;
          else delete next[key];
        }
        return next;
      });
    },
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!engagement) return;
    // Submission boundary: every selection and contact value is re-validated and normalised.
    const result = validate();
    if (!result.ok) {
      setErrors(result.errors);
      const first = [...event.currentTarget.elements].find(
        (el): el is HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLButtonElement =>
          "name" in el && typeof el.name === "string" && el.name in result.errors && !(el as HTMLInputElement).disabled,
      );
      first?.focus();
      return;
    }
    setErrors({});
    window.location.href = requestMailto(CONTACT_EMAIL, prepareRequest(result.application));
  };

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate aria-label={config?.heading ?? "Application"}>
      <div className={showPlan ? styles.row : undefined}>
        <label className={styles.field}>
          <span>What can we help you with?</span>
          <select ref={selectorRef} name="engagement" value={engagement} required
            {...invalidProps(feedback, "engagement", "request-description")}
            onChange={(e) => onEngagementChange(parseEngagement(e.target.value))}>
            <option value="">Select access mode</option>
            <optgroup label="Access mode">
              {accessEngagements.map((key) => <option key={key} value={key}>{engagements[key].label}</option>)}
            </optgroup>
            <optgroup label="Technical materials">
              {otherEngagements.map((key) => <option key={key} value={key}>{engagements[key].label}</option>)}
            </optgroup>
          </select>
          <FieldError feedback={feedback} name="engagement" />
        </label>
        {showPlan ? (
          <label className={styles.field}>
            <span>Plan</span>
            <select name="plan" required disabled={plans.length === 0} value={plan} {...invalidProps(feedback, "plan")}
              onChange={(e) => onPlanChange(e.target.value)}>
              <option value="">{plans.length ? "Select plan" : "Select an access mode first"}</option>
              {plans.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <FieldError feedback={feedback} name="plan" />
          </label>
        ) : null}
      </div>
      {engagement && config ? <>
        <ContactFields policy={contactPolicy(engagement)} value={{ ...identity, ...phoneValue.current }} onChange={setIdentity} feedback={feedback} onPhoneChange={onPhoneChange} />
        <LocationFields value={identity} onChange={setIdentity} feedback={feedback} />
        <EngagementFields engagement={engagement} answers={answers[engagement]} feedback={feedback} onChange={(key, value) => {
          setAnswers((current) => ({ ...current, [engagement]: { ...current[engagement], [key]: value } }));
        }} />
        <div className={styles.submitRow}>
          <button type="submit" className="btn btn-primary">{config.action}</button>
        </div>
      </> : null}
    </form>
  );
}
