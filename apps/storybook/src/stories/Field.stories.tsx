import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Button,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
  Input,
  Textarea,
} from "@piraya.d/ai_designsystem_lab"
import type { FieldOrientation } from "@piraya.d/ai_designsystem_lab"
import { expect, userEvent, within } from "storybook/test"

const ORIENTATIONS: FieldOrientation[] = [
  "vertical",
  "horizontal",
  "responsive",
]

const meta = {
  title: "Components/Field",
  component: Field,
  parameters: { layout: "padded" },
  args: { orientation: "vertical" },
  // Props are declared by hand: stories import the built package, which
  // docgen cannot read. These are the Field props.
  argTypes: {
    orientation: {
      control: "select",
      options: ORIENTATIONS,
      description:
        "Where the label sits. `responsive` stacks on narrow FieldGroups and goes side by side once the FieldGroup is 448px wide.",
      table: { defaultValue: { summary: "vertical" } },
    },
    className: { control: "text" },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

/** Use the Controls panel to try each prop. */
export const Playground: Story = {
  render: (args) => (
    <Field {...args}>
      <FieldLabel htmlFor="field-playground">Full name</FieldLabel>
      <Input id="field-playground" autoComplete="name" />
    </Field>
  ),
}

/** Label, control, hint and error in their usual order. */
export const Anatomy: Story = {
  render: () => (
    <Field data-invalid>
      <FieldLabel htmlFor="field-username">Username</FieldLabel>
      <Input
        id="field-username"
        defaultValue="pi"
        aria-invalid
        aria-describedby="field-username-hint field-username-error"
      />
      <FieldDescription id="field-username-hint">
        3 to 20 letters or numbers. Shown on your public profile.
      </FieldDescription>
      <FieldError id="field-username-error">
        Username must be at least 3 characters
      </FieldError>
    </Field>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByLabelText("Username")
    await expect(input).toBeInvalid()
    await expect(input).toHaveAccessibleDescription(
      "3 to 20 letters or numbers. Shown on your public profile. Username must be at least 3 characters"
    )
    await expect(canvas.getByRole("alert")).toHaveTextContent(
      "Username must be at least 3 characters"
    )
  },
}

/** The three orientations side by side. Resize the canvas to see `responsive` switch. */
export const Orientations: Story = {
  render: () => (
    <FieldGroup>
      {ORIENTATIONS.map((orientation) => (
        <Field key={orientation} orientation={orientation}>
          <FieldLabel htmlFor={`field-${orientation}`}>
            {orientation}
          </FieldLabel>
          <Input id={`field-${orientation}`} placeholder="Value" />
        </Field>
      ))}
    </FieldGroup>
  ),
}

/** A horizontal Field with FieldContent: a title and description beside a control. */
export const WithContent: Story = {
  render: () => (
    <Field orientation="horizontal">
      <FieldContent>
        <FieldLabel htmlFor="field-marketing">Marketing emails</FieldLabel>
        <FieldDescription>
          New products and offers, about once a month.
        </FieldDescription>
      </FieldContent>
      <input id="field-marketing" type="checkbox" className="size-4" />
    </Field>
  ),
}

/** A form section: FieldSet with a FieldLegend, and a FieldGroup that spaces the fields. */
export const FormSection: Story = {
  render: () => (
    <form onSubmit={(e) => e.preventDefault()}>
      <FieldSet>
        <FieldLegend>Shipping address</FieldLegend>
        <FieldDescription>We deliver Monday to Saturday.</FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="field-street">Street address</FieldLabel>
            <Input id="field-street" autoComplete="street-address" />
          </Field>
          <Field>
            <FieldLabel htmlFor="field-city">City</FieldLabel>
            <Input id="field-city" autoComplete="address-level2" />
          </Field>
          <Field>
            <FieldLabel htmlFor="field-notes">
              Delivery notes (optional)
            </FieldLabel>
            <Textarea id="field-notes" />
          </Field>
          <Field orientation="horizontal">
            <Button type="submit">Save address</Button>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  ),
  play: async ({ canvas }) => {
    const group = canvas.getByRole("group", { name: "Shipping address" })
    await expect(within(group).getByLabelText("City")).toBeInTheDocument()
  },
}

/** FieldLegend in its two variants: `legend` (section heading) and `label` (label-sized). */
export const LegendVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <FieldSet>
        <FieldLegend variant="legend">Legend variant</FieldLegend>
        <FieldDescription>Use it for a section heading.</FieldDescription>
      </FieldSet>
      <FieldSet>
        <FieldLegend variant="label">Label variant</FieldLegend>
        <FieldDescription>
          Use it for a group of choices that reads like one question.
        </FieldDescription>
      </FieldSet>
    </div>
  ),
}

/** FieldSeparator between two blocks, with and without text. */
export const Separator: Story = {
  render: () => (
    <FieldGroup>
      <Button variant="outline">Continue with Google</Button>
      <FieldSeparator>or</FieldSeparator>
      <Field>
        <FieldLabel htmlFor="field-sep-email">Email</FieldLabel>
        <Input id="field-sep-email" type="email" />
      </Field>
      <FieldSeparator />
      <Button>Sign in</Button>
    </FieldGroup>
  ),
}

/** FieldTitle: a label-styled heading for content that is not a form control. */
export const Title: Story = {
  render: () => (
    <Field>
      <FieldTitle>Plan</FieldTitle>
      <FieldDescription>
        Pro, billed yearly. Renews on 1 December.
      </FieldDescription>
    </Field>
  ),
}

/**
 * `errors` takes a list, such as the errors of a form library, and shows a
 * message once even if it appears twice. Two or more messages become a list.
 */
export const ErrorList: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <FieldError
        data-testid="one"
        errors={[
          { message: "Enter a password" },
          { message: "Enter a password" },
        ]}
      />
      <FieldError
        data-testid="many"
        errors={[
          { message: "Use at least 8 characters" },
          { message: "Include a number" },
          { message: "Use at least 8 characters" },
        ]}
      />
      <FieldError data-testid="none" errors={[]} />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId("one")).toHaveTextContent(
      /^Enter a password$/
    )
    const many = canvas.getByTestId("many")
    await expect(within(many).getAllByRole("listitem")).toHaveLength(2)
    await expect(canvas.queryByTestId("none")).toBeNull()
  },
}

/** Each state the CSS styles on Field: rest, `data-invalid` and `data-disabled`. */
export const States: Story = {
  render: () => (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="field-state-rest">Rest</FieldLabel>
        <Input id="field-state-rest" defaultValue="Piraya" />
        <FieldDescription>Hint text</FieldDescription>
      </Field>
      <Field data-invalid>
        <FieldLabel htmlFor="field-state-invalid">data-invalid</FieldLabel>
        <Input id="field-state-invalid" defaultValue="Piraya" aria-invalid />
        <FieldError>Error message</FieldError>
      </Field>
      <Field data-disabled>
        <FieldLabel htmlFor="field-state-disabled">data-disabled</FieldLabel>
        <Input id="field-state-disabled" defaultValue="Piraya" disabled />
        <FieldDescription>Hint text</FieldDescription>
      </Field>
    </FieldGroup>
  ),
}

/** Clicking the label focuses its control, because `htmlFor` matches the control's `id`. */
export const LabelFocusesControl: Story = {
  render: Playground.render,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByText("Full name"))
    await expect(canvas.getByLabelText("Full name")).toHaveFocus()
    await expect(canvas.getByRole("group")).toHaveAttribute(
      "data-orientation",
      "vertical"
    )
  },
}
