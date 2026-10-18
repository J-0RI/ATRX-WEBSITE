import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ChevronRight } from "./Icons";

/*
 * The single primitive for any textual action paired with a directional arrow.
 * Permanent Haldane + ATRX rule: borderless text-and-arrow, no fill, container or
 * resting border. Styling lives in `.arrow-action` (app/globals.css).
 * Renders a link when given `href`, otherwise a native button.
 */
type Common = { children: ReactNode; className?: string };
type ArrowLinkProps = Common & Omit<ComponentProps<typeof Link>, "className" | "children">;
type ArrowButtonProps = Common & { href?: never } & Omit<ComponentProps<"button">, "className" | "children">;

export default function ArrowAction(props: ArrowLinkProps | ArrowButtonProps) {
  const classes = props.className ? `arrow-action ${props.className}` : "arrow-action";
  const content = (
    <>
      <span>{props.children}</span>
      <ChevronRight size={14} className="arrow-action-icon" />
    </>
  );

  if (props.href !== undefined) {
    const { children, className, ...link } = props as ArrowLinkProps;
    return (
      <Link {...link} className={classes}>
        {content}
      </Link>
    );
  }

  const { children, className, type = "button", ...button } = props as ArrowButtonProps;
  return (
    <button {...button} type={type} className={classes}>
      {content}
    </button>
  );
}
