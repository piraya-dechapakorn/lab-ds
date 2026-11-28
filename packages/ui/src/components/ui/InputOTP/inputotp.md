# InputOTP

## Purpose

A row of character boxes for a short one-time code, such as a 6-digit verification code sent by text message.

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
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@piraya.d/ai_designsystem_lab"
```

**3. Build the code input** from this structure. Render one `InputOTPSlot` per character, numbered from 0, and set `maxLength` to the same number:

```tsx
<InputOTP maxLength={6} aria-label="Verification code">
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
  </InputOTPGroup>
  <InputOTPSeparator />
  <InputOTPGroup>
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>
```

InputOTP is a client component. You can still import it into a React Server Component.

## When to use

- A one-time code the user copies from a text message, an email or an authenticator app.
- A short numeric PIN with a fixed length.

## When not to use

| Situation | Use instead |
| --- | --- |
| A password, or any code with no fixed length | **Input** with `type="password"` |
| A long reference number, such as an order number | **Input** with `inputMode="numeric"` |
| A code users rarely type and mostly paste, such as a recovery key | **Input** |

## Anatomy

| Part | Required | Content |
| --- | --- | --- |
| `InputOTP` | Yes | Holds the value. It renders one real, invisible text box over the slots, so typing, pasting and phone autofill all go into one field |
| `InputOTPGroup` | Yes | A run of joined slots with rounded ends |
| `InputOTPSlot` | Yes | Shows one character. The active slot gets a focus ring and a blinking caret |
| `InputOTPSeparator` | No | A dash between two groups, for codes read in chunks such as 123-456 |

## Content guidance

- **Label:** give the code a visible label, such as "Verification code", in a **FieldLabel** whose `htmlFor` matches the InputOTP's `id`. Without a visible label, set `aria-label`.
- **Hint:** say where the code was sent and how long it is, such as "We sent a 6-digit code to 081 234 5678."
- **Resend:** offer a "Send a new code" link or button next to the field. TODO: agree how long codes last and when resend becomes available ([GOV.UK](https://design-system.service.gov.uk/patterns/confirm-a-phone-number/)).
- **Error messages:** name the problem and what to do, for example "That code is wrong. Check the latest text message and try again." or "That code has expired. We've sent a new one."
- **Submit:** keep a submit button. Don't submit automatically from `onComplete` unless the user can clearly see the result and try again, because a mistyped code would be sent before the user can check it.

## Behaviour

- **One field:** screen readers and the keyboard treat the whole code as one text box with one label and one tab stop.
- **Typing:** each character fills the next slot. Backspace clears the last one.
- **Pasting:** pasting the whole code fills every slot at once (see the `PasteCode` story).
- **Phone autofill:** the text box has `autocomplete="one-time-code"` and `inputmode="numeric"` by default, so phones offer the code from a text message and show a number pad.
- **`pattern`:** only characters that match it are accepted. With digits only, typed letters are ignored (see the `DigitsOnly` story).
- **`onComplete`:** called with the code once every slot is filled.

## Props and variants

There are no visual variants and no sizes. Each slot is 36px square.

**`InputOTP`**

| Prop | Values | Default | Use |
| --- | --- | --- | --- |
| `maxLength` | number | required | How many characters the code has |
| `pattern` | regular expression, as a string | | Characters allowed. Use `"^\\d+$"` for digits only |
| `value` | string | | The code, from your own state |
| `defaultValue` | string | | The starting code |
| `onChange` | function | | Called with the new code (a string) |
| `onComplete` | function | | Called with the code once every slot is filled |
| `disabled` | `true`, `false` | `false` | Fades the whole row and blocks typing |
| `inputMode` | `numeric`, `text`, … | `numeric` | Which keyboard phones show. Use `text` for codes with letters |
| `autoComplete` | string | `one-time-code` | Lets phones offer a code from a text message |
| `pasteTransformer` | function | | Cleans pasted text before it is checked, e.g. removes spaces or dashes |
| `containerClassName` | string | | Class for the row of slots |
| `className` | string | | Class for the invisible text box |

Any other `<input>` attribute, such as `id`, `name`, `aria-label` or `aria-describedby`, goes on the invisible text box.

**`InputOTPSlot`**

| Prop | Values | Default | Use |
| --- | --- | --- | --- |
| `index` | number | required | Which character this slot shows, counted from 0 |
| `aria-invalid` | `true`, `false` | | Red border on the slot. Set it on every slot to mark the code as wrong |

`InputOTPGroup` and `InputOTPSeparator` have no props of their own.

## States

| State | How to set it | Attribute the CSS styles | Look |
| --- | --- | --- | --- |
| Empty | | | Light grey slots |
| Active | Set by the component on the slot the next character goes into, while the field has focus. When every slot is filled, the last slot is active | `data-active="true"` on `InputOTPSlot` | `--ring` border and ring (30%), raised above its neighbours, and a blinking caret when empty |
| Filled | | | The character, centred |
| Invalid | `aria-invalid` on each `InputOTPSlot` | `aria-invalid="true"` on `InputOTPSlot`, and `InputOTPGroup` when it contains one | `--destructive` borders, and a red ring around the group (20%, or 40% in dark mode) |
| Active and invalid | The active slot of an invalid code | `data-active="true"` and `aria-invalid="true"` on `InputOTPSlot` | `--destructive` border with a `--destructive` ring (20%, or 40% in dark mode) instead of the `--ring` one |
| Disabled | `disabled` on `InputOTP` | `:disabled` on the invisible text box | The whole row at 50% opacity, with a not-allowed cursor |

The `States` story shows each one except active and invalid, which you see by focusing the field in the `Invalid` story. Only one field can have focus at a time, so the `States` story's `play` function focuses the `active` row.

## Tokens used

| Token | Where |
| --- | --- |
| `--input` | Slot borders, and the slot background at 50% opacity |
| `--ring` | Border and ring (30% opacity) of the active slot |
| `--destructive` | Invalid slot borders and group ring (20%, or 40% in dark mode) |
| `--foreground` | The blinking caret |
| `--radius` | Rounded ends of each group (2.2 × `--radius`, the `3xl` step) |

Every token has a dark-mode value.

## Gaps against industry standards

These come from comparing the component with GOV.UK, web.dev, WCAG 2.2 and the `input-otp` library. None of them has been changed in the code.

- TODO: **Pasted codes with a dash or space are rejected** when `pattern` is digits only. Users may paste "123-456" because of the separator. Add a `pasteTransformer` that removes them ([GOV.UK](https://design-system.service.gov.uk/patterns/confirm-a-phone-number/)).
- TODO: **Slot borders are faint in light mode.** `--input` is close to the slot background, so filled slots look borderless (see the `States` story). Check the 3:1 contrast that WCAG 1.4.11 asks for.
- TODO: **`aria-invalid` lives on the slots, not on the field.** Screen readers only hear it if you also set `aria-invalid` on `InputOTP`, as the `Invalid` story does.
- TODO: **Separate boxes are not universal.** GOV.UK uses one ordinary text box for security codes. Boxed codes are common, and this one stays one real field, but confirm the choice with the team.

## Example

A wrong code with its error, from the `Invalid` story in `InputOTP.stories.tsx`:

```tsx
import {
  Field,
  FieldError,
  FieldLabel,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@piraya.d/ai_designsystem_lab"

<Field className="w-auto" data-invalid>
  <FieldLabel htmlFor="otp-invalid">Verification code</FieldLabel>
  <InputOTP
    maxLength={6}
    pattern="^\d+$"
    defaultValue="123456"
    id="otp-invalid"
    aria-invalid
    aria-describedby="otp-invalid-error"
  >
    <InputOTPGroup>
      {Array.from({ length: 6 }, (_, i) => (
        <InputOTPSlot key={i} index={i} aria-invalid />
      ))}
    </InputOTPGroup>
  </InputOTP>
  <FieldError id="otp-invalid-error">
    That code is wrong. Check the latest text message and try again.
  </FieldError>
</Field>
```

## Class names

The built CSS scopes these classes. Consumers may target them, so renaming one is a breaking change.

| Part | Class |
| --- | --- |
| Row of slots | `lds-InputOTP-container` |
| Invisible text box | `lds-InputOTP-input` |
| `InputOTPGroup` | `lds-InputOTP-group` |
| `InputOTPSlot` | `lds-InputOTP-slot` |
| Caret | `lds-InputOTP-caret`, `lds-InputOTP-caretBar` |
| `InputOTPSeparator` | `lds-InputOTP-separator` |

## Storybook

Stories are in `apps/storybook/src/stories/InputOTP.stories.tsx`. Keep their `argTypes` in sync with the props above.
