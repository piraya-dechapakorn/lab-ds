import type { Meta, StoryObj } from "@storybook/react-vite"
import { ArrowRight, Mail, Plus, Trash2 } from "lucide-react"
import { Button, buttonStyles } from "lab-ds"
import type { ButtonSize, ButtonVariant } from "lab-ds"
import { expect, fn, userEvent } from "storybook/test"

const VARIANTS: ButtonVariant[] = [
  "default",
  "outline",
  "secondary",
  "ghost",
  "destructive",
  "link",
]
const TEXT_SIZES: ButtonSize[] = ["xs", "sm", "default", "lg"]
const ICON_SIZES: ButtonSize[] = ["icon-xs", "icon-sm", "icon", "icon-lg"]

const meta = {
  title: "Components/Button",
  component: Button,
  args: {
    children: "Button",
    variant: "default",
    size: "default",
    disabled: false,
    onClick: fn(),
  },
  // Props are declared by hand: stories import the built package, which
  // docgen cannot read.
  argTypes: {
    variant: {
      control: "select",
      options: VARIANTS,
      description: "Visual treatment.",
      table: { defaultValue: { summary: "default" } },
    },
    size: {
      control: "select",
      options: [...TEXT_SIZES, ...ICON_SIZES],
      description: "Height / padding scale. `icon-*` sizes are square.",
      table: { defaultValue: { summary: "default" } },
    },
    disabled: { control: "boolean" },
    focusableWhenDisabled: {
      control: "boolean",
      description: "Base UI: keep the button in the tab order while disabled.",
    },
    "aria-invalid": { control: "boolean", name: "aria-invalid" },
    "aria-expanded": { control: "boolean", name: "aria-expanded" },
    children: { control: "text" },
    className: { control: "text" },
    render: { control: false },
    nativeButton: { control: false },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/** Use the Controls panel to try each prop. */
export const Playground: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {VARIANTS.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        {TEXT_SIZES.map((size) => (
          <Button key={size} {...args} size={size}>
            {size}
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        {ICON_SIZES.map((size) => (
          <Button key={size} {...args} size={size} aria-label={`Add (${size})`}>
            <Plus />
          </Button>
        ))}
      </div>
    </div>
  ),
}

/** `data-icon="inline-start|inline-end"` on the icon tightens the padding on that side. */
export const WithIcon: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args}>
        <Mail data-icon="inline-start" />
        Login with email
      </Button>
      <Button {...args} variant="outline">
        Continue
        <ArrowRight data-icon="inline-end" />
      </Button>
      <Button {...args} variant="destructive">
        <Trash2 data-icon="inline-start" />
        Delete
      </Button>
    </div>
  ),
}

/** Every variant in each state it styles: rest, `aria-expanded`, `aria-invalid`, disabled. */
export const States: Story = {
  parameters: { layout: "padded" },
  render: (args) => {
    const states = [
      { label: "rest", props: {} },
      { label: "aria-expanded", props: { "aria-expanded": true } },
      { label: "aria-invalid", props: { "aria-invalid": true } },
      { label: "disabled", props: { disabled: true } },
    ]
    return (
      <table className="border-separate border-spacing-3 text-sm">
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
          {VARIANTS.map((variant) => (
            <tr key={variant}>
              <th className="pr-2 text-left font-mono font-normal text-muted-foreground">
                {variant}
              </th>
              {states.map((s) => (
                <td key={s.label}>
                  <Button {...args} variant={variant} {...s.props}>
                    Button
                  </Button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole("button")
    await expect(button).toBeDisabled()
    await userEvent.click(button, { pointerEventsCheck: 0 })
    await expect(args.onClick).not.toHaveBeenCalled()
  },
}

/** Base UI keeps it focusable (for tooltips, etc.) but still blocks clicks. */
export const FocusableWhenDisabled: Story = {
  args: { disabled: true, focusableWhenDisabled: true },
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole("button")
    await userEvent.tab()
    await expect(button).toHaveFocus()
    await expect(button).toHaveAttribute("aria-disabled", "true")
    await userEvent.click(button, { pointerEventsCheck: 0 })
    await expect(args.onClick).not.toHaveBeenCalled()
  },
}

export const Clickable: Story = {
  play: async ({ args, canvas }) => {
    const button = canvas.getByRole("button", { name: "Button" })
    await expect(button).toHaveAttribute("data-variant", "default")
    await expect(button).toHaveAttribute("data-size", "default")
    await userEvent.click(button)
    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}

/** Base UI `render` swaps the element; set `nativeButton={false}` for non-buttons. */
export const AsLink: Story = {
  args: {
    nativeButton: false,
    render: <a href="#as-link" />,
    children: "I'm a link",
    variant: "outline",
  },
}

/** `buttonStyles()` is server-safe: it styles any element, e.g. a framework `<Link>`. */
export const ButtonStylesHelper: Story = {
  name: "buttonStyles()",
  render: () => (
    <a
      href="#button-styles"
      {...buttonStyles({ variant: "secondary", size: "lg" })}
    >
      Styled anchor
    </a>
  ),
}
