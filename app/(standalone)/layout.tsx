import StandaloneShell from "@/components/StandaloneShell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <StandaloneShell>{children}</StandaloneShell>;
}
