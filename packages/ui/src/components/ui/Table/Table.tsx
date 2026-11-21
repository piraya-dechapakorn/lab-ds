import * as React from "react"

import { cn } from "../../../lib/utils"
import styles from "./Table.module.css"

export type TableDensity = "default" | "compact"

export type TableProps = React.ComponentProps<"table"> & {
  /** Row height / cell padding scale. @default "default" */
  density?: TableDensity
  /** Keep the header row visible while the container scrolls. @default false */
  stickyHeader?: boolean
  /** Class for the scroll container that wraps the `<table>`. */
  containerClassName?: string
}

function Table({
  className,
  containerClassName,
  density = "default",
  stickyHeader = false,
  ...props
}: TableProps) {
  return (
    <div
      data-slot="table-container"
      className={cn(styles.container, containerClassName)}
    >
      <table
        data-slot="table"
        data-density={density}
        data-sticky-header={stickyHeader || undefined}
        className={cn(styles.root, className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn(styles.header, className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn(styles.body, className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(styles.footer, className)}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(styles.row, className)}
      {...props}
    />
  )
}

export type TableAlign = "start" | "end" | "center"

/* `align` replaces the obsolete HTML attribute of the same name. */
export type TableHeadProps = Omit<React.ComponentProps<"th">, "align"> & {
  /** Horizontal alignment; use `end` for numeric columns. @default "start" */
  align?: TableAlign
}

function TableHead({ className, align = "start", ...props }: TableHeadProps) {
  return (
    <th
      data-slot="table-head"
      data-align={align}
      className={cn(styles.head, className)}
      {...props}
    />
  )
}

export type TableCellProps = Omit<React.ComponentProps<"td">, "align"> & {
  /** Horizontal alignment; use `end` for numeric columns. @default "start" */
  align?: TableAlign
}

function TableCell({ className, align = "start", ...props }: TableCellProps) {
  return (
    <td
      data-slot="table-cell"
      data-align={align}
      className={cn(styles.cell, className)}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn(styles.caption, className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
