import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@piraya.d/ai_designsystem_lab"
import type { InputOTPProps } from "@piraya.d/ai_designsystem_lab"
import { expect, fn, userEvent, waitFor } from "storybook/test"

/** Digits only. The same value as `REGEXP_ONLY_DIGITS` from `input-otp`. */
const DIGITS_ONLY = "^\\d+$"

const meta = {
  title: "Components/InputOTP",
  component: InputOTP,
  args: {
    maxLength: 6,
    pattern: DIGITS_ONLY,
    disabled: false,
    "aria-label": "Verification code",
    onChange: fn(),
    onComplete: fn(),
    children: null,
  },
  // Props are declared by hand: stories import the built package, which
  // docgen cannot read. These are the InputOTP (root) props.
  argTypes: {
    maxLength: {
      control: "number",
      description: "Number of characters. Render the same number of slots.",
      type: { name: "number", required: true },
    },
    pattern: {
      control: "text",
      description:
        "Regular expression each typed or pasted character must match. Other characters are ignored.",
    },
    value: { control: "text", description: "The code, from your own state." },
    defaultValue: { control: "text" },
    disabled: {
      control: "boolean",
      table: { defaultValue: { summary: "false" } },
    },
    inputMode: {
      control: "select",
      options: ["numeric", "text"],
      description: "Which on-screen keyboard phones show.",
      table: { defaultValue: { summary: "numeric" } },
    },
    autoComplete: {
      control: "text",
      description: "Lets phones offer a code from a text message.",
      table: { defaultValue: { summary: "one-time-code" } },
    },
    "aria-label": { control: "text", name: "aria-label" },
    onChange: {
      control: false,
      description: "Called with the new code (a string).",
    },
    onComplete: {
      control: false,
      description: "Called with the code once every slot is filled.",
    },
    containerClassName: {
      control: "text",
      description:
        "Class for the row of slots. `className` goes on the hidden input.",
    },
    pasteTransformer: {
      control: false,
      description:
        "Cleans pasted text before it is checked, e.g. removes dashes.",
    },
    children: { control: false },
  },
} satisfies Meta<typeof InputOTP>

export default meta
type Story = StoryObj<typeof meta>

/**
 * InputOTP takes either `children` or a `render` function. Stories always pass
 * children, so drop `render` from the args before spreading them.
 */
const otp = (args: Story["args"]) =>
  args as Omit<InputOTPProps, "render" | "children">

/** Six digits in two groups of three. */
function SixDigitSlots() {
  return (
    <>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </>
  )
}

/** Use the Controls panel to try each prop. */
export const Playground: Story = {
  render: (args) => (
    <InputOTP {...otp(args)}>
      <SixDigitSlots />
    </InputOTP>
  ),
}

/** A verification code inside a Field, with a label and a hint. */
export const WithLabel: Story = {
  render: (args) => (
    <Field className="w-auto">
      <FieldLabel htmlFor="otp-code">Verification code</FieldLabel>
      <InputOTP
        {...otp(args)}
        id="otp-code"
        aria-label={undefined}
        aria-describedby="otp-code-hint"
      >
        <SixDigitSlots />
      </InputOTP>
      <FieldDescription id="otp-code-hint">
        We sent a 6-digit code to 081 234 5678.
      </FieldDescription>
    </Field>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText("Verification code")
    await expect(input).toHaveAttribute("autocomplete", "one-time-code")
    await expect(input).toHaveAttribute("inputmode", "numeric")
    await expect(input).toHaveAccessibleDescription(
      "We sent a 6-digit code to 081 234 5678."
    )
  },
}

/** One group with no separator, here for a 4-digit PIN. */
export const SingleGroup: Story = {
  args: { maxLength: 4, "aria-label": "PIN" },
  render: (args) => (
    <InputOTP {...otp(args)}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
      </InputOTPGroup>
    </InputOTP>
  ),
}

/**
 * Each state the CSS styles: empty, `data-active` (the `play` function focuses
 * that row, since only one field can have focus), filled, `aria-invalid` on
 * the slots, and disabled.
 */
