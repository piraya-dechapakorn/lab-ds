import type { Meta, StoryObj } from "@storybook/react-vite"
import { Field, FieldDescription, FieldError, FieldLabel, Input } from "lab-ds"
import { expect, fn, userEvent } from "storybook/test"

const TYPES = [
  "text",
  "email",
  "password",
  "number",
  "search",
  "tel",
  "url",
  "file",
]

const meta = {
  title: "Components/Input",
  component: Input,
  parameters: { layout: "padded" },
  args: {
    type: "email",
    placeholder: "you@example.com",
    disabled: false,
    "aria-invalid": false,
    "aria-label": "Email",
    onChange: fn(),
  },
  // Props are declared by hand: stories import the built package, which
  // docgen cannot read. Input takes every native <input> attribute.
  argTypes: {
    type: {
      control: "select",
      options: TYPES,
      description: "Native input type.",
      table: { defaultValue: { summary: "text" } },
    },
    placeholder: {
      control: "text",
      description:
        "Example of the expected format. Never a replacement for a label.",
    },
    disabled: {
      control: "boolean",
      table: { defaultValue: { summary: "false" } },
    },
    "aria-invalid": {
      control: "boolean",
      name: "aria-invalid",
      description: "Marks the value as invalid: red border and ring.",
    },
    "aria-label": { control: "text", name: "aria-label" },
    className: { control: "text" },
    onChange: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

/** Use the Controls panel to try each prop. */
export const Playground: Story = {}

/** An Input inside a Field, with a visible label and a hint. */
export const WithLabel: Story = {
  render: () => (
    <Field>
      <FieldLabel htmlFor="input-email">Email</FieldLabel>
      <Input
        id="input-email"
        type="email"
        autoComplete="email"
        aria-describedby="input-email-hint"
      />
      <FieldDescription id="input-email-hint">
        We only use it to send your receipt.
      </FieldDescription>
    </Field>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText("Email")
    await expect(input).toHaveAccessibleDescription(
      "We only use it to send your receipt."
    )
    await userEvent.click(canvas.getByText("Email"))
    await expect(input).toHaveFocus()
  },
}

/** The same component for each native `type`. */
export const Types: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {TYPES.map((type) => (
        <Input key={type} type={type} placeholder={type} aria-label={type} />
      ))}
    </div>
  ),
}

/** Every state the CSS styles: rest, placeholder, filled, `aria-invalid`, disabled. Tab into one to see the focus ring. */
export const States: Story = {
  render: () => {
    const states = [
      { label: "rest", props: {} },
      { label: "placeholder", props: { placeholder: "you@example.com" } },
      { label: "filled", props: { defaultValue: "piraya@example.com" } },
      {
        label: "aria-invalid",
        props: { defaultValue: "piraya@", "aria-invalid": true },
      },
      {
        label: "disabled",
        props: { defaultValue: "piraya@example.com", disabled: true },
      },
    ]
    return (
      <div className="grid grid-cols-[8rem_1fr] items-center gap-3 text-sm">
        {states.map((s) => (
          <div key={s.label} className="contents">
            <span className="font-mono text-muted-foreground">{s.label}</span>
            <Input type="email" aria-label={s.label} {...s.props} />
          </div>
        ))}
      </div>
    )
  },
}

/** An error: `aria-invalid` on the Input, and the message in a FieldError. */
export const Invalid: Story = {
  render: () => (
    <Field data-invalid>
      <FieldLabel htmlFor="input-invalid">Email</FieldLabel>
      <Input
        id="input-invalid"
        type="email"
        defaultValue="piraya@"
        aria-invalid
        aria-describedby="input-invalid-error"
      />
      <FieldError id="input-invalid-error">
        Enter an email address like name@example.com
      </FieldError>
    </Field>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText("Email")
    await expect(input).toBeInvalid()
    await expect(input).toHaveAccessibleDescription(
      "Enter an email address like name@example.com"
    )
  },
}

/** Typing updates the value and calls `onChange` for each key. */
export const Typing: Story = {
  args: { type: "text", placeholder: undefined, "aria-label": "Name" },
  play: async ({ args, canvas }) => {
    const input = canvas.getByLabelText("Name")
    await userEvent.type(input, "Piraya")
    await expect(input).toHaveValue("Piraya")
    await expect(args.onChange).toHaveBeenCalledTimes(6)
  },
}

/** A disabled Input skips the tab order and ignores typing. */
export const Disabled: Story = {
  args: { disabled: true, defaultValue: "piraya@example.com" },
  play: async ({ args, canvas }) => {
    const input = canvas.getByLabelText("Email")
    await expect(input).toBeDisabled()
    await userEvent.type(input, "x", { pointerEventsCheck: 0 })
    await expect(input).toHaveValue("piraya@example.com")
    await expect(args.onChange).not.toHaveBeenCalled()
  },
}
