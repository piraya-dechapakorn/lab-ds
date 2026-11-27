import type { Meta, StoryObj } from "@storybook/react-vite"
import { ArrowUpRight, BadgeCheck, CircleAlert } from "lucide-react"
import { Badge, badgeStyles } from "lab-ds"
import type { BadgeVariant } from "lab-ds"
import { expect, userEvent } from "storybook/test"

const VARIANTS: BadgeVariant[] = [
  "default",
  "secondary",
  "destructive",
  "outline",
  "ghost",
  "link",
]

const meta = {
  title: "Components/Badge",
  component: Badge,
  args: { children: "Badge", variant: "default" },
  // Props are declared by hand: stories import the built package, which
  // docgen cannot read.
  argTypes: {
    variant: {
      control: "select",
      options: VARIANTS,
      description: "Visual treatment.",
      table: { defaultValue: { summary: "default" } },
    },
    "aria-invalid": {
      control: "boolean",
      name: "aria-invalid",
      description: "Red border, for a Badge that marks an error.",
    },
    children: { control: "text" },
    className: { control: "text" },
    render: {
      control: false,
      description: "Swaps the `<span>` for another element, such as a link.",
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

/** Use the Controls panel to try each prop. */
export const Playground: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {VARIANTS.map((variant) => (
        <Badge key={variant} {...args} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
}

/** `data-icon="inline-start|inline-end"` on the icon tightens the padding on that side. Icons are 12px. */
export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="secondary">
        <BadgeCheck data-icon="inline-start" />
        Verified
      </Badge>
      <Badge variant="destructive">
        <CircleAlert data-icon="inline-start" />
        Payment failed
      </Badge>
      <Badge variant="outline">
        Docs
        <ArrowUpRight data-icon="inline-end" />
      </Badge>
    </div>
  ),
}

/** Status labels on items in a list. The words carry the meaning, so the colour is only a hint. */
export const StatusInList: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <ul className="flex max-w-sm flex-col divide-y text-sm">
      {[
        { name: "Order #1042", status: "Shipped", variant: "secondary" },
        {
          name: "Order #1043",
          status: "Payment failed",
          variant: "destructive",
        },
        { name: "Order #1044", status: "Draft", variant: "outline" },
      ].map((o) => (
        <li key={o.name} className="flex items-center justify-between py-2">
          {o.name}
          <Badge variant={o.variant as BadgeVariant}>{o.status}</Badge>
        </li>
      ))}
    </ul>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Payment failed")).toHaveAttribute(
      "data-variant",
      "destructive"
    )
  },
}

/** `render` swaps the element. A Badge rendered as a link darkens on hover and can be focused. */
export const AsLink: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge render={<a href="#tag-shoes" />}>Shoes</Badge>
      <Badge variant="outline" render={<a href="#tag-sale" />}>
        Sale
      </Badge>
      <Badge variant="link" render={<a href="#tag-new" />}>
        New in
      </Badge>
    </div>
  ),
  play: async ({ canvas }) => {
    const link = canvas.getByRole("link", { name: "Shoes" })
    await expect(link).toHaveAttribute("data-slot", "badge")
    await userEvent.tab()
    await expect(link).toHaveFocus()
  },
}

/** Rest and `aria-invalid`. Tab to a linked Badge (see `AsLink`) to see the focus ring. */
export const States: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="grid grid-cols-[8rem_auto] items-center justify-start gap-3 text-sm">
      <span className="font-mono text-muted-foreground">rest</span>
      <Badge variant="outline">Badge</Badge>
      <span className="font-mono text-muted-foreground">aria-invalid</span>
      <Badge variant="outline" aria-invalid>
        Badge
      </Badge>
    </div>
  ),
}

/** `badgeStyles()` is server-safe: it styles any element, e.g. a framework `<Link>`. */
export const BadgeStylesHelper: Story = {
  name: "badgeStyles()",
  render: () => (
    <a href="#badge-styles" {...badgeStyles({ variant: "secondary" })}>
      Styled anchor
    </a>
  ),
  play: async ({ canvas }) => {
    const link = canvas.getByRole("link", { name: "Styled anchor" })
    await expect(link).toHaveAttribute("data-variant", "secondary")
  },
}
