import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Textarea,
} from "@piraya.d/ai_designsystem_lab"
import { expect, fn, userEvent } from "storybook/test"

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  parameters: { layout: "padded" },
  args: {
    placeholder: "Tell us what happened",
    disabled: false,
    "aria-invalid": false,
    "aria-label": "Message",
    onChange: fn(),
  },
  // Props are declared by hand: stories import the built package, which
  // docgen cannot read. Textarea takes every native <textarea> attribute.
  argTypes: {
    placeholder: { control: "text" },
    rows: {
      control: "number",
      description:
        "Has no effect on height: the Textarea sizes itself to its content (64px minimum).",
    },
    maxLength: { control: "number" },
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
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

/** Use the Controls panel to try each prop. */
export const Playground: Story = {}

/** A Textarea inside a Field, with a visible label and a hint. */
export const WithLabel: Story = {
  render: () => (
    <Field>
      <FieldLabel htmlFor="textarea-feedback">Feedback</FieldLabel>
      <Textarea
        id="textarea-feedback"
        aria-describedby="textarea-feedback-hint"
      />
      <FieldDescription id="textarea-feedback-hint">
        Tell us what worked and what didn’t.
      </FieldDescription>
    </Field>
  ),
  play: async ({ canvas }) => {
    const textarea = canvas.getByLabelText("Feedback")
    await expect(textarea).toHaveAccessibleDescription(
      "Tell us what worked and what didn’t."
    )
  },
}

/** Every state the CSS styles: rest, placeholder, filled, `aria-invalid`, disabled. */
export const States: Story = {
  render: () => {
    const states = [
      { label: "rest", props: {} },
      { label: "placeholder", props: { placeholder: "Tell us what happened" } },
      { label: "filled", props: { defaultValue: "The checkout page froze." } },
      { label: "aria-invalid", props: { "aria-invalid": true } },
      {
        label: "disabled",
        props: { defaultValue: "The checkout page froze.", disabled: true },
      },
    ]
    return (
      <div className="grid grid-cols-[8rem_1fr] items-start gap-3 text-sm">
        {states.map((s) => (
          <div key={s.label} className="contents">
            <span className="pt-3 font-mono text-muted-foreground">
              {s.label}
            </span>
            <Textarea aria-label={s.label} {...s.props} />
          </div>
        ))}
      </div>
    )
  },
}

/** An error: `aria-invalid` on the Textarea, and the message in a FieldError. */
export const Invalid: Story = {
  render: () => (
    <Field data-invalid>
      <FieldLabel htmlFor="textarea-invalid">Feedback</FieldLabel>
      <Textarea
        id="textarea-invalid"
        aria-invalid
        aria-describedby="textarea-invalid-error"
      />
      <FieldError id="textarea-invalid-error">Enter your feedback</FieldError>
    </Field>
  ),
  play: async ({ canvas }) => {
    const textarea = canvas.getByLabelText("Feedback")
    await expect(textarea).toBeInvalid()
    await expect(textarea).toHaveAccessibleDescription("Enter your feedback")
  },
}

/** The box grows with each new line, so there is no inner scrollbar or resize handle. */
export const GrowsWithContent: Story = {
  args: { placeholder: undefined },
  play: async ({ canvas }) => {
    const textarea = canvas.getByLabelText("Message")
    const before = textarea.getBoundingClientRect().height
    await userEvent.type(
      textarea,
      "Line 1{Enter}Line 2{Enter}Line 3{Enter}Line 4"
    )
    await expect(textarea.getBoundingClientRect().height).toBeGreaterThan(
      before
    )
  },
}

/** A disabled Textarea skips the tab order and ignores typing. */
export const Disabled: Story = {
  args: { disabled: true, defaultValue: "The checkout page froze." },
  play: async ({ args, canvas }) => {
    const textarea = canvas.getByLabelText("Message")
    await expect(textarea).toBeDisabled()
    await userEvent.type(textarea, "x", { pointerEventsCheck: 0 })
    await expect(textarea).toHaveValue("The checkout page froze.")
    await expect(args.onChange).not.toHaveBeenCalled()
  },
}
