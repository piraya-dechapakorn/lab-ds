# Checkbox

## Purpose

A box the user ticks to turn one option on or off, or to pick any number of options from a list. Built on the Base UI [`Checkbox`](https://base-ui.com/react/components/checkbox) primitive.

## Import and use

**1. Set up once per app.** Install the package, then import its styles once, after Tailwind, in your global CSS file. The package README has the full setup.

```bash
pnpm add lab-ds
```

```css
@import "tailwindcss";
@import "lab-ds/styles.css";
```

**2. Import the parts you need** from `lab-ds`:

```tsx
import { Checkbox, Field, FieldLabel } from "lab-ds"
```

**3. Pair the checkbox with a label** in a horizontal `Field`:

```tsx
<Field orientation="horizontal">
  <Checkbox id="terms" />
  <FieldLabel htmlFor="terms">Accept terms and conditions</FieldLabel>
</Field>
```

Checkbox is a client component. You can still import it into a React Server Component.

## Files

| File | Purpose |
| --- | --- |
| `Checkbox.tsx` | `Checkbox` component and its props type |
| `Checkbox.module.css` | Styles, in `@layer components.primitive` |
| `index.ts` | Re-exports `./Checkbox` |

## When to use

- **One option that the user turns on or off,** and that takes effect when a form is submitted, such as "Remember me".
- **Picking any number of options from a list.**

## When not to use

| Situation | Use instead |
| --- | --- |
| Exactly one option from a list | TODO: the library has no radio group yet |
| A setting that takes effect immediately | TODO: the library has no switch yet |
| One option from a long list | **Select** |

## Anatomy

| Part | Content |
| --- | --- |
| Box | A 16px rounded square. Unchecked it has a light `input` fill; checked or indeterminate it fills with `primary` |
| Indicator | A check icon when checked, a minus icon when indeterminate. Hidden when unchecked |
| Hit area | An invisible area 12px wider on each side and 8px taller above and below, so the touch target is 40 × 32px |

Base UI renders the box as a `<span role="checkbox">` beside a hidden `<input type="checkbox">`, so it works in native forms.

## Props and variants

There are no visual variants and no sizes.

`CheckboxProps` = Base UI `Checkbox.Root.Props`.

| Prop | Type | Default | Use |
| --- | --- | --- | --- |
| `checked` | `boolean` | | Controlled checked state |
| `defaultChecked` | `boolean` | `false` | Checked state on first render |
| `onCheckedChange` | `(checked, details) => void` | | Called when the user ticks or unticks it |
| `indeterminate` | `boolean` | `false` | Shows the minus icon, e.g. for a "select all" box when only some items are checked |
| `disabled` | `boolean` | `false` | Blocks interaction and dims the box |
| `readOnly` | `boolean` | `false` | Keeps the value but blocks changes |
| `required` | `boolean` | `false` | Must be checked before the form submits |
| `name` / `value` | `string` | | Sent with the form |
| `aria-invalid` | `boolean` | | Shows the error style |
| `className` | `string \| (state) => string` | | Merged after the module class with `mergeClassName`, so consumer utilities win |

All other Base UI Checkbox.Root props pass through.

## States

| Attribute | Effect |
| --- | --- |
| `:focus-visible` | `ring` coloured border and a 3px ring |
| `data-checked` | `primary` fill and border, `primary-foreground` check icon |
| `data-indeterminate` | Same fill as checked, with a minus icon |
| `data-unchecked` | `input` fill, no icon |
| `data-disabled` | 50% opacity and a not-allowed cursor |
| `aria-invalid="true"` | `destructive` border and ring. When also checked, the border stays `primary` |
| Inside a `Field` that has a disabled control | 50% opacity |
| Inside a `FieldLabel` that has keyboard focus | No ring on the box, since the label draws the focus ring |
| `.dark` on an ancestor | Invalid border and ring use stronger `destructive` tints |

## Data attributes

| Part | Attributes |
| --- | --- |
| Box | `data-slot="checkbox"`, plus Base UI's `data-checked`, `data-unchecked`, `data-indeterminate`, `data-disabled`, `data-readonly`, `data-required`, `data-invalid`, `data-dirty`, `data-touched`, `data-focused` |
| Indicator | `data-slot="checkbox-indicator"`, plus the same state attributes |

## Tokens used

| Token | Where |
| --- | --- |
| `--input` | Unchecked fill (90%) |
| `--primary` | Checked and indeterminate fill and border |
| `--primary-foreground` | Icon colour |
| `--ring` | Focus border and ring |
| `--destructive` | Invalid border and ring |

## Public class names

The built CSS scopes the classes to these names. Consumers may target them, so renaming one is a breaking change.

| Part | Class |
| --- | --- |
| Box | `lds-Checkbox-root` |
| Indicator | `lds-Checkbox-indicator` |
| Check icon | `lds-Checkbox-check` |
| Minus icon | `lds-Checkbox-minus` |

## Example

A "select all" checkbox that goes indeterminate when only some items are checked, from the `Select all` story in `Checkbox.stories.tsx`:

```tsx
function SelectAll() {
  const [checked, setChecked] = React.useState<string[]>(["email"])
  const all = OPTIONS.every((o) => checked.includes(o.value))
  const some = checked.length > 0 && !all

  return (
    <FieldGroup>
      <Field orientation="horizontal">
        <Checkbox
          id="all"
          checked={all}
          indeterminate={some}
          onCheckedChange={(on) => setChecked(on ? OPTIONS.map((o) => o.value) : [])}
        />
        <FieldLabel htmlFor="all">All notifications</FieldLabel>
      </Field>
      {OPTIONS.map((o) => (
        <Field key={o.value} orientation="horizontal">
          <Checkbox
            id={o.value}
            checked={checked.includes(o.value)}
            onCheckedChange={(on) =>
              setChecked((prev) =>
                on ? [...prev, o.value] : prev.filter((v) => v !== o.value)
              )
            }
          />
          <FieldLabel htmlFor={o.value}>{o.label}</FieldLabel>
        </Field>
      ))}
    </FieldGroup>
  )
}
```

## Storybook

Stories are in `apps/storybook/src/stories/Checkbox.stories.tsx`. Keep their `argTypes` in sync with the props above.
