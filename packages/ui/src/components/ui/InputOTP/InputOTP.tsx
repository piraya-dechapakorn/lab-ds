"use client"

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { MinusIcon } from "lucide-react"

import { cn } from "../../../lib/utils"
import styles from "./InputOTP.module.css"

export type InputOTPProps = React.ComponentProps<typeof OTPInput> & {
  /** Class for the wrapper around the slots (the `className` goes on the hidden input). */
  containerClassName?: string
}

function InputOTP({ className, containerClassName, ...props }: InputOTPProps) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn("cn-input-otp", styles.container, containerClassName)}
      spellCheck={false}
      className={cn(styles.input, className)}
      {...props}
    />
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn(styles.group, className)}
      {...props}
    />
  )
}

export type InputOTPSlotProps = React.ComponentProps<"div"> & {
  /** Position of this slot within the OTP value. */
  index: number
}

function InputOTPSlot({ index, className, ...props }: InputOTPSlotProps) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(styles.slot, className)}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className={styles.caret}>
          <div className={styles.caretBar} />
        </div>
      )}
    </div>
  )
}

function InputOTPSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      role="separator"
      className={cn(styles.separator, className)}
      {...props}
    >
      <MinusIcon />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
