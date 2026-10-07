import { productSection } from "@/content/nav";
import SectionShell from "./SectionShell";
import ProductRouteStart from "./ProductRouteStart";

/** Shared nested layout keeps the product rail mounted between destinations. */
export default function ProductShell({ children }: { children: React.ReactNode }) {
  return <SectionShell section={productSection}><ProductRouteStart />{children}</SectionShell>;
}
