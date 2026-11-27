import type { Meta, StoryObj } from "@storybook/react-vite"
import { formatPrice, ProductCardPrice } from "lab-ds"
import { expect } from "storybook/test"

const meta = {
  title: "Components/ProductCard/ProductCardPrice",
  component: ProductCardPrice,
  parameters: {
    docs: {
      description: {
        component:
          "Formats `amount` with `formatPrice()`. When `compareAt` is higher than `amount`, it shows a sale: red price, struck-through original and a discount badge. The badge is positioned against the nearest positioned ancestor, which is the card (here, the dashed box).",
      },
    },
  },
  // Stand-in for the card, so the discount badge has something to sit on.
  decorators: [
    (Story) => (
      <div className="relative w-64 rounded-xl border border-dashed px-3 pt-14 pb-3">
        {Story()}
      </div>
    ),
  ],
  args: { amount: 1290, currency: "THB", locale: "th-TH" },
  argTypes: {
    amount: {
      control: { type: "number", step: 0.5 },
      description: "Current selling price.",
    },
    compareAt: {
      control: { type: "number", step: 0.5 },
      description:
        "Original price. When higher than `amount`, the price shows as a sale.",
    },
    currency: {
      control: "text",
      description: "ISO 4217 code.",
      table: { defaultValue: { summary: "THB" } },
    },
    locale: { control: "text", table: { defaultValue: { summary: "th-TH" } } },
    className: { control: "text" },
  },
} satisfies Meta<typeof ProductCardPrice>

export default meta
type Story = StoryObj<typeof meta>

export const Regular: Story = {
  play: async ({ canvasElement }) => {
    const price = canvasElement.querySelector(
      '[data-slot="product-card-price"]'
    )
    await expect(price).not.toHaveAttribute("data-sale")
    await expect(price).toHaveTextContent(formatPrice(1290))
  },
}

/** Fractional amounts keep two decimals. */
export const Decimals: Story = {
  args: { amount: 349.5 },
  play: async ({ canvasElement }) => {
    await expect(canvasElement).toHaveTextContent(formatPrice(349.5))
    await expect(formatPrice(349.5)).toMatch(/349\.50$/)
  },
}

export const OnSale: Story = {
  args: { amount: 990, compareAt: 1290 },
  play: async ({ canvas, canvasElement }) => {
    const price = canvasElement.querySelector(
      '[data-slot="product-card-price"]'
    )
    await expect(price).toHaveAttribute("data-sale")
    await expect(canvas.getByText("-23%")).toBeVisible()
    // Screen readers hear which price is which.
    await expect(price).toHaveTextContent(/Sale price .*990.*Was .*1,290/)
  },
}

/** `compareAt` at or below `amount` is ignored: no sale styling, no badge. */
export const CompareAtNotHigher: Story = {
  args: { amount: 1290, compareAt: 1290 },
  play: async ({ canvasElement }) => {
    const price = canvasElement.querySelector(
      '[data-slot="product-card-price"]'
    )
    await expect(price).not.toHaveAttribute("data-sale")
    await expect(price?.querySelector("s")).toBeNull()
  },
}

export const OtherCurrency: Story = {
  args: { amount: 49.99, compareAt: 69.99, currency: "USD", locale: "en-US" },
}
