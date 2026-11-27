# Label

## Purpose

The visible name of a form control, which also focuses or toggles the control when clicked.

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
import { Input, Label } from "lab-ds"
```

**3. Point it at its control.** `htmlFor` must match the control's `id`:

```tsx
<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />
```

Label is a client component. You can still import it into a React Server Component.

## When to use

- To name a control outside a form layout, such as a single checkbox in a settings row.
- Inside forms, prefer **Field**'s `FieldLabel`. It is the same Label, with spacing and invalid and disabled styles that follow its Field.

## When not to use

| Situation | Use instead |
| --- | --- |
| A label inside a form with hints and errors | `FieldLabel` in a **Field** |
| A heading for a group of controls | `FieldLegend` in a `FieldSet` (**Field**) |
| Text that names something that isn't a control | Plain text, or `FieldTitle` (**Field**) |

## Content guidance

- **Wording:** short, in sentence case, with no colon at the end ([GOV.UK](https://design-system.service.gov.uk/components/text-input/)).
- **Visible:** keep the label on screen. A placeholder can't replace it.
- **Optional fields:** add "(optional)" to the label text rather than marking required fields with an asterisk ([GOV.UK](https://design-system.service.gov.uk/patterns/question-pages/)).

## Behaviour

- **Naming:** `htmlFor` ties the label to the control, so screen readers read the label when the control gets focus. A label that wraps its control, such as a checkbox, names it without `htmlFor`, but `htmlFor` works with more assistive technology, so prefer it ([WAI](https://www.w3.org/WAI/tutorials/forms/labels/)).
- **Nothing interactive inside:** don't put links or buttons inside a Label. Clicking them would also activate the control ([MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/label)).
- **Clicking:** clicking the label focuses an input, or toggles a checkbox or radio.
- **Layout:** Label lays out its children in a row with an 8px gap, so an icon or a wrapped checkbox sits beside the text.
- **Disabled:** Label has no `disabled` prop. It fades to 50% in two cases:
  - its control comes before it in the code and has the `peer` class and `disabled`. This works for a checkbox before its label, but not for a text box, whose label comes first
  - a parent has the `group` class and `data-disabled="true"`

## Props and variants

Label takes every native `<label>` attribute. There are no variants and no sizes.

| Prop | Values | Default | Use |
| --- | --- | --- | --- |
| `htmlFor` | string | | The `id` of the control it names |
| `className` | string | | Merged after the built-in class, so your utilities win |

## States

| State | How to set it | Look |
| --- | --- | --- |
| Rest | | 14px, medium weight |
| Disabled (peer) | A preceding control with `class="peer"` and `disabled` | 50% opacity, not-allowed cursor |
| Disabled (group) | A parent with `class="group"` and `data-disabled="true"` | 50% opacity, no pointer events |

The `Disabled` story shows both.

## Gaps against industry standards

- TODO: **Nothing checks that `htmlFor` is set.** A Label with no `htmlFor` that doesn't wrap its control names nothing.
- TODO: **There is no required or optional marker.** Add "(optional)" to the text yourself.

## Tokens used

Label sets no colour of its own. It inherits the text colour of its container, usually `--foreground`.

## Example

A label that focuses its Input, from the `WithInput` story in `Label.stories.tsx`:

```tsx
import { Input, Label } from "lab-ds"

<div className="grid w-64 gap-2">
  <Label htmlFor="label-email">Email</Label>
  <Input id="label-email" type="email" />
</div>
```

## Class names

The built CSS scopes the root class to `lds-Label-root`. Consumers may target it, so renaming it is a breaking change.

## Storybook

Stories are in `apps/storybook/src/stories/Label.stories.tsx`. Keep their `argTypes` in sync with the props above.
