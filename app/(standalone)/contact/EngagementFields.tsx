import { FieldError, invalidProps, type Feedback } from "./fieldFeedback";
import { engagements, fieldLimit, visibleFields, type Engagement } from "./engagements";
import styles from "./contact.module.css";

export default function EngagementFields({ engagement, plan, answers, onChange, feedback }: {
  engagement: Engagement;
  /** Selected plan id; some questions apply only to particular plans. */
  plan: string;
  answers: Readonly<Record<string, string>>;
  onChange: (key: string, value: string) => void;
  feedback: Feedback;
}) {
  return (
    <fieldset className={styles.fieldGroup}>
      <legend className={styles.visuallyHidden}>{engagements[engagement].label} request details</legend>
      {visibleFields(engagement, answers, plan).map((field) => {
        const id = `${engagement}-${field.key}`;
        const props = {
          id,
          name: field.key,
          required: field.required ?? false,
          value: answers[field.key] ?? "",
          ...invalidProps(feedback, field.key, field.hint ? `${id}-hint` : undefined),
          onBlur: () => feedback.touch(field.key),
          onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => onChange(field.key, event.target.value),
        };
        return (
          <div className={styles.field} key={id}>
            <label htmlFor={id}>{field.label}{field.required ? "" : " (optional)"}</label>
            {field.kind === "select" ? (
              <select {...props}>
                <option value="">Select an option</option>
                {field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            ) : field.kind === "textarea"
              ? <textarea {...props} maxLength={fieldLimit(field)} placeholder={field.placeholder} rows={3} />
              : <input {...props} maxLength={fieldLimit(field)} placeholder={field.placeholder} type="text" />}
            <FieldError feedback={feedback} name={field.key} />
            {field.hint && <p id={`${id}-hint`} className={styles.fieldHint}>{field.hint}</p>}
          </div>
        );
      })}
    </fieldset>
  );
}
