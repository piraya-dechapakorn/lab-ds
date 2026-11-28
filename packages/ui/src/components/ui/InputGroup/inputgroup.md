# InputGroup

## Purpose

An Input or Textarea that shares one box with icons, short text or small buttons, such as a search icon, `https://` or a copy button.

## Import and use

**1. Set up once per app.** Install the package, then import its styles once, after Tailwind, in your global CSS file. The package README has the full setup.

```bash
pnpm add @piraya.d/ai_designsystem_lab
```

```css
@import "tailwindcss";
@import "@piraya.d/ai_designsystem_lab/styles.css";
```

**2. Import the parts you need** from `@piraya.d/ai_designsystem_lab`:

```tsx
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@piraya.d/ai_designsystem_lab"
```

**3. Build the group** from this structure. Use either `InputGroupInput` or `InputGroupTextarea`, and one or more addons:

```tsx
<InputGroup>
  <InputGroupInput aria-label="Search products" />
  <InputGroupAddon>
    <SearchIcon />
  </InputGroupAddon>
  <InputGroupAddon align="inline-end">
    <InputGroupButton size="icon-xs" aria-label="Clear search">
      <XIcon />
    </InputGroupButton>
  </InputGroupAddon>
</InputGroup>
```

The position comes from `align`, not from the order in the code. InputGroup is a client component. You can still import it into a React Server Component.

## When to use

