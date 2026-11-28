import type { Meta, StoryObj } from "@storybook/react-vite"
import { Input, Label } from "@piraya.d/ai_designsystem_lab"
import { expect, userEvent } from "storybook/test"

const meta = {
  title: "Components/Label",
  component: Label,
  args: { children: "Email" },
  // Props are declared by hand: stories import the built package, which
  // docgen cannot read. Label takes every native <label> attribute.
  argTypes: {
    htmlFor: {
      control: "text",
      description: "The `id` of the control this label names.",
    },
    children: { control: "text" },
    className: { control: "text" },
  },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

/** Use the Controls panel to try each prop. */
export const Playground: Story = {}

/** `htmlFor` matches the control's `id`, so clicking the label focuses the Input. */
export const WithInput: Story = {
  render: () => (
    <div className="grid w-64 gap-2">
      <Label htmlFor="label-email">Email</Label>
      <Input id="label-email" type="email" />
    </div>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByText("Email"))
    await expect(canvas.getByLabelText("Email")).toHaveFocus()
  },
}

/** A label that wraps a checkbox names it without `htmlFor`. Label lays out its children in a row. */
export const WrappingCheckbox: Story = {
  render: () => (
    <Label>
      <input type="checkbox" className="size-4" />
      Remember me
    </Label>
  ),
  play: async ({ canvas }) => {
    const checkbox = canvas.getByRole("checkbox", { name: "Remember me" })
    await userEvent.click(canvas.getByText("Remember me"))
    await expect(checkbox).toBeChecked()
  },
}

/**
 * Two ways the label fades with a disabled control: a preceding control with
 * the `peer` class, or a parent with the `group` class and `data-disabled`.
 */
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <input
          id="label-peer"
          type="checkbox"
          className="peer size-4"
          disabled
        />
        <Label htmlFor="label-peer">Disabled with peer</Label>
      </div>
      <div className="group grid w-64 gap-2" data-disabled="true">
        <Label htmlFor="label-group">Disabled with group</Label>
        <Input id="label-group" disabled />
      </div>
    </div>
  ),
}
