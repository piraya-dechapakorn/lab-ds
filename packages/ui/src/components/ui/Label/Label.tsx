"use client"

import * as React from "react"

import { cn } from "../../../lib/utils"
import styles from "./Label.module.css"

export type LabelProps = React.ComponentProps<"label">

function Label({ className, ...props }: LabelProps) {
  return (
    <label
      data-slot="label"
      className={cn(styles.root, className)}
      {...props}
    />
  )
}

export { Label }
