# Button

A clickable button built on the Base UI [`Button`](https://base-ui.com/react/components/button) primitive. Styles come from `Button.module.css`; variant and size are chosen with `data-variant` and `data-size` attributes.

## Files

| File | Purpose |
| --- | --- |
| `Button.tsx` | `Button` component, `buttonStyles()` helper, and types |
| `Button.module.css` | Styles, in `@layer components.primitive` |
| `index.ts` | Re-exports `./Button` |

## Usage

```tsx
import { Button } from "lab-ds"

<Button>Save</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button variant="destructive">Delete</Button>
<Button size="icon" aria-label="Settings"><SettingsIcon /></Button>
```

### Icons

An SVG inside the button is `size-4` by default (`size-3` for `xs` and `icon-xs`). Add a `size-*` class to the icon to override it. Put `data-icon="inline-start"` or `data-icon="inline-end"` on the icon to tighten the padding on that side:

```tsx
<Button>
  <PlusIcon data-icon="inline-start" />
  Add item
</Button>
```

### Styling other elements as a button

`buttonStyles()` returns `className`, `data-variant` and `data-size` props, so any element (for example a link) can look like a Button:

```tsx
import { buttonStyles } from "lab-ds"

<a href="/pricing" {...buttonStyles({ variant: "outline", size: "lg" })}>
  Pricing
</a>
```

`buttonStyles` has no `"use client"` and is safe to call from React Server Components.

## Props

`ButtonProps` = Base UI `Button.Props` & `ButtonStyleProps`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `ButtonVariant` | `"default"` | Visual treatment |
| `size` | `ButtonSize` | `"default"` | Height and padding scale. `icon-*` sizes are square |
| `className` | `string \| (state) => string` | | Merged after the module class with `mergeClassName`, so consumer utilities win |

All other Base UI Button props (`disabled`, `focusableWhenDisabled`, `nativeButton`, `render`, …) and native button attributes pass through.

### `variant`

| Value | Look |
| --- | --- |
| `default` | Solid `primary` background |
| `outline` | Bordered, `background` fill; `muted` on hover and when `aria-expanded="true"` |
| `secondary` | Solid `secondary` background |
| `ghost` | Transparent; `muted` on hover and when `aria-expanded="true"` |
| `destructive` | Tinted `destructive` background and text |
| `link` | `link` coloured text, underline on hover |

### `size`

| Value | Dimensions |
| --- | --- |
| `xs` | `h-6`, `px-2.5`, `text-xs` |
| `sm` | `h-8`, `px-3` |
| `default` | `h-9`, `px-3` |
| `lg` | `h-10`, `px-4` |
| `icon-xs` | `size-6` |
| `icon-sm` | `size-8` |
| `icon` | `size-9` |
| `icon-lg` | `size-10` |

## States

| Attribute | Effect |
| --- | --- |
| `:focus-visible` | `ring` coloured border and 3px ring |
| `:active` | Moves down 1px (skipped when `aria-haspopup` is set) |
| `:disabled` | 50% opacity, no pointer events |
| `aria-invalid="true"` | `destructive` border and ring |
| `aria-expanded="true"` | Pressed look on `outline`, `secondary` and `ghost` |

## Data attributes

The rendered element carries `data-slot="button"`, `data-variant` and `data-size`.

## Public class name

The built CSS scopes the root class to `lds-Button-root`. Consumers may target it, so renaming it is a breaking change.

## Storybook

Stories are in `apps/storybook/src/stories/Button.stories.tsx`. Keep their `argTypes` in sync with the props above.
