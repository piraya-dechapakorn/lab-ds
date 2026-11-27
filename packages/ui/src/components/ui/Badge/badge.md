# Badge

## Purpose

A small pill-shaped label for a short status or category on an item, such as "Paid", "New" or "Sale".

## Import and use

**1. Set up once per app.** Install the package, then import its styles once, after Tailwind, in your global CSS file. The package README has the full setup.

```bash
pnpm add lab-ds
```

```css
@import "tailwindcss";
@import "lab-ds/styles.css";
```

**2. Import it** from `lab-ds`:

```tsx
import { Badge } from "lab-ds"
```

**3. Put one or two words inside it:**

```tsx
<Badge>New</Badge>
<Badge variant="destructive">Payment failed</Badge>
<Badge variant="outline" render={<a href="/tags/sale" />}>Sale</Badge>
```

Badge has no `"use client"` and works in React Server Components.

### Styling other elements as a badge

`badgeStyles()` returns `className` and `data-variant`, so any element, such as a framework `<Link>`, can look like a Badge:

```tsx
import { badgeStyles } from "lab-ds"

<a href="/tags/new" {...badgeStyles({ variant: "secondary" })}>New</a>
```

`badgeStyles` is safe to call from React Server Components.

## When to use

- The status of an item in a list or table, such as an order that is "Shipped" or "Payment failed".
- A category or tag, such as "Shoes". Render it as a link when it leads to that category.
- A short label that draws attention to something new or limited, such as "New" or "Sale".

## When not to use

| Situation | Use instead |
| --- | --- |
| A message the user needs to read or act on | **Alert** |
| An action, such as "Add tag" | **Button** (size `xs` or `sm`) |
| A long label, or more than three or four words | Plain text |
| A count of unread items on an icon | TODO: the library has no notification counter |
| A person's online status on their picture | `AvatarBadge` (**Avatar**) |

## Content guidance

- **Length:** one or two words. Badges don't wrap, so long text runs off.
- **Case:** sentence case, such as "Payment failed", not "PAYMENT FAILED".
- **Colour:** the visible words must say the status on their own. Colour is only a hint, because some people can't see it ([WCAG 1.4.1](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)). "Unpaid" in red works; a red badge with no text, or with the meaning only in screen-reader text, doesn't.
- **Consistency:** use the same variant for the same meaning everywhere, such as `destructive` only for errors and failures.
- **How many:** one or two badges per item. Many badges together lose their meaning.
- **Links:** GOV.UK and Carbon say not to make badges clickable, because users can't tell clickable ones from plain ones ([GOV.UK](https://design-system.service.gov.uk/components/tag/), [Carbon](https://carbondesignsystem.com/components/tag/usage/)). If a tag must link to its category, make every tag in that place a link, and keep the focus ring.

## Behaviour

- **Not interactive by default:** a Badge is a `<span>`. Screen readers read its text as part of the line it's in.
- **As a link:** pass `render={<a href="…" />}`. The link can be focused, shows a focus ring, and darkens on hover for the `default`, `secondary`, `destructive` and `outline` variants.
- **Changing status:** a Badge isn't announced when its text changes. TODO: when a status changes while the user watches, announce it another way, such as a live region.

## Props and variants

| Prop | Values | Default | Use |
| --- | --- | --- | --- |
| `variant` | `default`, `secondary`, `destructive`, `outline`, `ghost`, `link` | `default` | Visual treatment |
| `render` | element | `<span>` | Swaps the element, for example to a link |
| `aria-invalid` | `true`, `false` | | Red border |
| `className` | string | | Merged after the built-in class, so your utilities win |

| Variant | Look | Use for |
| --- | --- | --- |
| `default` | Solid `--primary` | The most important label on the item, such as "New" |
| `secondary` | Solid `--secondary` | Neutral statuses, such as "Paid" or "Shipped" |
| `destructive` | Light red tint, red text | Errors and failures, such as "Payment failed" |
| `outline` | Border, no fill | Low-emphasis labels, such as "Draft" or "Pending" |
| `ghost` | No border or fill until hover | Tags in a dense row |
| `link` | `--link` coloured text, underlined on hover | A tag that reads like a link |

There are no sizes. Every Badge is 20px tall with 12px text.

### Icons

An SVG inside the Badge is 12px. Put `data-icon="inline-start"` or `data-icon="inline-end"` on the icon to tighten the padding on that side. Add an icon only next to text, not instead of it. lucide-react icons are already hidden from screen readers.

## States

| State | How to set it | Look |
| --- | --- | --- |
| Rest | | The variant's colours |
| Hover | Pointer over a Badge rendered as a link (`ghost`: over any Badge) | Slightly lighter fill. `outline` and `ghost` get a `--muted` fill |
| Focus | Keyboard focus on a Badge rendered as a link | `--ring` border and 3px ring |
| Invalid | `aria-invalid="true"` | `--destructive` border |

## Tokens used

| Token | Where |
| --- | --- |
| `--primary`, `--primary-foreground` | `default` fill and text |
| `--secondary`, `--secondary-foreground` | `secondary` fill and text |
| `--destructive` | `destructive` text, fill (10%, or 20% in dark mode) and the invalid border |
| `--border` | `outline` border |
| `--foreground` | `outline` text |
| `--muted`, `--muted-foreground` | Hover fill and text for `outline` and `ghost` |
| `--link` | `link` text |
| `--ring` | Focus border and ring (50%) |
| `--radius` | Corner radius (2.2 × `--radius`, the `3xl` step) |

Every token has a dark-mode value.

## Gaps against industry standards

- TODO: **There are no success, warning or info variants.** Many systems (Carbon, Polaris, Atlassian) have a colour per status. Here `secondary` stands in for neutral and success.
- TODO: **`ghost` text has no colour of its own**, so it takes the colour of the text around it.
- TODO: **Check the contrast of 12px text** on each variant, `destructive` and `outline` in particular. WCAG 1.4.3 asks for 4.5:1.
- TODO: **Atlassian splits this into three components:** a lozenge for status, a tag for categories and a badge for counts ([Atlassian](https://atlassian.design/components/lozenge/usage)). Here one Badge covers status and categories.

## Example

Order statuses in a list, from the `StatusInList` story in `Badge.stories.tsx`:

```tsx
import { Badge } from "lab-ds"

<ul className="flex max-w-sm flex-col divide-y text-sm">
  <li className="flex items-center justify-between py-2">
    Order #1042
    <Badge variant="secondary">Shipped</Badge>
  </li>
  <li className="flex items-center justify-between py-2">
    Order #1043
    <Badge variant="destructive">Payment failed</Badge>
  </li>
  <li className="flex items-center justify-between py-2">
    Order #1044
    <Badge variant="outline">Draft</Badge>
  </li>
</ul>
```

## Class names

The built CSS scopes the root class to `lds-Badge-root`. Consumers may target it, so renaming it is a breaking change.

## Storybook

Stories are in `apps/storybook/src/stories/Badge.stories.tsx`. Keep their `argTypes` in sync with the props above.
