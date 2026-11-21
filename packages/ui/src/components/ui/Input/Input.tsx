import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "../../../lib/utils"
import styles from "./Input.module.css"

export type InputProps = React.ComponentProps<"input">

function Input({ className, type, ...props }: InputProps) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(styles.root, className)}
      {...props}
    />
  )
}

export { Input }
