# @piraya.d/ai_designsystem_lab

React + TypeScript design system built on [Base UI](https://base-ui.com) and Tailwind CSS v4.

## Install

```bash
pnpm add @piraya.d/ai_designsystem_lab
```

With npm or yarn:

```bash
npm install @piraya.d/ai_designsystem_lab
yarn add @piraya.d/ai_designsystem_lab
```

Requirements:

| Package | Version | Why |
|---|---|---|
| `react`, `react-dom` | 19 | peer dependencies |
| `tailwindcss` | 4 | your app's Tailwind reads the theme this package ships |

## Stylesheet setup

Import the stylesheet once, in the CSS file where you import Tailwind, after `@import "tailwindcss"`:

```css
/* app/globals.css (or src/index.css) */
@import "tailwindcss";
@import "@piraya.d/ai_designsystem_lab/styles.css";
```

`@piraya.d/ai_designsystem_lab/styles.css` contains:

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
| `--font-heading` | dialog titles, card titles, product card titles and prices |

```css
:root {
  --font-sans: "Inter", system-ui, sans-serif;
  --font-heading: "Inter", system-ui, sans-serif;
}
```

### Dark mode

Add `dark` to `<html>` (or any ancestor) to switch every token to its dark value:

```html
<html class="dark">
```

## Example

```tsx
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  FieldLabel,
  Input,
} from "@piraya.d/ai_designsystem_lab"

export function EditProfile() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        Edit profile
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Changes are saved when you click Save.</DialogDescription>
        </DialogHeader>
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input id="name" defaultValue="Ada Lovelace" />
        </Field>
        <DialogFooter showCloseButton>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

Interactive components are marked `"use client"`, so you can import them from React Server Components. `buttonStyles`, `badgeStyles` and `formatPrice` carry no directive and can be called on the server, for example to style a link as a button:

```tsx
import { buttonStyles } from "@piraya.d/ai_designsystem_lab"

<a href="/pricing" className={buttonStyles({ variant: "secondary" })}>Pricing</a>
```

## Components

Each component's full spec (props, variants, states, tokens and `lds-*` class names) ships in the package at `dist/docs/<Name>.md`, for example `node_modules/@piraya.d/ai_designsystem_lab/dist/docs/Button.md`.

| Component | Parts and helpers |
|---|---|
| Alert | `Alert`, `AlertTitle`, `AlertDescription`, `AlertAction` |
| Avatar | `Avatar`, `AvatarImage`, `AvatarFallback`, `AvatarBadge`, `AvatarGroup`, `AvatarGroupCount` |
| Badge | `Badge`, `badgeStyles` |
| Button | `Button`, `buttonStyles` |
| Card | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter` |
| Checkbox | `Checkbox` |
| Dialog | `Dialog`, `DialogTrigger`, `DialogPortal`, `DialogOverlay`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`, `DialogClose` |
| Field | `Field`, `FieldSet`, `FieldLegend`, `FieldGroup`, `FieldContent`, `FieldLabel`, `FieldTitle`, `FieldDescription`, `FieldSeparator`, `FieldError` |
| Input | `Input` |
| InputGroup | `InputGroup`, `InputGroupAddon`, `InputGroupButton`, `InputGroupText`, `InputGroupInput`, `InputGroupTextarea` |
| InputOTP | `InputOTP`, `InputOTPGroup`, `InputOTPSlot`, `InputOTPSeparator` |
| Label | `Label` |
| ProductCard | `ProductCard`, `ProductCardMedia`, `ProductCardContent`, `ProductCardBrand`, `ProductCardTitle`, `ProductCardPrice`, `formatPrice` |
| Select | `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectGroup`, `SelectLabel`, `SelectItem`, `SelectSeparator`, `SelectScrollUpButton`, `SelectScrollDownButton` |
| Separator | `Separator` |
| Table | `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, `TableCaption` |
| Tabs | `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` |
| Textarea | `Textarea` |

Helpers: `cn` (class merging) and `mergeClassName` (class merging for Base UI parts whose `className` can be a function of state).

## License

MIT
