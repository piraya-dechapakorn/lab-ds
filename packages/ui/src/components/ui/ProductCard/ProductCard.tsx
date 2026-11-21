import * as React from "react"
import { ImageIcon } from "lucide-react"

import { Badge } from "../Badge"
import { cn } from "../../../lib/utils"
import styles from "./ProductCard.module.css"

function ProductCard({ className, ...props }: React.ComponentProps<"article">) {
  return (
    <article
      data-slot="product-card"
      className={cn(styles.root, className)}
      {...props}
    />
  )
}

/**
 * Square image frame. Pass the image element as children (`<img>`,
 * `next/image`…); with no children it shows a neutral placeholder.
 */
function ProductCardMedia({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="product-card-media"
      className={cn(styles.media, className)}
      {...props}
    >
      {children ?? <ImageIcon aria-hidden="true" data-placeholder="" />}
    </div>
  )
}

function ProductCardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="product-card-content"
      className={cn(styles.content, className)}
      {...props}
    />
  )
}

function ProductCardBrand({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="product-card-brand"
      className={cn(styles.brand, className)}
      {...props}
    />
  )
}

function ProductCardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="product-card-title"
      className={cn(styles.title, className)}
      {...props}
    />
  )
}

/**
 * Format a price: whole amounts drop the decimals (฿1,290), others keep two
 * (฿349.50).
 */
function formatPrice(amount: number, currency = "THB", locale = "th-TH") {
  const whole = Number.isInteger(amount)
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(amount)
}

export type ProductCardPriceProps = Omit<
  React.ComponentProps<"p">,
  "children"
> & {
  /** Current selling price. */
  amount: number
  /** Original price. When higher than `amount`, the price shows as a sale. */
  compareAt?: number
  /** ISO 4217 code. @default "THB" */
  currency?: string
  /** @default "th-TH" */
  locale?: string
}

function ProductCardPrice({
  amount,
  compareAt,
  currency = "THB",
  locale = "th-TH",
  className,
  ...props
}: ProductCardPriceProps) {
  const onSale = compareAt !== undefined && compareAt > amount
  const price = formatPrice(amount, currency, locale)

  return (
    <p
      data-slot="product-card-price"
      data-sale={onSale ? "" : undefined}
      className={cn(styles.price, className)}
      {...props}
    >
      {onSale ? (
        <>
          <span className={styles.amount}>
            <span className="sr-only">Sale price </span>
            {price}
          </span>
          <s className={styles.compareAt}>
            <span className="sr-only">Was </span>
            {formatPrice(compareAt, currency, locale)}
          </s>
          <Badge className={styles.discount}>
            -{Math.round((1 - amount / compareAt) * 100)}%
          </Badge>
        </>
      ) : (
        <span className={styles.amount}>{price}</span>
      )}
    </p>
  )
}

export {
  ProductCard,
  ProductCardMedia,
  ProductCardContent,
  ProductCardBrand,
  ProductCardTitle,
  ProductCardPrice,
  formatPrice,
}
