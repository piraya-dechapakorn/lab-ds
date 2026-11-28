# ProductCard

## Purpose

A card for one product in a shop listing: its picture, brand, name and price, including a sale price.

## Import and use

**1. Set up once per app.** Install the package, then import its styles once, after Tailwind, in your global CSS file. The package README has the full setup.

```bash
pnpm add @piraya.d/ai_designsystem_lab
```

```css
@import "tailwindcss";
@import "@piraya.d/ai_designsystem_lab/styles.css";
```

Product titles and prices use the `--font-heading` font variable, which your app sets.

**2. Import the parts you need** from `@piraya.d/ai_designsystem_lab`:

```tsx
import {
  ProductCard,
  ProductCardBrand,
  ProductCardContent,
  ProductCardMedia,
  ProductCardPrice,
  ProductCardTitle,
} from "@piraya.d/ai_designsystem_lab"
```

**3. Build the card** from this structure:

```tsx
<ProductCard>
  <ProductCardMedia>
    <img src="/products/tote.jpg" alt="Canvas Tote Bag" />
  </ProductCardMedia>
  <ProductCardContent>
    <ProductCardBrand>Atelier Mori</ProductCardBrand>
    <ProductCardTitle>Canvas Tote Bag</ProductCardTitle>
    <ProductCardPrice amount={990} compareAt={1290} />
  </ProductCardContent>
</ProductCard>
```

ProductCard works in React Server Components.

## When to use

- A grid of products people browse and compare, such as a category page or search results.
- A short row of products, such as "You may also like".

## When not to use

| Situation | Use instead |
| --- | --- |
| The product page itself | A full page layout |
| Comparing many details, such as specs, across products | **Table** |
| A product in the cart or an order summary | A compact row with a small image |

## Anatomy

| Part | Required | Content |
| --- | --- | --- |
| `ProductCard` | Yes | The card, an `<article>`. It lifts and zooms its image on hover |
| `ProductCardMedia` | Yes | A square frame for the image. Non-square images are cropped to fill it. With no image it shows a grey placeholder icon |
| `ProductCardContent` | Yes | Holds the text below the image |
| `ProductCardBrand` | No | The brand, in small uppercase letters |
| `ProductCardTitle` | Yes | The product name, an `<h3>`. Long names are cut to two lines |
| `ProductCardPrice` | Yes | The price. With a higher `compareAt`, it shows a sale |

## Content guidance

- **Image alt text:** always set `alt`. Use `alt=""` when the image only shows what the title says (see the `Linked` story). Describe it when it shows something the text doesn't, such as the colour ([WAI](https://www.w3.org/WAI/tutorials/images/decision-tree/)).
- **Title:** the name people search for, without the brand. Two lines at most are shown, so put the words that tell products apart first.
- **Brand:** the brand name as written. It is shown in capitals.
- **Price:** pass numbers, not formatted text. `ProductCardPrice` formats them, such as ฿1,290 or ฿349.50.
- **Sale:** set `compareAt` only for a real earlier price. The card works out the discount badge, such as "-23%".

## Behaviour

