# Field

## Purpose

The layout around a form control: its label, hint and error message, and the grouping of related controls into sections.

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
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
  Input,
} from "lab-ds"
```

**3. Build a form** from this structure. Each `Field` holds one control:

```tsx
<FieldSet>
  <FieldLegend>Shipping address</FieldLegend>
  <FieldGroup>
    <Field>
      <FieldLabel htmlFor="city">City</FieldLabel>
      <Input id="city" aria-describedby="city-hint" />
      <FieldDescription id="city-hint">Town or district</FieldDescription>
      <FieldError>{/* shown only when there is an error */}</FieldError>
    </Field>
  </FieldGroup>
</FieldSet>
```

Field is a client component. You can still import it into a React Server Component.

## When to use

- Around every **Input**, **Textarea**, **InputOTP** or **InputGroup** in a form, so the label, hint and error sit in the same place every time.
- `FieldSet` with a `FieldLegend` around related controls, such as the parts of an address, or a set of checkboxes or radio buttons ([WAI](https://www.w3.org/WAI/tutorials/forms/grouping/)).
- `FieldGroup` to space a list of fields, and to let `responsive` fields switch layout by the form's width.
- `FieldSeparator` between two ways of doing the same thing, such as "Continue with Google" and an email form.

## When not to use

| Situation | Use instead |
| --- | --- |
| An error about the whole form or page, such as "We couldn't save your changes" | **Alert** at the top of the form |
| A control with no form around it, such as a search box in a header | The control with an `aria-label` |
| A heading for a part of a page that isn't a form | A normal heading |

## Anatomy

| Part | Required | Content |
| --- | --- | --- |
| `Field` | Yes | Wraps one control with its label, hint and error. Screen readers treat it as a group |
| `FieldLabel` | Yes, for each control | The visible label. Its `htmlFor` must match the control's `id`. Clicking it focuses the control |
| Control | Yes | **Input**, **Textarea**, **InputOTP**, **InputGroup**, or a native checkbox or radio |
| `FieldDescription` | No | A hint in a muted colour. Links in it are underlined |
| `FieldError` | No | The error message in red. It renders nothing when it has no message |
| `FieldContent` | No | Stacks a label and description together beside a control in a `horizontal` Field |
| `FieldTitle` | No | Label-styled text for something that isn't a control, such as a summary row |
| `FieldGroup` | No | A vertical stack of Fields with 28px between them |
| `FieldSet` | No | A native fieldset for a section of related Fields |
| `FieldLegend` | No | The fieldset's heading. Screen readers read it as the name of the section |
| `FieldSeparator` | No | A horizontal line, with optional text such as "or" in the middle |

## Content guidance

- **Order:** label, control, hint, then error, as in the `Anatomy` story.
- **Labels:** short, in sentence case, no colon. Each label must make sense without its legend, because screen readers don't always read the legend ([WAI](https://www.w3.org/WAI/tutorials/forms/grouping/)).
- **Optional fields:** mark the optional ones with "(optional)" in the label, rather than marking required ones with an asterisk ([GOV.UK](https://design-system.service.gov.uk/patterns/question-pages/)). TODO: confirm this convention with the team.
- **Hints:** one short sentence on the format or why you ask.
- **Errors:** say what went wrong and how to fix it, using the label's words: "Username must be at least 3 characters", not "Invalid username" ([GOV.UK](https://design-system.service.gov.uk/components/error-message/)).
- **Legends:** keep them short. Use the `legend` variant for a section heading and the `label` variant when the group reads as one question.

## Behaviour

- **Linking hints and errors:** Field does not connect them for you. Give the hint and the error an `id`, and list both in the control's `aria-describedby`, so screen readers read them after the label (see the `Anatomy` story).
- **Marking an error:** set `data-invalid` on the Field to turn its label red, and `aria-invalid` on the control for its red border and so screen readers say it is invalid.
- **Disabled:** set `data-disabled` on the Field to fade its label, and `disabled` on the control.
- **Error announcements:** `FieldError` has `role="alert"`, so screen readers read the message as soon as it appears.
- **Duplicate errors:** `FieldError` with `errors` shows each message once. Two or more different messages become a bulleted list (see the `ErrorList` story).
- **Responsive layout:** a `responsive` Field stacks its label above the control until the surrounding `FieldGroup` is 448px wide, then puts them side by side. It responds to the group's width, not the screen's.

## Props and variants

**`Field`**

| Prop | Values | Default | Use |
| --- | --- | --- | --- |
| `orientation` | `vertical`, `horizontal`, `responsive` | `vertical` | `vertical` puts the label above the control. `horizontal` puts it beside the control, for checkboxes, switches and buttons. `responsive` switches by the FieldGroup's width |
| `data-invalid` | `true`, `false` | | Turns the label and text red |
| `data-disabled` | `true`, `false` | | Fades the label and title to 50% |

**`FieldLegend`**

| Prop | Values | Default | Use |
| --- | --- | --- | --- |
| `variant` | `legend`, `label` | `legend` | `legend` is 16px, a section heading. `label` is 14px, the same size as a label |

**`FieldError`**

| Prop | Values | Default | Use |
| --- | --- | --- | --- |
| `errors` | list of `{ message }` | | Messages from a form library such as react-hook-form. Duplicates are shown once |
| `children` | text | | A message written directly. It wins over `errors` |

**`FieldSeparator`**

| Prop | Values | Default | Use |
| --- | --- | --- | --- |
| `children` | text | | Optional text in the middle of the line, such as "or" |

`FieldLabel` takes every **Label** prop. `FieldSet`, `FieldGroup`, `FieldContent`, `FieldTitle` and `FieldDescription` have no props of their own.

## States

| State | How to set it | Look |
| --- | --- | --- |
| Rest | | Label in `--foreground`, hint in `--muted-foreground` |
| Invalid | `data-invalid` on `Field` | Label and text in `--destructive`. Pair it with `aria-invalid` on the control |
| Disabled | `data-disabled` on `Field` | Label and title at 50% opacity. Pair it with `disabled` on the control |
| Choice card | A `FieldLabel` that wraps a whole `Field` | A bordered card that highlights on hover, keyboard focus and when its control is checked. TODO: built for checkbox and radio components the library doesn't have yet |

The `States` story shows the first three.

## Tokens used

| Token | Where |
| --- | --- |
| `--foreground` | Label, title and legend text |
| `--muted-foreground` | Description text, and the text on a FieldSeparator |
| `--destructive` | Error text, and all text in an invalid Field |
| `--link` | Link colour in a description, on hover |
| `--border` | FieldSeparator line, and the outline of a choice card |
| `--background` | Behind the FieldSeparator text, so the line stops at it |
| `--input` | Choice card background on hover (40%) and when checked (30%) |
| `--ring` | Choice card border and ring on keyboard focus |
| `--radius` | Choice card corners (1.8 × `--radius`, the `2xl` step) |

Every token has a dark-mode value.

## Gaps against industry standards

These come from comparing the component with GOV.UK, WAI, Carbon, Atlassian and CMS. None of them has been changed in the code.

- TODO: **Hints and errors are not linked automatically.** Every consumer has to add `id`s and `aria-describedby` by hand. Base UI's Field does this for you and could replace it.
- TODO: **`role="alert"` on every error can be noisy.** When several fields fail on submit, screen readers read every alert in a row. GOV.UK uses an error summary at the top of the form instead. The sources disagree: CMS uses `role="alert"`, GOV.UK and Atlassian don't.
- TODO: **There is no "Error:" prefix for screen readers.** GOV.UK adds hidden "Error:" text before each message so it isn't confused with a hint.
- TODO: **There is no error summary component.** GOV.UK lists all errors at the top of the form, linked to each field.
- TODO: **`data-invalid` and `aria-invalid` are set separately.** Nothing keeps them in step.

## Example

A field with a hint and an error, from the `Anatomy` story in `Field.stories.tsx`:

```tsx
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Input,
} from "lab-ds"

