import SectionShell from "@/components/SectionShell";
import { sections } from "@/content/nav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SectionShell section={sections.documentation}>{children}</SectionShell>;
}
