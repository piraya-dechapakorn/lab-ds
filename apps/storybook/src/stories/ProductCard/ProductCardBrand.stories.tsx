import type { Meta, StoryObj } from "@storybook/react-vite"
import { ProductCardBrand } from "@piraya.d/ai_designsystem_lab"

const meta = {
  title: "Components/ProductCard/ProductCardBrand",
  component: ProductCardBrand,
  parameters: {
    docs: {
      description: {
        component:
          "Small uppercase, letter-spaced label above the title (`<p>`).",
      },
    },
  },
  args: { children: "Northwind" },
  argTypes: {
    children: { control: "text" },
    className: { control: "text" },
  },
} satisfies Meta<typeof ProductCardBrand>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Thai: Story = {
  args: { children: "แบรนด์ไทย" },
}
