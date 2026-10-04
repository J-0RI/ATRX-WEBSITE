import Link from "next/link";
import { Actions, DocHeader } from "@/components/Doc";
import StandaloneShell from "@/components/StandaloneShell";

export default function NotFound() {
  return (
    <StandaloneShell>
      <DocHeader eyebrow="404" title="This page does not exist.">
        <p>The address may have changed. Every ATRX page is listed in the navigation.</p>
      </DocHeader>
      <Actions>
        <Link href="/" className="btn btn-primary">
          ATRX home
        </Link>
        <Link href="/documentation" className="btn btn-secondary">
          Technical library
        </Link>
      </Actions>
    </StandaloneShell>
  );
}
