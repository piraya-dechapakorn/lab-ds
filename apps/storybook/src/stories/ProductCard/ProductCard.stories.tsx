import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  ProductCard,
  ProductCardBrand,
  ProductCardContent,
  ProductCardMedia,
  ProductCardPrice,
  ProductCardTitle,
} from "@piraya.d/ai_designsystem_lab"
import { expect } from "storybook/test"

import { LONG_TITLE, products } from "./fixtures"

type CardArgs = {
  brand: string
  title: string
  image?: string
  amount: number
  compareAt?: number
  currency: string
  locale: string
}

/** The full card, composed from its parts the way an app would use it. */
function Card({ brand, title, image, ...price }: CardArgs) {
  return (
    <ProductCard className="w-64">
      <ProductCardMedia>
        {image && <img src={image} alt={title} />}
      </ProductCardMedia>
      <ProductCardContent>
        <ProductCardBrand>{brand}</ProductCardBrand>
        <ProductCardTitle>{title}</ProductCardTitle>
        <ProductCardPrice {...price} />
      </ProductCardContent>
    </ProductCard>
  )
}

const meta = {
  title: "Components/ProductCard/ProductCard",
  component: Card,
  parameters: {
    docs: {
      description: {
        component:
          "`<article>` root of the card. Compose it from `ProductCardMedia`, `ProductCardContent`, `ProductCardBrand`, `ProductCardTitle` and `ProductCardPrice`. Hover lifts the card and zooms the image (off under `prefers-reduced-motion`).",
      },
    },
  },
  args: {
    ...products.sneaker,
    currency: "THB",
    locale: "th-TH",
  },
  argTypes: {
    brand: { control: "text", description: "`ProductCardBrand` children." },
    title: { control: "text", description: "`ProductCardTitle` children." },
    image: {
      control: "text",
      description:
        "`<img src>` inside `ProductCardMedia`. Empty shows the placeholder.",
    },
    amount: { control: { type: "number", step: 0.5 } },
    compareAt: {
      control: { type: "number", step: 0.5 },
      description: "Higher than `amount` → sale.",
    },
    currency: { control: "text" },
    locale: { control: "text" },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const OnSale: Story = {
  args: { ...products.bag },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("-23%")).toBeVisible()
  },
}

export const NoImage: Story = {
  args: { image: undefined },
}

/** Titles clamp to two lines. */
export const LongTitle: Story = {
  args: { title: LONG_TITLE },
}

export const Grid: Story = {
  parameters: { layout: "padded" },
  render: (args) => (
    <div className="grid max-w-3xl grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-4">
      {Object.values(products).map((p) => (
        <ProductCard key={p.title}>
          <ProductCardMedia>
            <img src={p.image} alt={p.title} />
          </ProductCardMedia>
          <ProductCardContent>
            <ProductCardBrand>{p.brand}</ProductCardBrand>
            <ProductCardTitle>{p.title}</ProductCardTitle>
            <ProductCardPrice
              amount={p.amount}
              compareAt={"compareAt" in p ? p.compareAt : undefined}
              currency={args.currency}
              locale={args.locale}
            />
          </ProductCardContent>
        </ProductCard>
      ))}
    </div>
  ),
}

/** The whole card as a link. Put the `<a>` around the title so the card keeps its `<article>` semantics. */
export const Linked: Story = {
  render: ({ image, brand, title, ...price }) => (
    <ProductCard className="w-64 focus-within:ring-3 focus-within:ring-ring/30">
      <ProductCardMedia>{image && <img src={image} alt="" />}</ProductCardMedia>
      <ProductCardContent>
        <ProductCardBrand>{brand}</ProductCardBrand>
        <ProductCardTitle>
          <a
            href="#product"
            className="outline-none after:absolute after:inset-0"
          >
            {title}
          </a>
        </ProductCardTitle>
        <ProductCardPrice {...price} />
      </ProductCardContent>
    </ProductCard>
  ),
}
