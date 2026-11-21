import { Button as ButtonPrimitive } from "@base-ui/react/button"

import { cn, mergeClassName } from "../../../lib/utils"
import styles from "./Button.module.css"

export type ButtonVariant =
  | "default"
  | "outline"
  | "secondary"
  | "ghost"
  | "destructive"
  | "link"

export type ButtonSize =
  | "default"
  | "xs"
  | "sm"
  | "lg"
  | "icon"
  | "icon-xs"
  | "icon-sm"
  | "icon-lg"

export interface ButtonStyleProps {
  /** Visual treatment. @default "default" */
  variant?: ButtonVariant
  /** Height / padding scale. `icon-*` sizes are square. @default "default" */
  size?: ButtonSize
}

export type ButtonProps = ButtonPrimitive.Props & ButtonStyleProps

/**
 * Props that make any element look like a Button (e.g. a `next/link`):
 * `<Link href="/" {...buttonStyles({ variant: "outline" })} />`
 */
function buttonStyles({
  variant = "default",
  size = "default",
  className,
}: ButtonStyleProps & { className?: string } = {}) {
  return {
    className: cn(styles.root, className),
    "data-variant": variant,
    "data-size": size,
  }
}

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={mergeClassName(styles.root, className)}
      {...props}
    />
  )
}

export { Button, buttonStyles }
