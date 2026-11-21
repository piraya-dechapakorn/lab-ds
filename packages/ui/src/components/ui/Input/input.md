# Input

## Purpose

A single-line text box for a short answer, such as a name, an email address or a search term.

## Import and use

**1. Set up once per app.** Install the package, then import its styles once, after Tailwind, in your global CSS file. The package README has the full setup.

```bash
pnpm add lab-ds
```

```css
@import "tailwindcss";
@import "lab-ds/styles.css";
```

**2. Import it** from `lab-ds`, with **Field** for the label and hint:

```tsx
import { Field, FieldDescription, FieldLabel, Input } from "lab-ds"
```

**3. Give every Input a visible label.** The label's `htmlFor` must match the Input's `id`:

```tsx
<Field>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input id="email" type="email" autoComplete="email" />
</Field>
```

Input works in React Server Components.

## When to use

- An answer that fits on one line ([GOV.UK](https://design-system.service.gov.uk/components/text-input/)).
- A search box. Put the search icon in an **InputGroup**.

## When not to use

| Situation | Use instead |
| --- | --- |
| An answer that may run to more than one line | **Textarea** |
| A one-time passcode or PIN sent to the user | **InputOTP** |
| A unit, symbol or button inside the box, such as `https://` or a copy button | **InputGroup** |
| A choice from a short, known list | TODO: the library has no select, radio or checkbox component yet |
| A number that people don't count, such as a card number or postcode | Input with `type="text"` and `inputMode="numeric"`, not `type="number"` ([GOV.UK](https://design-system.service.gov.uk/components/text-input/)) |

## Content guidance

- **Label:** short and in sentence case, with no colon. Always visible, above the Input ([GOV.UK](https://design-system.service.gov.uk/components/text-input/), [Atlassian](https://atlassian.design/components/textfield/usage)).
- **Hint:** one short sentence in a **FieldDescription**, with no links. Use it for the format or for why you ask.
- **Placeholder:** leave it out, or use it only for an example of the format. It disappears as soon as the user types, and not every screen reader reads it, so it can't replace a label or a hint ([NN/g](https://www.nngroup.com/articles/form-design-placeholders/)).
- **Error message:** say what went wrong and how to fix it, with the label's words. For example "Enter an email address like name@example.com", not "Invalid input" ([GOV.UK](https://design-system.service.gov.uk/components/error-message/)).
- **Width:** match the expected answer. A postcode box can be narrow. The Input fills its container by default.
- **`autoComplete`:** set it for personal data such as `name`, `email` or `tel`. WCAG 1.3.5 asks for it.

## Behaviour

- **Focus:** a ring appears when the user reaches the Input with the keyboard or clicks into it.
- **Invalid:** set `aria-invalid` once validation has run, usually on blur or on submit, not on every keystroke. The border and ring turn red. Show the message in a **FieldError**, and link it with `aria-describedby` so screen readers read it with the label.
- **Disabled:** the Input fades to 50%, can't be focused and is skipped by screen readers. Use `readOnly` instead when the user still needs to read or copy the value.
- **Inside a Field:** Input is built on the Base UI Input, so it also works inside a Base UI Field.

## Props and variants

There are no visual variants and no sizes. Every Input is 36px tall.

Input takes every native `<input>` attribute. These are the ones that change how it looks or behaves:

| Prop | Values | Default | Use |
| --- | --- | --- | --- |
| `type` | `text`, `email`, `password`, `search`, `tel`, `url`, `number`, `file`, … | `text` | The kind of value. It sets the phone keyboard and browser checks |
| `placeholder` | text | | Example of the format. Muted colour |
| `disabled` | `true`, `false` | `false` | Fades the Input and blocks typing |
| `aria-invalid` | `true`, `false` | | Red border and ring |
| `readOnly` | `true`, `false` | `false` | The value can be read and copied but not changed. There is no separate style for it |
| `className` | string | | Merged after the built-in class, so your utilities win |

With `type="file"`, the file button inside the box uses medium-weight text.

## States

| State | How to set it | Look |
| --- | --- | --- |
| Rest | | Light grey fill (`--input` at 50%), no visible border |
| Placeholder | `placeholder` | Placeholder text in `--muted-foreground` |
| Focus | Keyboard or click | `--ring` border and 3px ring |
| Invalid | `aria-invalid="true"` | `--destructive` border and ring |
| Disabled | `disabled` | 50% opacity, not-allowed cursor |

The `States` story shows each one.

## Tokens used

| Token | Where |
| --- | --- |
| `--input` | Background, at 50% opacity |
| `--muted-foreground` | Placeholder text |
| `--foreground` | File button text |
| `--ring` | Focus border, and the focus ring at 30% opacity |
| `--destructive` | Invalid border, and the invalid ring at 20% (40% in dark mode) |
| `--radius` | Corner radius (2.2 × `--radius`, the `3xl` step) |

Text is 16px on small screens and 14px from the `md` breakpoint up. The 16px stops iOS from zooming in on focus. Every token has a dark-mode value.

## Gaps against industry standards

These come from comparing the component with GOV.UK, Atlassian, Carbon, NN/g and WCAG. None of them has been changed in the code.

- TODO: **Nothing makes a label required.** An Input with only a placeholder passes the type check. Always pair it with a **FieldLabel** or an `aria-label`.
- TODO: **The invalid state is colour only.** WCAG 1.4.1 needs more than colour, so always show a **FieldError** next to it.
- TODO: **Read-only has no style of its own.** It looks the same as an editable Input ([Carbon](https://carbondesignsystem.com/components/text-input/usage/)).
- TODO: **The resting box has no visible border.** Check that the 50% `--input` fill meets the 3:1 contrast that WCAG 1.4.11 asks for, and that the placeholder colour meets 4.5:1.

## Example

An email field with a label and a hint, from the `WithLabel` story in `Input.stories.tsx`:

```tsx
import { Field, FieldDescription, FieldLabel, Input } from "lab-ds"

<Field>
  <FieldLabel htmlFor="input-email">Email</FieldLabel>
  <Input
    id="input-email"
    type="email"
    autoComplete="email"
    aria-describedby="input-email-hint"
  />
  <FieldDescription id="input-email-hint">
    We only use it to send your receipt.
  </FieldDescription>
</Field>
```

`aria-describedby` points at the hint's `id`, so screen readers read the hint after the label.

## Class names

The built CSS scopes the root class to `lds-Input-root`. Consumers may target it, so renaming it is a breaking change.

## Storybook

Stories are in `apps/storybook/src/stories/Input.stories.tsx`. Keep their `argTypes` in sync with the props above.
