import type { Meta, StoryObj } from "@storybook/react-vite"
import { ProductCardTitle } from "lab-ds"

import { LONG_TITLE, products } from "./fixtures"

const meta = {
  title: "Components/ProductCard/ProductCardTitle",
  component: ProductCardTitle,
  parameters: {
    docs: {
      description: {
        component:
          "Product name (`<h3>`) in `--font-heading`. Clamped to two lines.",
      },
    },
  },
  decorators: [(Story) => <div className="w-56">{Story()}</div>],
  args: { children: products.sneaker.title },
  argTypes: {
    children: { control: "text" },
    className: { control: "text" },
  },
} satisfies Meta<typeof ProductCardTitle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Clamped: Story = {
  args: { children: LONG_TITLE },
}
