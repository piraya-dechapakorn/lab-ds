import type { Meta, StoryObj } from "@storybook/react-vite"
import { Plus } from "lucide-react"
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@piraya.d/ai_designsystem_lab"
import type { AvatarSize } from "@piraya.d/ai_designsystem_lab"
import { expect, waitFor } from "storybook/test"

const SIZES: AvatarSize[] = ["sm", "default", "lg"]

/** A self-contained portrait (inline SVG), so stories need no network. */
function portrait(from: string, to: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>
<rect width="96" height="96" fill="url(#g)"/>
<circle cx="48" cy="38" r="17" fill="#fff" fill-opacity=".85"/>
<path d="M14 96c4-22 18-32 34-32s30 10 34 32z" fill="#fff" fill-opacity=".85"/>
</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

const PEOPLE = [
  {
    name: "Piraya Dechapakorn",
    initials: "PD",
    src: portrait("#f97316", "#be123c"),
  },
  {
    name: "Somchai Kaewdee",
    initials: "SK",
    src: portrait("#0ea5e9", "#4338ca"),
  },
  { name: "Anong Srisuk", initials: "AS", src: portrait("#84cc16", "#047857") },
  {
    name: "Mali Thongdee",
    initials: "MT",
    src: portrait("#a855f7", "#db2777"),
  },
]

/** An image URL that never loads, to show the fallback. */
const BROKEN_SRC = "data:image/png;base64,broken"

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  args: { size: "default" },
  // Props are declared by hand: stories import the built package, which
  // docgen cannot read. These are the Avatar (root) props.
  argTypes: {
    size: {
      control: "select",
      options: SIZES,
      description: "`sm` 24px, `default` 32px, `lg` 40px.",
      table: { defaultValue: { summary: "default" } },
    },
    className: { control: "text" },
    children: { control: false },
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

/** Use the Controls panel to try each size. */
export const Playground: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src={PEOPLE[0].src} alt={PEOPLE[0].name} />
      <AvatarFallback>{PEOPLE[0].initials}</AvatarFallback>
    </Avatar>
  ),
  play: async ({ canvas }) => {
    await expect(
      await canvas.findByRole("img", { name: PEOPLE[0].name })
    ).toBeVisible()
  },
}

/** The three sizes, with an image and with initials. */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        {SIZES.map((size) => (
          <Avatar key={size} size={size}>
            <AvatarImage src={PEOPLE[1].src} alt={PEOPLE[1].name} />
            <AvatarFallback>{PEOPLE[1].initials}</AvatarFallback>
          </Avatar>
        ))}
      </div>
      <div className="flex items-center gap-3">
        {SIZES.map((size) => (
          <Avatar key={size} size={size}>
            <AvatarFallback>{PEOPLE[1].initials}</AvatarFallback>
          </Avatar>
        ))}
      </div>
    </div>
  ),
}

/** When the image fails to load, the initials show instead. */
export const Fallback: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src={BROKEN_SRC} alt={PEOPLE[2].name} />
      <AvatarFallback>{PEOPLE[2].initials}</AvatarFallback>
    </Avatar>
  ),
  play: async ({ canvas }) => {
    await waitFor(() =>
      expect(canvas.getByText(PEOPLE[2].initials)).toBeVisible()
    )
    await expect(canvas.queryByRole("img")).toBeNull()
  },
}

/** AvatarBadge: a dot in the corner. Its meaning must also be in text, here a visually hidden label. */
export const WithBadge: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      {SIZES.map((size) => (
        <Avatar key={size} size={size}>
          <AvatarImage src={PEOPLE[0].src} alt={PEOPLE[0].name} />
          <AvatarFallback>{PEOPLE[0].initials}</AvatarFallback>
          <AvatarBadge className="bg-green-600">
            <span className="sr-only">Online</span>
          </AvatarBadge>
        </Avatar>
      ))}
      <Avatar size="lg">
        <AvatarImage src={PEOPLE[3].src} alt={PEOPLE[3].name} />
        <AvatarFallback>{PEOPLE[3].initials}</AvatarFallback>
        <AvatarBadge>
          <Plus aria-hidden="true" />
          <span className="sr-only">Add a status</span>
        </AvatarBadge>
      </Avatar>
    </div>
  ),
}

/** An overlapping stack, with a count for the people not shown. */
export const Group: Story = {
  render: (args) => (
    <AvatarGroup role="group" aria-label="Project members: 7 people">
      {PEOPLE.map((p) => (
        <Avatar key={p.name} {...args}>
          <AvatarImage src={p.src} alt={p.name} />
          <AvatarFallback>{p.initials}</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount>
        +3<span className="sr-only"> more people</span>
      </AvatarGroupCount>
    </AvatarGroup>
  ),
  play: async ({ canvas }) => {
    await expect(await canvas.findAllByRole("img")).toHaveLength(4)
    await expect(canvas.getByText("+3")).toHaveTextContent("+3 more people")
  },
}

/** The group follows the size of the avatars in it, including the count. */
export const GroupSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {SIZES.map((size) => (
        <AvatarGroup key={size}>
          {PEOPLE.slice(0, 3).map((p) => (
            <Avatar key={p.name} size={size}>
              <AvatarImage src={p.src} alt={p.name} />
              <AvatarFallback>{p.initials}</AvatarFallback>
            </Avatar>
          ))}
          <AvatarGroupCount>+2</AvatarGroupCount>
        </AvatarGroup>
      ))}
    </div>
  ),
}

/** Next to a name, the image is decorative: `alt=""` stops screen readers reading the name twice. */
export const WithName: Story = {
  render: () => (
    <div className="flex items-center gap-3 text-sm">
      <Avatar size="lg">
        <AvatarImage src={PEOPLE[0].src} alt="" />
        <AvatarFallback aria-hidden="true">{PEOPLE[0].initials}</AvatarFallback>
      </Avatar>
      <div className="grid">
        <span className="font-medium">{PEOPLE[0].name}</span>
        <span className="text-muted-foreground">Designer</span>
      </div>
    </div>
  ),
}
