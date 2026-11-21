import * as React from "react"

import { cn } from "../../../lib/utils"
import styles from "./Textarea.module.css"

export type TextareaProps = React.ComponentProps<"textarea">

function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(styles.root, className)}
      {...props}
    />
  )
}

export { Textarea }
