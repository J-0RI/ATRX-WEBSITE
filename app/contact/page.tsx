import type { Metadata } from "next";
import { DocHeader, Note } from "@/components/Doc";
import { ENGINEERING_EMAIL } from "@/content/nav";
import ContactForm from "./ContactForm";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact Engineering",
  description: "Request pipeline access or technical documentation. Qualified inbound only.",
};

export default function ContactPage() {
  return (
    <>
      <DocHeader eyebrow="Contact · Qualified inbound only" title="Request pipeline access or technical documentation.">
        <p>
          Submissions are routed directly for engineering review. The form will open your local mail
          client with a formatted message payload.
        </p>
      </DocHeader>

      <div className={styles.panel}>
        <ContactForm />
      </div>

      <Note>
        Direct engineering inquiries: <a href={`mailto:${ENGINEERING_EMAIL}`}>{ENGINEERING_EMAIL}</a>
      </Note>
    </>
  );
}
