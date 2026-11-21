# lab-ds

React + TypeScript design system built on [Base UI](https://base-ui.com) and Tailwind CSS v4.

## Install

```bash
pnpm add lab-ds
```

`react` and `react-dom` (v19) are peer dependencies.

## Styles

Import the stylesheet once, in the CSS file where you import Tailwind, after `@import "tailwindcss"`:

```css
@import "tailwindcss";
@import "lab-ds/styles.css";
```

`lab-ds/styles.css` contains:

- **Design tokens.** CSS variables on `:root`, with overrides under `.dark`.
- **Theme mapping.** An `@theme inline` block, so your own Tailwind classes such as `bg-primary`, `text-muted-foreground` and `rounded-4xl` use the same tokens.
- **The `dark` variant.** It is driven by a `.dark` class on an ancestor element, such as `<html class="dark">`.
- **A small base layer.** Default border and outline colours, `body` background and text colours, and `font-sans` on `html`.
- **The component styles.** These ship precompiled with fixed class names (`lds-<Component>-<part>`).

Because the component styles are precompiled, your Tailwind does not need to scan this package, and no `@source` entry is required. The styles sit in the `components` cascade layer, so a Tailwind `className` you pass to a component always wins.

### Fonts

The theme reads two font variables that your app sets, for example with `next/font`:

| Variable | Used for |
|---|---|
| `--font-sans` | body text |
| `--font-heading` | dialog titles, product card titles and prices |

## Usage

```tsx
import { Button, Dialog, DialogContent, DialogTrigger } from "lab-ds"

export function Example() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>Open</DialogTrigger>
      <DialogContent>Hello</DialogContent>
    </Dialog>
  )
}
```

Interactive components are marked `"use client"`. You can import them from React Server Components.

## Components

Alert, Avatar, Badge, Button, Dialog, Field, Input, InputGroup, InputOTP, Label, ProductCard, Separator, Table and Textarea, plus the `cn` and `mergeClassName` helpers.
