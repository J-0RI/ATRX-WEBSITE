import Link from "next/link";
import { Actions, DocHeader } from "@/components/Doc";

export default function NotFound() {
  return (
    <>
      <DocHeader eyebrow="404" title="This page does not exist.">
        <p>The address may have changed. Every ATRX page is listed in the navigation.</p>
      </DocHeader>
      <Actions>
        <Link href="/" className="btn btn-primary">
          Overview
        </Link>
        <Link href="/documentation" className="btn btn-secondary">
          Technical library
        </Link>
      </Actions>
    </>
  );
}