export const States: Story = {
  parameters: { layout: "padded" },
  render: (args) => {
    const states = [
      { label: "empty", props: {}, invalid: false },
      { label: "data-active", props: { defaultValue: "12" }, invalid: false },
      { label: "filled", props: { defaultValue: "123456" }, invalid: false },
      {
        label: "aria-invalid",
        props: { defaultValue: "123456" },
        invalid: true,
      },
      {
        label: "disabled",
        props: { defaultValue: "123456", disabled: true },
        invalid: false,
      },
    ]
    return (
      <div className="grid grid-cols-[8rem_auto] items-center justify-start gap-4 text-sm">
        {states.map((s) => (
          <div key={s.label} className="contents">
            <span className="font-mono text-muted-foreground">{s.label}</span>
            <InputOTP {...otp(args)} {...s.props} aria-label={s.label}>
              <InputOTPGroup>
                {Array.from({ length: 6 }, (_, i) => (
                  <InputOTPSlot key={i} index={i} aria-invalid={s.invalid} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
        ))}
      </div>
    )
  },
  play: async ({ canvas, canvasElement }) => {
    const input = canvas.getByLabelText("data-active")
    // focus() rather than a click: a click moves the caret to the slot under
    // the pointer, while focus puts it after the "12" already entered.
    input.focus()
    const row = input.closest(".contents")
    const slots = row?.querySelectorAll("[data-slot='input-otp-slot']") ?? []
    // The next character goes into the third slot, and only that one is active.
    await waitFor(() => expect(slots[2]).toHaveAttribute("data-active", "true"))
    await expect(
      canvasElement.querySelectorAll("[data-active='true']")
    ).toHaveLength(1)
  },
}

/** A wrong code: `aria-invalid` on every slot and the input, and the message in a FieldError. */
export const Invalid: Story = {
  args: { defaultValue: "123456" },
  render: (args) => (
    <Field className="w-auto" data-invalid>
      <FieldLabel htmlFor="otp-invalid">Verification code</FieldLabel>
      <InputOTP
        {...otp(args)}
        id="otp-invalid"
        aria-label={undefined}
        aria-invalid
        aria-describedby="otp-invalid-error"
      >
        <InputOTPGroup>
          {Array.from({ length: 6 }, (_, i) => (
            <InputOTPSlot key={i} index={i} aria-invalid />
          ))}
        </InputOTPGroup>
      </InputOTP>
      <FieldError id="otp-invalid-error">
        That code is wrong. Check the latest text message and try again.
      </FieldError>
    </Field>
  ),
  play: async ({ canvas, canvasElement }) => {
    const input = canvas.getByLabelText("Verification code")
    await expect(input).toBeInvalid()
    await expect(input).toHaveAccessibleDescription(
      "That code is wrong. Check the latest text message and try again."
    )
    // Focusing a full, invalid code makes the last slot active and invalid.
    input.focus()
    const slots = canvasElement.querySelectorAll("[data-slot='input-otp-slot']")
    await waitFor(() => expect(slots[5]).toHaveAttribute("data-active", "true"))
    await expect(slots[5]).toHaveAttribute("aria-invalid", "true")
  },
}

/** Typing fills the slots in order. `onComplete` fires once the last slot is filled. */
export const TypeCode: Story = {
  render: Playground.render,
  play: async ({ args, canvas }) => {
    const input = canvas.getByLabelText("Verification code")
    await userEvent.click(input)
    await userEvent.keyboard("12345")
    await expect(args.onComplete).not.toHaveBeenCalled()
    await userEvent.keyboard("6")
    await expect(input).toHaveValue("123456")
    await expect(args.onComplete).toHaveBeenCalledWith("123456")
  },
}

/** With `pattern` set to digits, letters are ignored. */
export const DigitsOnly: Story = {
  render: Playground.render,
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText("Verification code")
    await userEvent.click(input)
    await userEvent.keyboard("12ab3")
    await expect(input).toHaveValue("123")
  },
}

/** Pasting the whole code fills every slot at once. */
export const PasteCode: Story = {
  render: Playground.render,
  play: async ({ args, canvas }) => {
    const input = canvas.getByLabelText("Verification code")
    await userEvent.click(input)
    await userEvent.paste("482913")
    await expect(input).toHaveValue("482913")
    await expect(args.onComplete).toHaveBeenCalledWith("482913")
  },
}

/** Controlled: the code lives in your own state through `value` and `onChange`. */
export const Controlled: Story = {
  render: function ControlledOTP(args) {
    const [value, setValue] = React.useState("")
    return (
      <div className="flex flex-col items-start gap-3 text-sm">
        <InputOTP {...otp(args)} value={value} onChange={setValue}>
          <SixDigitSlots />
        </InputOTP>
        <p className="text-muted-foreground">
          {value ? `You entered: ${value}` : "Enter the code."}
        </p>
      </div>
    )
  },
}
