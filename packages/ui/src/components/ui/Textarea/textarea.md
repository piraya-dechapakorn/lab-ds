# Textarea

## Purpose

A multi-line text box that grows with its content, for answers longer than one line.

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
import { Field, FieldDescription, FieldLabel, Textarea } from "lab-ds"
```

**3. Give every Textarea a visible label.** The label's `htmlFor` must match the Textarea's `id`:

```tsx
<Field>
  <FieldLabel htmlFor="feedback">Feedback</FieldLabel>
  <Textarea id="feedback" />
</Field>
```

Textarea works in React Server Components.

## When to use

- An answer that may need more than one line, such as feedback, a description or delivery notes ([GOV.UK](https://design-system.service.gov.uk/components/textarea/)).
- A message box with a toolbar, such as a chat input. Put the Textarea in an **InputGroup**.

## When not to use

| Situation | Use instead |
| --- | --- |
| A short answer, such as a name or an email address | **Input** |
| An open question whose answer is really a choice | TODO: the library has no radio or select component yet. GOV.UK suggests splitting open questions up ([GOV.UK](https://design-system.service.gov.uk/components/textarea/)) |
| Formatted text, such as headings, bold or lists | TODO: the library has no rich-text editor |

## Content guidance

- **Label and hint:** the same rules as **Input**. A short visible label, and a one-sentence **FieldDescription** for what to write.
- **Placeholder:** leave it out. It disappears as soon as the user types ([NN/g](https://www.nngroup.com/articles/form-design-placeholders/)).
- **Optional fields:** add "(optional)" to the label, as in "Delivery notes (optional)" in the `FormSection` story of **Field**.
- **Length limits:** set one only when you have a reason. Word the error as "Feedback must be 500 characters or less" ([GOV.UK](https://design-system.service.gov.uk/components/character-count/)).

## Behaviour

- **Height:** the box starts at 64px and grows one line at a time as the user types, so it never shows an inner scrollbar. `rows` has no effect. There is no maximum height and no resize handle.
- **Focus, invalid and disabled:** the same as **Input**. Set `aria-invalid` after validation and show the message in a **FieldError** linked with `aria-describedby`.

## Props and variants

There are no visual variants and no sizes.

Textarea takes every native `<textarea>` attribute. These are the ones that change how it looks or behaves:

| Prop | Values | Default | Use |
| --- | --- | --- | --- |
| `placeholder` | text | | Muted colour |
| `disabled` | `true`, `false` | `false` | Fades the Textarea and blocks typing |
| `aria-invalid` | `true`, `false` | | Red border and ring |
| `maxLength` | number | | Stops typing at that many characters. Prefer a visible count and an error ([GOV.UK](https://design-system.service.gov.uk/components/character-count/)) |
| `rows` | number | | No effect: the height follows the content |
| `className` | string | | Merged after the built-in class, so your utilities win. Add `max-h-*` to cap the height |

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
| `--ring` | Focus border, and the focus ring at 30% opacity |
| `--destructive` | Invalid border, and the invalid ring at 20% (40% in dark mode) |
| `--radius` | Corner radius (1.8 × `--radius`, the `2xl` step) |

Text is 16px on small screens and 14px from the `md` breakpoint up. Every token has a dark-mode value.

## Gaps against industry standards

These come from comparing the component with GOV.UK, Carbon, MDN and WCAG. None of them has been changed in the code.

- TODO: **There is no maximum height.** A long entry pushes the rest of the form, and its submit button, down the page ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/field-sizing)). Add a `max-h-*` class when that matters.
- TODO: **There is no resize handle.** Carbon lets the user resize the box.
- TODO: **Older browsers don't grow the box.** Growing relies on CSS `field-sizing`, so browsers without it show a fixed 64px box that scrolls.
- TODO: **There is no character count.** GOV.UK shows the characters left and announces them to screen readers once the user stops typing.

## Example

A feedback field with a linked hint, from the `WithLabel` story in `Textarea.stories.tsx`:

```tsx
import { Field, FieldDescription, FieldLabel, Textarea } from "lab-ds"

<Field>
  <FieldLabel htmlFor="textarea-feedback">Feedback</FieldLabel>
  <Textarea id="textarea-feedback" aria-describedby="textarea-feedback-hint" />
  <FieldDescription id="textarea-feedback-hint">
    Tell us what worked and what didn’t.
  </FieldDescription>
</Field>
```

## Class names

The built CSS scopes the root class to `lds-Textarea-root`. Consumers may target it, so renaming it is a breaking change.

## Storybook

Stories are in `apps/storybook/src/stories/Textarea.stories.tsx`. Keep their `argTypes` in sync with the props above.
