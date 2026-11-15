import { FieldError, invalidProps, type Feedback } from "./fieldFeedback";
import { engagements, fieldLimit, requestFields, type Engagement } from "./engagements";
import styles from "./contact.module.css";

export default function EngagementFields({ engagement, answers, onChange, feedback }: {
  engagement: Engagement;
  answers: Readonly<Record<string, string>>;
  onChange: (key: string, value: string) => void;
  feedback: Feedback;
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
          maxLength: fieldLimit(field),
          placeholder: field.placeholder,
          ...invalidProps(feedback, field.key, field.hint ? `${id}-hint` : undefined),
          onBlur: () => feedback.touch(field.key),
          onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(field.key, event.target.value),
        };
        return (
          <div className={styles.field} key={id}>
            <label htmlFor={id}>{field.label}{field.required ? "" : " (optional)"}</label>
            {field.kind === "textarea"
              ? <textarea {...props} rows={3} />
              : <input {...props} type="text" />}
            <FieldError feedback={feedback} name={field.key} />
            {field.hint && <p id={`${id}-hint`} className={styles.fieldHint}>{field.hint}</p>}
          </div>
        );
      })}
    </fieldset>
  );
}
