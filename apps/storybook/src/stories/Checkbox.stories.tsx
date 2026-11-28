import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Checkbox, Field, FieldGroup, FieldLabel } from "@piraya.d/ai_designsystem_lab"
import { expect, fn, userEvent, within } from "storybook/test"

const OPTIONS = [
  { value: "email", label: "Email" },
  { value: "sms", label: "Text message" },
  { value: "push", label: "Push notification" },
]

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  args: {
    defaultChecked: false,
    indeterminate: false,
    disabled: false,
    readOnly: false,
    required: false,
    onCheckedChange: fn(),
  },
  // Props are declared by hand: stories import the built package, which
  // docgen cannot read.
  argTypes: {
    checked: {
      control: "boolean",
      description: "Controlled checked state.",
    },
    defaultChecked: {
      control: "boolean",
      description: "Checked state on first render.",
      table: { defaultValue: { summary: "false" } },
    },
    indeterminate: {
      control: "boolean",
      description:
        "Shows the minus icon, e.g. for a select-all box when only some items are checked.",
      table: { defaultValue: { summary: "false" } },
    },
    disabled: { control: "boolean" },
    readOnly: {
      control: "boolean",
      description: "Keeps the value but blocks changes.",
    },
    required: { control: "boolean" },
    "aria-invalid": { control: "boolean", name: "aria-invalid" },
    name: { control: "text" },
    value: { control: "text" },
    className: { control: "text" },
    onCheckedChange: { control: false },
    render: { control: false },
    nativeButton: { control: false },
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

/** Use the Controls panel to try each prop. */
export const Playground: Story = {
  render: (args) => (
    <Field orientation="horizontal">
      <Checkbox {...args} id="playground" />
      <FieldLabel htmlFor="playground">Remember me</FieldLabel>
    </Field>
  ),
}

/** A checkbox paired with its label. Quoted in `checkbox.md`. */
export const WithLabel: Story = {
  render: () => (
    <Field orientation="horizontal">
      <Checkbox id="terms" />
      <FieldLabel htmlFor="terms">Accept terms and conditions</FieldLabel>
    </Field>
  ),
  play: async ({ canvas }) => {
    const box = canvas.getByRole("checkbox", {
      name: "Accept terms and conditions",
    })
    await expect(box).not.toBeChecked()
    // Clicking the label ticks the box.
    await userEvent.click(canvas.getByText("Accept terms and conditions"))
    await expect(box).toBeChecked()
    await expect(box).toHaveAttribute("data-checked")
  },
}

/** Each value in each state the module CSS styles. */
export const States: Story = {
  parameters: { layout: "padded" },
  render: (args) => {
    const values = [
      { label: "unchecked", props: { checked: false } },
      { label: "checked", props: { checked: true } },
      { label: "indeterminate", props: { indeterminate: true } },
    ]
    const states = [
      { label: "rest", props: {} },
      { label: "aria-invalid", props: { "aria-invalid": true } },
      { label: "disabled", props: { disabled: true } },
    ]
    return (
      <table className="border-separate border-spacing-4 text-sm">
        <thead>
          <tr>
            <th />
            {states.map((s) => (
              <th
                key={s.label}
                className="text-left font-mono font-normal text-muted-foreground"
              >
                {s.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {values.map((v) => (
            <tr key={v.label}>
              <th className="pr-2 text-left font-mono font-normal text-muted-foreground">
                {v.label}
              </th>
              {states.map((s) => (
                <td key={s.label}>
                  <Checkbox
                    {...args}
                    {...v.props}
                    {...s.props}
                    aria-label={`${v.label}, ${s.label}`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )
  },
}

export const Toggle: Story = {
  play: async ({ args, canvas }) => {
    const box = canvas.getByRole("checkbox")
    await userEvent.click(box)
    await expect(box).toBeChecked()
    await expect(args.onCheckedChange).toHaveBeenCalledWith(
      true,
      expect.anything()
    )
    // Space toggles it back from the keyboard.
    await userEvent.keyboard(" ")
    await expect(box).not.toBeChecked()
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ args, canvas }) => {
    const box = canvas.getByRole("checkbox")
    await expect(box).toHaveAttribute("data-disabled")
    await userEvent.click(box, { pointerEventsCheck: 0 })
    await expect(box).not.toBeChecked()
    await expect(args.onCheckedChange).not.toHaveBeenCalled()
  },
}

/** Indeterminate shows the minus icon instead of the check. */
export const Indeterminate: Story = {
  args: { indeterminate: true },
  play: async ({ canvasElement }) => {
    const box = within(canvasElement).getByRole("checkbox")
    await expect(box).toHaveAttribute("aria-checked", "mixed")
    const [check, minus] = box.querySelectorAll("svg")
    await expect(getComputedStyle(check).display).toBe("none")
    await expect(getComputedStyle(minus).display).not.toBe("none")
  },
}

function SelectAll() {
  const [checked, setChecked] = React.useState<string[]>(["email"])
  const all = OPTIONS.every((o) => checked.includes(o.value))
  const some = checked.length > 0 && !all

  return (
    <FieldGroup>
      <Field orientation="horizontal">
        <Checkbox
          id="all"
          checked={all}
          indeterminate={some}
          onCheckedChange={(on) => setChecked(on ? OPTIONS.map((o) => o.value) : [])}
        />
        <FieldLabel htmlFor="all">All notifications</FieldLabel>
      </Field>
      {OPTIONS.map((o) => (
        <Field key={o.value} orientation="horizontal">
          <Checkbox
            id={o.value}
            checked={checked.includes(o.value)}
            onCheckedChange={(on) =>
              setChecked((prev) =>
                on ? [...prev, o.value] : prev.filter((v) => v !== o.value)
              )
            }
          />
          <FieldLabel htmlFor={o.value}>{o.label}</FieldLabel>
        </Field>
      ))}
    </FieldGroup>
  )
}

/** A select-all box that goes indeterminate. Quoted in `checkbox.md`. */
export const SelectAllStory: Story = {
  name: "Select all",
  render: () => <SelectAll />,
  play: async ({ canvas }) => {
    const all = canvas.getByRole("checkbox", { name: "All notifications" })
    await expect(all).toHaveAttribute("aria-checked", "mixed")
    await userEvent.click(all)
    for (const o of OPTIONS) {
      await expect(canvas.getByRole("checkbox", { name: o.label })).toBeChecked()
    }
    await expect(all).toBeChecked()
    await userEvent.click(all)
    await expect(canvas.getByRole("checkbox", { name: "Email" })).not.toBeChecked()
  },
}
