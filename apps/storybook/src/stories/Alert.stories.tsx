import type { Meta, StoryObj } from "@storybook/react-vite"
import { CircleAlert, Info } from "lucide-react"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
  Button,
} from "lab-ds"
import type { AlertVariant } from "lab-ds"
import { expect, fn, userEvent } from "storybook/test"

const VARIANTS: AlertVariant[] = ["default", "destructive"]
const onDismiss = fn()

const meta = {
  title: "Components/Alert",
  component: Alert,
  parameters: { layout: "padded" },
  args: { variant: "default" },
  // Props are declared by hand: stories import the built package, which
  // docgen cannot read.
  argTypes: {
    variant: {
      control: "select",
      options: VARIANTS,
      description: "Visual treatment. Use `destructive` for errors.",
      table: { defaultValue: { summary: "default" } },
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
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

/** Use the Controls panel to try each prop. */
export const Playground: Story = {
  render: (args) => (
    <Alert {...args}>
      <Info />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the CLI.
      </AlertDescription>
    </Alert>
  ),
}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Alert {...args} variant="default">
        <Info />
        <AlertTitle>Your plan renews on 1 December</AlertTitle>
        <AlertDescription>
          We will charge the card on file. You can change plans at any time.
        </AlertDescription>
      </Alert>
      <Alert {...args} variant="destructive">
        <CircleAlert />
        <AlertTitle>Unable to process your payment</AlertTitle>
        <AlertDescription>
          Check your card details and try again.
        </AlertDescription>
      </Alert>
    </div>
  ),
}

/** Every part is optional: title only, description only, and no icon. */
export const Anatomy: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Alert {...args}>
        <Info />
        <AlertTitle>Title only, with icon</AlertTitle>
      </Alert>
      <Alert {...args}>
        <AlertTitle>Title and description, no icon</AlertTitle>
        <AlertDescription>The text starts at the left edge.</AlertDescription>
      </Alert>
      <Alert {...args}>
        <AlertDescription>
          <p>Description only, with two paragraphs.</p>
          <p>
            Links are underlined: <a href="#alert-anatomy">read the guide</a>.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  ),
}

/** `AlertAction` pins one control to the top-right corner; the text leaves room for it. */
export const WithAction: Story = {
  render: (args) => (
    <Alert {...args}>
      <Info />
      <AlertTitle>A new version is available</AlertTitle>
      <AlertDescription>
        Reload the page to get the latest features and fixes.
      </AlertDescription>
      <AlertAction>
        <Button size="xs" variant="outline" onClick={onDismiss}>
          Dismiss
        </Button>
      </AlertAction>
    </Alert>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Dismiss" }))
    await expect(onDismiss).toHaveBeenCalledOnce()
  },
}

/** Every Alert has `role="alert"`, so screen readers announce it when it appears. */
export const Announced: Story = {
  args: { variant: "destructive" },
  render: (args) => (
    <Alert {...args}>
      <CircleAlert />
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription>Your changes were not saved.</AlertDescription>
    </Alert>
  ),
  play: async ({ canvas }) => {
    const alert = canvas.getByRole("alert")
    await expect(alert).toHaveAttribute("data-variant", "destructive")
    await expect(alert).toHaveTextContent("Something went wrong")
  },
}
