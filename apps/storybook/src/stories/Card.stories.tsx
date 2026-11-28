import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Field,
  FieldLabel,
  Input,
} from "@piraya.d/ai_designsystem_lab"
import type { CardSize } from "@piraya.d/ai_designsystem_lab"
import { expect, within } from "storybook/test"

const SIZES: CardSize[] = ["default", "sm"]

/** Self-contained cover image (inline SVG), so stories need no network. */
const COVER = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="320" viewBox="0 0 640 320">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#84cc16"/><stop offset="1" stop-color="#0e7490"/></linearGradient></defs>
<rect width="640" height="320" fill="url(#g)"/>
<circle cx="320" cy="160" r="90" fill="#fff" fill-opacity=".3"/>
</svg>`
)}`

const meta = {
  title: "Components/Card",
  component: Card,
  args: { size: "default" },
  // Props are declared by hand: stories import the built package, which
  // docgen cannot read. These are the Card (root) props.
  argTypes: {
    size: {
      control: "select",
      options: SIZES,
      description:
        "Spacing scale for padding and gaps: 24px (`default`) or 16px (`sm`).",
      table: { defaultValue: { summary: "default" } },
    },
    className: { control: "text" },
    children: { control: false },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

/** Use the Controls panel to try each prop. */
export const Playground: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Choose what we email you about.</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>You get a weekly summary and alerts for new sign-ins.</p>
      </CardContent>
      <CardFooter>
        <Button>Save</Button>
      </CardFooter>
    </Card>
  ),
}

/** The minimal structure. Quoted in `card.md` (Import and use). */
export const Basic: Story = {
  render: () => (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Choose what we email you about.</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm">Edit</Button>
        </CardAction>
      </CardHeader>
      <CardContent>{/* Body */}</CardContent>
      <CardFooter>
        <Button>Save</Button>
      </CardFooter>
    </Card>
  ),
}

/** `default` and `sm` side by side: only the spacing changes. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-start gap-6">
      {SIZES.map((size) => (
        <Card key={size} {...args} size={size} className="w-64">
          <CardHeader>
            <CardTitle>size="{size}"</CardTitle>
            <CardDescription>Padding and gaps follow the size.</CardDescription>
          </CardHeader>
          <CardContent>Body text</CardContent>
          <CardFooter>
            <Button variant="outline" size="sm">
              Action
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  ),
}

/**
 * Each content-driven layout the module CSS styles: an action in the header,
 * a cover image flush with the top edge, and `border-b` / `border-t` dividers.
 */
export const States: Story = {
  parameters: { layout: "padded" },
  render: (args) => (
    <div className="grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
      <Card {...args}>
        <CardHeader>
          <CardTitle>Title only</CardTitle>
        </CardHeader>
        <CardContent>No description, no action.</CardContent>
      </Card>
      <Card {...args}>
        <CardHeader>
          <CardTitle>With action</CardTitle>
          <CardDescription>The action spans both rows.</CardDescription>
          <CardAction>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>Body text</CardContent>
      </Card>
      <Card {...args}>
        <img src={COVER} alt="" className="aspect-2/1 w-full object-cover" />
        <CardHeader>
          <CardTitle>Image first</CardTitle>
          <CardDescription>No top padding above the image.</CardDescription>
        </CardHeader>
        <CardContent>Body text</CardContent>
      </Card>
      <Card {...args}>
        <CardHeader className="border-b">
          <CardTitle>Dividers</CardTitle>
          <CardDescription>`border-b` on the header.</CardDescription>
        </CardHeader>
        <CardContent>Body text</CardContent>
        <CardFooter className="border-t">
          <Button size="sm">Save</Button>
        </CardFooter>
      </Card>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const action = canvas.getByRole("button", { name: "Edit" })
    // The action sits in the header's second column.
    const header = action.closest('[data-slot="card-header"]') as HTMLElement
    await expect(getComputedStyle(header).gridTemplateColumns.split(" ")).toHaveLength(2)
    // An image as first child removes the card's top padding.
    const imageCard = canvasElement.querySelector("img")!.parentElement!
    await expect(getComputedStyle(imageCard).paddingTop).toBe("0px")
  },
}

/** The `sm` size sets 16px spacing; `default` sets 24px. */
export const SpacingScale: Story = {
  render: (args) => (
    <div className="flex gap-6">
      <Card {...args} size="default" aria-label="default card">
        <CardContent>default</CardContent>
      </Card>
      <Card {...args} size="sm" aria-label="small card">
        <CardContent>sm</CardContent>
      </Card>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [large, small] = canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="card"]'
    )
    await expect(large).toHaveAttribute("data-size", "default")
    await expect(small).toHaveAttribute("data-size", "sm")
    await expect(getComputedStyle(large).paddingTop).toBe("24px")
    await expect(getComputedStyle(small).paddingTop).toBe("16px")
  },
}

/** A sign-in form in a card. Quoted in `card.md`. */
export const SignIn: Story = {
  render: () => (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Use the email you signed up with.</CardDescription>
        <CardAction>
          <Button variant="link" size="sm">Sign up</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Field>
          <FieldLabel htmlFor="card-email">Email</FieldLabel>
          <Input id="card-email" type="email" placeholder="you@example.com" />
        </Field>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Sign in</Button>
      </CardFooter>
    </Card>
  ),
}
