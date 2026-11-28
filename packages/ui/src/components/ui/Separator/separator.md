# Separator

## Purpose

A thin line that divides content into groups, either across the page or between items in a row.

## Import and use

**1. Set up once per app.** Install the package, then import its styles once, after Tailwind, in your global CSS file. The package README has the full setup.

```bash
pnpm add @piraya.d/ai_designsystem_lab
```

```css
@import "tailwindcss";
@import "@piraya.d/ai_designsystem_lab/styles.css";
```

**2. Import it** from `@piraya.d/ai_designsystem_lab`:

```tsx
import { Separator } from "@piraya.d/ai_designsystem_lab"
```

**3. Place it between the two groups** it divides:

```tsx
<p>Section one</p>
<Separator />
<p>Section two</p>
```

Separator is a client component. You can still import it into a React Server Component.

## When to use

- Between two groups of related content that spacing alone doesn't separate clearly, such as account details and settings.
- `vertical` between short items in a row, such as footer links.
- Inside a form, use **Field**'s `FieldSeparator`, which can also hold text such as "or".

## When not to use

| Situation | Use instead |
| --- | --- |
| Groups that are already clear from spacing or headings | Spacing alone. Extra lines add visual noise |
| Between every row of a list or table | The list's or **Table**'s own row borders |
| A line with text in the middle, such as "or" | `FieldSeparator` from **Field** |
| A purely decorative border on a box | A border class on the box |

## Behaviour

- **Screen readers:** Separator renders with `role="separator"` and `aria-orientation`, so screen readers announce a divider between the groups ([MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/separator_role)).
- **Visual-only lines:** when the line only decorates, such as between links in a row, add `aria-hidden`. Otherwise screen readers say "separator" between every item (see the `Vertical` story).
- **No content inside:** screen readers ignore anything inside a separator, so it can't hold text. Use `FieldSeparator` for a line with text.
- **Vertical:** a vertical Separator stretches to the height of its row, so the row needs a height (for example `h-5`) or items that give it one.

## Props and variants

| Prop | Values | Default | Use |
| --- | --- | --- | --- |
| `orientation` | `horizontal`, `vertical` | `horizontal` | `horizontal` is a 1px line across the full width. `vertical` is a 1px line down the full height of its row |
| `aria-hidden` | `true` | | Hides a visual-only line from screen readers |
| `className` | string or function of state | | Merged after the built-in class, so your utilities win. Use it for margin, such as `my-4` |

There are no sizes or colours.

## Tokens used

| Token | Where |
| --- | --- |
| `--border` | The line colour |

The token has a dark-mode value.

## Gaps against industry standards

- TODO: **Check the line's contrast.** When the line is the only thing that shows a boundary, WCAG 1.4.11 asks for 3:1 against the background. `--border` is lighter than that.

## Example

Links in a row, from the `Vertical` story in `Separator.stories.tsx`:

```tsx
import { Separator } from "@piraya.d/ai_designsystem_lab"

<div className="flex h-5 items-center gap-3 text-sm">
  <a href="#blog">Blog</a>
  <Separator orientation="vertical" aria-hidden />
  <a href="#docs">Docs</a>
  <Separator orientation="vertical" aria-hidden />
  <a href="#source">Source</a>
</div>
```

## Class names

The built CSS scopes the root class to `lds-Separator-root`. Consumers may target it, so renaming it is a breaking change.

## Storybook

Stories are in `apps/storybook/src/stories/Separator.stories.tsx`. Keep their `argTypes` in sync with the props above.
