"use client"

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"

import { mergeClassName } from "../../../lib/utils"
import styles from "./Separator.module.css"

export type SeparatorProps = SeparatorPrimitive.Props

function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={mergeClassName(styles.root, className)}
      {...props}
    />
  )
}

export { Separator }
