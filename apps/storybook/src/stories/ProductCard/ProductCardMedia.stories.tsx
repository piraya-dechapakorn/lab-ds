import type { Meta, StoryObj } from "@storybook/react-vite"
import { ProductCardMedia } from "@piraya.d/ai_designsystem_lab"
import { expect } from "storybook/test"

import { products } from "./fixtures"

const meta = {
  title: "Components/ProductCard/ProductCardMedia",
  component: ProductCardMedia,
  parameters: {
    docs: {
      description: {
        component:
          "Square image frame. Pass the image element as children (`<img>`, `next/image`…). With no children it shows a neutral placeholder icon.",
      },
    },
  },
  decorators: [(Story) => <div className="w-64">{Story()}</div>],
  argTypes: {
    children: { control: false },
    className: { control: "text" },
  },
} satisfies Meta<typeof ProductCardMedia>

export default meta
type Story = StoryObj<typeof meta>

export const WithImage: Story = {
  args: {
    children: <img src={products.sneaker.image} alt={products.sneaker.title} />,
  },
}

export const Placeholder: Story = {
  play: async ({ canvasElement }) => {
    const icon = canvasElement.querySelector("[data-placeholder]")
    await expect(icon).not.toBeNull()
    await expect(icon).toHaveAttribute("aria-hidden", "true")
  },
}

/** Non-square images are cropped to fill the frame (`object-cover`). */
export const WideImageCropped: Story = {
  args: {
    children: (
      <img
        src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400"><rect width="1200" height="400" fill="#6366f1"/><rect x="560" width="80" height="400" fill="#fff"/></svg>'
        )}`}
        alt="Wide banner"
      />
    ),
  },
}
