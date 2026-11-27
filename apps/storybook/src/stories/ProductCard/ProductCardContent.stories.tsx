import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  ProductCardBrand,
  ProductCardContent,
  ProductCardPrice,
  ProductCardTitle,
} from "lab-ds"

import { products } from "./fixtures"

const meta = {
  title: "Components/ProductCard/ProductCardContent",
  component: ProductCardContent,
  parameters: {
    docs: {
      description: {
        component:
          "Padded grid below the media that stacks brand, title and price. Shown here inside a bordered box to make its padding visible.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-64 rounded-xl border border-dashed">{Story()}</div>
    ),
  ],
  argTypes: {
    children: { control: false },
    className: { control: "text" },
  },
} satisfies Meta<typeof ProductCardContent>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <>
        <ProductCardBrand>{products.mug.brand}</ProductCardBrand>
        <ProductCardTitle>{products.mug.title}</ProductCardTitle>
        <ProductCardPrice amount={products.mug.amount} />
      </>
    ),
  },
}

export const TitleOnly: Story = {
  args: { children: <ProductCardTitle>{products.mug.title}</ProductCardTitle> },
}