<Field data-invalid>
  <FieldLabel htmlFor="field-username">Username</FieldLabel>
  <Input
    id="field-username"
    defaultValue="pi"
    aria-invalid
    aria-describedby="field-username-hint field-username-error"
  />
  <FieldDescription id="field-username-hint">
    3 to 20 letters or numbers. Shown on your public profile.
  </FieldDescription>
  <FieldError id="field-username-error">
    Username must be at least 3 characters
  </FieldError>
</Field>
```

## Class names

The built CSS scopes these classes. Consumers may target them, so renaming one is a breaking change.

| Part | Class |
| --- | --- |
| `FieldSet` | `lds-Field-set` |
| `FieldLegend` | `lds-Field-legend` |
| `FieldGroup` | `lds-Field-group` |
| `Field` | `lds-Field-field` |
| `FieldContent` | `lds-Field-content` |
| `FieldLabel` | `lds-Field-label` |
| `FieldTitle` | `lds-Field-title` |
| `FieldDescription` | `lds-Field-description` |
| `FieldSeparator` | `lds-Field-separator`, `lds-Field-separatorLine`, `lds-Field-separatorContent` |
| `FieldError` | `lds-Field-error`, and `lds-Field-errorList` for the list |

## Storybook

Stories are in `apps/storybook/src/stories/Field.stories.tsx`. Keep their `argTypes` in sync with the props above.