- **Whole card as a link:** put the `<a>` inside `ProductCardTitle` and stretch it over the card with an `::after`, so screen readers hear one short link named after the product. Don't wrap the whole card in an `<a>`: the link would read out every word in the card ([Inclusive Components](https://inclusive-components.design/cards/)). Add a `focus-within` ring to the card so keyboard users see where they are. The `Linked` story shows the classes.
- **More than one action:** a card with its own buttons, such as "Add to cart", needs clearly separate click areas. Keep the stretched link off those buttons ([Baymard](https://baymard.com/blog/hit-areas-in-visual-elements)).
- **Sale price:** the current price turns red, the old price is struck through, and a discount badge sits on the image's top-left corner. Screen readers hear "Sale price ฿990 Was ฿1,290".
- **`compareAt` not higher than `amount`:** it is ignored, with no sale style and no badge.
- **Hover:** the card lifts 2px with a larger shadow and the image zooms to 105%. Both are turned off when the user asks for reduced motion.
- **Title level:** `ProductCardTitle` is an `<h3>`. TODO: there is no prop to change the heading level when the page structure needs another one.

## Props and variants

There are no visual variants and no sizes. The card fills the width of its grid cell.

**`ProductCardPrice`**

| Prop | Values | Default | Use |
| --- | --- | --- | --- |
| `amount` | number | required | The current selling price |
| `compareAt` | number | | The original price. When it is higher than `amount`, the price shows as a sale |
| `currency` | ISO 4217 code | `THB` | The currency, such as `USD` |
| `locale` | locale code | `th-TH` | How the number is written |

The other parts take the attributes of their HTML element (`article`, `div`, `p`, `h3`) and have no props of their own.

### `formatPrice()`

`ProductCardPrice` uses `formatPrice(amount, currency?, locale?)`. Whole amounts drop the decimals (฿1,290), others keep two (฿349.50). It is exported, has no `"use client"` and is safe to call from React Server Components:

```tsx
import { formatPrice } from "@piraya.d/ai_designsystem_lab"

formatPrice(1290) // "฿1,290"
formatPrice(19.9, "USD", "en-US") // "$19.90"
```

## States

| State | How to set it | Look |
| --- | --- | --- |
| Rest | | Card with a thin border and a small shadow |
| Hover | Pointer over the card | Lifts 2px, larger shadow, `--ring` border at 40%, image zooms |
| On sale | `compareAt` higher than `amount` | Red price, struck-through original, discount badge |
| No image | `ProductCardMedia` with no children | Grey gradient with a placeholder icon |

## Tokens used

| Token | Where |
| --- | --- |
| `--card`, `--card-foreground` | Card background and text |
| `--border` | Card outline |
| `--ring` | Card outline on hover (40%, full in dark mode) |
| `--muted` | Image frame background gradient |
| `--muted-foreground` | Brand, original price and placeholder icon |
| `--destructive` | Sale price |
| `--primary`, `--primary-foreground` | Discount badge (the **Badge** `default` variant) |
| `--font-heading` | Title and price font |
| `--radius` | Card corners (2.2 × `--radius`, `3xl`) and image corners (1.8 ×, `2xl`) |

Every token has a dark-mode value.

## Gaps against industry standards

- TODO: **The discount badge is read as "-23%" with no context.** Screen readers hear it after the prices, which can be unclear. Consider hiding it from screen readers, since the prices already say it.
- TODO: **The card has no out-of-stock state.**
- TODO: **The heading level is fixed at `<h3>`.**
- TODO: **The image comes before the title in the code.** People who jump between headings with a screen reader land on the title and may miss the image. Inclusive Components suggests putting the heading first in the code and moving the image up with CSS.

## Example

A product on sale, from the `OnSale` story in `ProductCard/ProductCard.stories.tsx`:

```tsx
import {
  ProductCard,
  ProductCardBrand,
  ProductCardContent,
  ProductCardMedia,
  ProductCardPrice,
  ProductCardTitle,
} from "@piraya.d/ai_designsystem_lab"

<ProductCard className="w-64">
  <ProductCardMedia>
    <img src="/products/tote.jpg" alt="Canvas Tote Bag" />
  </ProductCardMedia>
  <ProductCardContent>
    <ProductCardBrand>Atelier Mori</ProductCardBrand>
    <ProductCardTitle>Canvas Tote Bag</ProductCardTitle>
    <ProductCardPrice amount={990} compareAt={1290} />
  </ProductCardContent>
</ProductCard>
```

## Class names

The built CSS scopes these classes. Consumers may target them, so renaming one is a breaking change.

| Part | Class |
| --- | --- |
| `ProductCard` | `lds-ProductCard-root` |
| `ProductCardMedia` | `lds-ProductCard-media` |
| `ProductCardContent` | `lds-ProductCard-content` |
| `ProductCardBrand` | `lds-ProductCard-brand` |
| `ProductCardTitle` | `lds-ProductCard-title` |
| `ProductCardPrice` | `lds-ProductCard-price` |
| Current price | `lds-ProductCard-amount` |
| Original price | `lds-ProductCard-compareAt` |
| Discount badge | `lds-ProductCard-discount` |

## Storybook

Stories are in `apps/storybook/src/stories/ProductCard/`, one file per part. Keep their `argTypes` in sync with the props above.
