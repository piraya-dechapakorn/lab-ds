"use client"

import { useMemo } from "react"

import { Label } from "../Label"
import { Separator } from "../Separator"
import { cn } from "../../../lib/utils"
import styles from "./Field.module.css"

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(styles.set, className)}
      {...props}
    />
  )
}

export type FieldLegendProps = React.ComponentProps<"legend"> & {
  /** `legend` = section heading, `label` = label-sized text. @default "legend" */
  variant?: "legend" | "label"
}

function FieldLegend({
  className,
  variant = "legend",
  ...props
}: FieldLegendProps) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(styles.legend, className)}
      {...props}
    />
  )
}

function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn(styles.group, className)}
      {...props}
    />
  )
}

export type FieldOrientation = "vertical" | "horizontal" | "responsive"

export type FieldProps = React.ComponentProps<"div"> & {
  /**
   * Label/control layout. `responsive` stacks on narrow containers and goes
   * horizontal once the surrounding FieldGroup is `@md` wide.
   * @default "vertical"
   */
  orientation?: FieldOrientation
}

function Field({ className, orientation = "vertical", ...props }: FieldProps) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(styles.field, className)}
      {...props}
    />
  )
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn(styles.content, className)}
      {...props}
    />
  )
}

function FieldLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(styles.label, className)}
      {...props}
    />
  )
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-label"
      className={cn(styles.title, className)}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(styles.description, className)}
      {...props}
    />
  )
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode
}) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn(styles.separator, className)}
      {...props}
    >
      <Separator className={styles.separatorLine} />
      {children && (
        <span
          className={styles.separatorContent}
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  )
}

export type FieldErrorProps = React.ComponentProps<"div"> & {
  /** Validation errors (e.g. from react-hook-form); duplicates are collapsed. */
  errors?: Array<{ message?: string } | undefined>
}

function FieldError({ className, children, errors, ...props }: FieldErrorProps) {
  const content = useMemo(() => {
    if (children) {
      return children
    }

    if (!errors?.length) {
      return null
    }

    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ]

    if (uniqueErrors?.length == 1) {
      return uniqueErrors[0]?.message
    }

    return (
      <ul className={styles.errorList}>
        {uniqueErrors.map(
          (error, index) =>
            error?.message && <li key={index}>{error.message}</li>
        )}
      </ul>
    )
  }, [children, errors])

  if (!content) {
    return null
  }

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn(styles.error, className)}
      {...props}
    >
      {content}
    </div>
  )
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
}
