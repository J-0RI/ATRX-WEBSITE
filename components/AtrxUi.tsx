import type { ReactNode } from "react";
import { CheckCircle2Icon, InfoIcon, TriangleAlertIcon } from "lucide-react";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import styles from "./AtrxUi.module.css";

/*
 * ATRX variants over the shadcn/ui primitives (decision-20261018-bubble-alert-standard,
 * decision-20261018-user-bubble-standard, decision-20261018-alert-standard).
 * shadcn supplies structure and behaviour; AtrxUi.module.css supplies the Haldane + ATRX
 * radius, spacing, type and colour (unlayered, so it wins over Tailwind utilities).
 */

/** A user-submitted request inside an ATRX application view. */
export function UserMessage({ children }: { children: ReactNode }) {
  return (
    <Bubble align="end" variant="secondary" className={styles.bubble}>
      <BubbleContent className={styles.bubbleContent}>{children}</BubbleContent>
    </Bubble>
  );
}

const icons = { info: InfoIcon, warning: TriangleAlertIcon, success: CheckCircle2Icon };

/**
 * A semantic notice. `info`: evidence or context still needed, research limits.
 * `warning`: a condition that stops or constrains progression. `success`: a task
 * that genuinely completed. Static preview content, so it is a note, not a live alert.
 */
export function Notice({ tone = "info", title, children, className }: { tone?: keyof typeof icons; title: string; children: ReactNode; className?: string }) {
  const Icon = icons[tone];
  return (
    <Alert role="note" data-tone={tone} className={className ? `${styles.alert} ${className}` : styles.alert}>
      <Icon aria-hidden="true" />
      <AlertTitle className={styles.alertTitle}>{title}</AlertTitle>
      <AlertDescription className={styles.alertDescription}>{children}</AlertDescription>
    </Alert>
  );
}

/**
 * Shared application-window toolbar (decision-20261018-app-toolbar-standard):
 * decorative solid muted-gray window-control silhouettes left, the original ATRX logo centred on the
 * full toolbar width (independent centered layer with reserved grid clearance), shadcn Breadcrumb right.
 * The parent is not a real route in the illustration, so it renders as plain text.
 */
export function AppToolbar({ section, page }: { section: string; page: string }) {
  return (
    <header className={styles.toolbar}>
      <span className={styles.lights} aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <img className={styles.logo} src="/brand/atrx.svg" width={44} height={9} alt="ATRX" />
      <Breadcrumb className={styles.crumbs} aria-label="Application location">
        <BreadcrumbList className={styles.crumbList}>
          <BreadcrumbItem className={styles.crumbParent}>{section}</BreadcrumbItem>
          <BreadcrumbSeparator className={styles.crumbSeparator} />
          <BreadcrumbItem className={styles.crumbCurrent}>
            <BreadcrumbPage className={styles.crumbPage}>{page}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}

/**
 * Compact neutral tooltip naming an icon-only control (decision-20261018-monitoring-icon-rail).
 * Opens on hover and keyboard focus; never permanently visible. Requires a TooltipProvider above.
 */
export function IconTip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right" sideOffset={6} className={styles.tooltip}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

export interface WorkflowConclusionProps {
  label: string;
  primaryText: string;
  supportingText?: string;
  className?: string;
}

/**
 * Shared workflow conclusion component (decision-20261018-workflow-conclusion-standard):
 * A unified, vertically organized editorial conclusion presenting Context (Level 1),
 * Primary next step (Level 2), and Subordinate supporting context or constraint (Level 3)
 * along a single consistent content axis.
 */
export function WorkflowConclusion({
  label,
  primaryText,
  supportingText,
  className,
}: WorkflowConclusionProps) {
  return (
    <div className={className ? `${styles.conclusion} ${className}` : styles.conclusion}>
      <span className={styles.conclusionLabel}>{label}</span>
      <p className={styles.conclusionPrimary}>{primaryText}</p>
      {supportingText ? (
        <span className={styles.conclusionSupporting}>{supportingText}</span>
      ) : null}
    </div>
  );
}
