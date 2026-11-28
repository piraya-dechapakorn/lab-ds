import type { Meta, StoryObj } from "@storybook/react-vite"
import { Separator } from "@piraya.d/ai_designsystem_lab"
import { expect } from "storybook/test"

const meta = {
  title: "Components/Separator",
  component: Separator,
  args: { orientation: "horizontal" },
  // Props are declared by hand: stories import the built package, which
  // docgen cannot read.
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description:
        "`horizontal` is a full-width line, `vertical` a full-height line.",
      table: { defaultValue: { summary: "horizontal" } },
    },
    className: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div className="flex h-24 w-64 items-center justify-center">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

/** Use the Controls panel to switch the orientation. */
export const Playground: Story = {}

/** A horizontal line between two sections of text. */
export const Horizontal: Story = {
  render: (args) => (
    <div className="grid w-full gap-3 text-sm">
      <div>
        <p className="font-medium">lab-ds</p>
        <p className="text-muted-foreground">An open-source design system.</p>
      </div>
      <Separator {...args} />
      <p className="text-muted-foreground">
        Built on Base UI and Tailwind CSS.
      </p>
    </div>
  ),
  play: async ({ canvas }) => {
    const separator = canvas.getByRole("separator")
    await expect(separator).toHaveAttribute("aria-orientation", "horizontal")
  },
}

/**
 * Vertical lines between inline links. These lines are only visual, so
 * `aria-hidden` stops screen readers announcing "separator" between links.
 * The row needs a height for the line to show.
 */
export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <div className="flex h-5 items-center gap-3 text-sm">
      <a href="#blog">Blog</a>
      <Separator {...args} aria-hidden />
      <a href="#docs">Docs</a>
      <Separator {...args} aria-hidden />
      <a href="#source">Source</a>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.queryAllByRole("separator")).toHaveLength(0)
    const separators = canvas.getAllByRole("separator", { hidden: true })
    await expect(separators).toHaveLength(2)
    await expect(separators[0]).toHaveAttribute("aria-orientation", "vertical")
  },
}