- A well-known unit, symbol or prefix that belongs to the value, such as `https://`, `THB` or `kg` ([USWDS](https://designsystem.digital.gov/components/input-prefix-suffix/)).
- An icon that says what the box is for, such as a magnifying glass on a search box.
- One or two small actions on the value, such as copy, clear or show password.
- A message box with a toolbar below it, using `InputGroupTextarea` and a `block-end` addon.

## When not to use

| Situation | Use instead |
| --- | --- |
| A plain text box | **Input** |
| A unit people may not know, or an icon whose meaning isn't obvious | Put the words in the label or hint ([USWDS](https://designsystem.digital.gov/components/input-prefix-suffix/)) |
| The main action of a form, such as "Save" | A **Button** after the field |
| Several actions, or a menu, inside the box | TODO: no guidance yet. Atlassian warns that controls inside a text box cause focus problems ([Atlassian](https://atlassian.design/components/textfield/usage)) |

## Anatomy

| Part | Required | Content |
| --- | --- | --- |
| `InputGroup` | Yes | The box. It draws the background, border, focus ring and error ring for everything inside |
| `InputGroupInput` | One control | An **Input** without its own box |
| `InputGroupTextarea` | One control | A **Textarea** without its own box |
| `InputGroupAddon` | Yes, one or more | The area for an icon, text or buttons, placed by `align`. Clicking it, except on a button, focuses the input |
| `InputGroupText` | No | Muted text inside an addon, such as `https://` |
| `InputGroupButton` | No | A small **Button** inside an addon. It is `ghost` and `type="button"` by default, so it never submits the form by accident |

## Content guidance

- **Label:** give the control a visible label with **FieldLabel** whose `htmlFor` matches the `InputGroupInput`'s `id`, as in the `WithText` story.
- **Units:** use the short form (`THB`, `kg`, `%`), not the whole word. Screen readers don't reliably read addon text, so either repeat the unit in the label ("Price in baht") or link the addon text to the control with `aria-describedby`, as the `WithText` story does for `THB` ([USWDS](https://designsystem.digital.gov/components/input-prefix-suffix/)).
- **Icon buttons:** every button that shows only an icon needs an `aria-label` that names the action, such as "Copy link".
- **Accept what users type:** if someone types the prefix themselves, such as `https://`, accept it rather than showing an error ([GOV.UK](https://design-system.service.gov.uk/components/text-input/)).

## Behaviour

- **Focus:** the whole box shows the focus ring when the control inside has keyboard focus.
- **Clicking an addon:** clicking an icon or text addon moves focus into the input (see the `AddonFocusesInput` story). Clicking a button runs the button.
- **Invalid:** set `aria-invalid` on the control. The whole box turns red.
- **Disabled:** set `disabled` on the control and `data-disabled` on the `InputGroup`, which fades the addons.
- **Tab order:** each button inside the group is its own tab stop, after or before the input depending on its place in the code.

## Props and variants

`InputGroup` has no props of its own. It takes every `<div>` attribute, including `data-disabled`.

**`InputGroupAddon`**

| Prop | Values | Default | Use |
| --- | --- | --- | --- |
| `align` | `inline-start`, `inline-end`, `block-start`, `block-end` | `inline-start` | `inline-start` puts the addon before the value, `inline-end` after it. `block-start` puts it above the control, `block-end` below it, and the box grows taller |

**`InputGroupButton`**

| Prop | Values | Default | Use |
| --- | --- | --- | --- |
| `size` | `xs`, `sm`, `icon-xs`, `icon-sm` | `xs` | `xs` is 24px tall, `sm` 32px. `icon-*` sizes are square |
| `variant` | any **Button** variant | `ghost` | Use `default` for the one main action, such as Send |
| `type` | `button`, `submit`, `reset` | `button` | Set `submit` only for a search box whose button runs the search |

`InputGroupInput` and `InputGroupTextarea` take every **Input** and **Textarea** prop. `InputGroupText` has no props of its own.

## States

| State | How to set it | Look |
| --- | --- | --- |
| Rest | | Light grey box (`--input` at 50%), addons in `--muted-foreground` |
| Focus | Keyboard focus on the control | `--ring` border and 3px ring around the whole box |
| Invalid | `aria-invalid` on the control | `--destructive` border and ring around the whole box |
| Disabled | `disabled` on the control, `data-disabled` on `InputGroup` | Control and addons at 50% opacity |

The `States` story shows each one.

## Tokens used

| Token | Where |
| --- | --- |
| `--input` | Box background, at 50% opacity |
| `--muted-foreground` | Addon text and icons |
| `--ring` | Focus border, and the focus ring at 30% opacity |
| `--destructive` | Invalid border, and the invalid ring at 20% (40% in dark mode) |
| `--radius` | Corners: 2.6 × `--radius` (`4xl`) for one line, 2.2 × (`3xl`) with a `block-*` addon, 1.8 × (`2xl`) with a Textarea |

Buttons inside use **Button** tokens. Every token has a dark-mode value.

## Gaps against industry standards

These come from comparing the component with USWDS, GOV.UK and Atlassian. None of them has been changed in the code.

- TODO: **Addon text is not tied to the control.** Screen readers may skip `https://` or `THB`, so the meaning must also be in the label or in `aria-describedby`.
- TODO: **Icons in addons are not hidden from screen readers.** Decorative icons should get `aria-hidden`. lucide-react icons already render with `aria-hidden="true"`; check icons from other sets.
- TODO: **Prefixes sit inside the box.** GOV.UK puts them outside, so they can't clash with browser icons such as password managers.
- TODO: **Disabled needs two attributes.** `disabled` on the control doesn't fade the addons on its own.

## Example

A share link with a copy button, from the `WithButton` story in `InputGroup.stories.tsx`:

```tsx
import { Copy } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@piraya.d/ai_designsystem_lab"

<InputGroup>
  <InputGroupInput
    aria-label="Share link"
    defaultValue="https://lab-ds.dev/p/42"
    readOnly
  />
  <InputGroupAddon align="inline-end">
    <InputGroupButton size="icon-xs" aria-label="Copy link">
      <Copy />
    </InputGroupButton>
  </InputGroupAddon>
</InputGroup>
```

## Class names

The built CSS scopes these classes. Consumers may target them, so renaming one is a breaking change.

| Part | Class |
| --- | --- |
| `InputGroup` | `lds-InputGroup-root` |
| `InputGroupAddon` | `lds-InputGroup-addon` |
| `InputGroupButton` | `lds-InputGroup-button` |
| `InputGroupText` | `lds-InputGroup-text` |
| `InputGroupInput`, `InputGroupTextarea` | `lds-InputGroup-control` |
| `InputGroupTextarea` | `lds-InputGroup-textarea` |

## Storybook

Stories are in `apps/storybook/src/stories/InputGroup.stories.tsx`. Keep their `argTypes` in sync with the props above.
