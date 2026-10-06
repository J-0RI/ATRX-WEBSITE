import { engagements, requestFields, type Engagement } from "./engagements";
import styles from "./contact.module.css";

export default function EngagementFields({ engagement, answers, onChange }: {
  engagement: Engagement;
  answers: Readonly<Record<string, string>>;
  onChange: (key: string, value: string) => void;
}) {
  return (
    <fieldset className={styles.fieldGroup}>
      <legend className={styles.visuallyHidden}>{engagements[engagement].label} request details</legend>
      {requestFields(engagement).map((field) => {
        const id = `${engagement}-${field.key}`;
        const props = {
          id,
          name: field.key,
          required: field.required ?? false,
          value: answers[field.key],
          "aria-describedby": field.hint ? `${id}-hint` : undefined,
          onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(field.key, event.target.value),
        };
        return (
          <div className={styles.field} key={id}>
            <label htmlFor={id}>{field.label}{field.required ? "" : " (optional)"}</label>
            {field.kind === "textarea"
              ? <textarea {...props} rows={3} />
              : <input {...props} type="text" />}
            {field.hint && <p id={`${id}-hint`} className={styles.fieldHint}>{field.hint}</p>}
          </div>
        );
      })}
    </fieldset>
  );
}
