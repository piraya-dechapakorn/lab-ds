import * as React from "react"

import { cn } from "../../../lib/utils"
import styles from "./Alert.module.css"

export type AlertVariant = "default" | "destructive"

export type AlertProps = React.ComponentProps<"div"> & {
  /** @default "default" */
  variant?: AlertVariant
}

function Alert({ className, variant = "default", ...props }: AlertProps) {
  return (
    <div
      data-slot="alert"
      data-variant={variant}
      role="alert"
      className={cn(styles.root, className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(styles.title, className)}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(styles.description, className)}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn(styles.action, className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction }
