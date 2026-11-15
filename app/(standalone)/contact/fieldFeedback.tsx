import type { FieldErrors, Identity } from "./engagements";
import styles from "./contact.module.css";

/** Inline validation plumbing shared by every field: errors appear beneath the control. */
export type Feedback = { errors: FieldErrors; touch: (field: string, override?: Partial<Identity>) => void };
export const errorId = (name: string) => `request-error-${name}`;
export const invalidProps = (feedback: Feedback, name: string, describedBy?: string) => {
  const error = feedback.errors[name];
  const ids = [describedBy, error ? errorId(name) : undefined].filter(Boolean).join(" ");
  return { "aria-invalid": error ? true : undefined, "aria-describedby": ids || undefined };
};
export function FieldError({ feedback, name }: { feedback: Feedback; name: string }) {
  const error = feedback.errors[name];
  return error ? <p id={errorId(name)} className={styles.fieldError}>{error}</p> : null;
}
