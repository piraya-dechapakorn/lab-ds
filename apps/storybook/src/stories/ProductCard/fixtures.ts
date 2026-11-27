/** Self-contained product images (inline SVG), so stories need no network. */
function svgImage(from: string, to: string, label: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>
<rect width="600" height="600" fill="url(#g)"/>
<circle cx="300" cy="270" r="140" fill="#fff" fill-opacity=".35"/>
<text x="300" y="520" font-family="system-ui,sans-serif" font-size="40" font-weight="600" fill="#fff" text-anchor="middle">${label}</text>
</svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export const products = {
  sneaker: {
    brand: "Northwind",
    title: "Trail Runner 2 Lightweight Sneaker",
    image: svgImage("#f97316", "#be123c", "Sneaker"),
    amount: 2490,
  },
  bag: {
    brand: "Atelier Mori",
    title: "Canvas Tote Bag",
    image: svgImage("#0ea5e9", "#4338ca", "Tote"),
    amount: 990,
    compareAt: 1290,
  },
  mug: {
    brand: "Kiln & Co.",
    title: "Hand-glazed Stoneware Mug, 350 ml",
    image: svgImage("#84cc16", "#047857", "Mug"),
    amount: 349.5,
  },
}

export const LONG_TITLE =
  "Ultra-comfort Recycled Knit Everyday Walking Shoe with Cushioned Sole and Breathable Upper"
