import type * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "../../../lib/utils"
import styles from "./Badge.module.css"

export type BadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost"
  | "link"

export type BadgeProps = useRender.ComponentProps<"span"> & {
  /** Visual treatment. @default "default" */
  variant?: BadgeVariant
}

/** Props that make any element look like a Badge. */
function badgeStyles({
  variant = "default",
  className,
}: { variant?: BadgeVariant; className?: string } = {}) {
  return {
    className: cn(styles.root, className),
    "data-variant": variant,
  }
}

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: BadgeProps) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        "data-slot": "badge",
        ...badgeStyles({ variant, className }),
      } as React.ComponentProps<"span">,
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeStyles }
