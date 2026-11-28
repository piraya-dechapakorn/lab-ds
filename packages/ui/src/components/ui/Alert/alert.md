# Alert

## Purpose

An inline message box that calls attention to important information on the page.

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
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@piraya.d/ai_designsystem_lab"
```

**3. Build the alert** from this structure. Every part inside `Alert` is optional:

```tsx
<Alert>
  <Info /> {/* optional icon, e.g. from lucide-react */}
  <AlertTitle>Your plan renews on 1 December</AlertTitle>
  <AlertDescription>
    We will charge the card on file. You can change plans at any time.
  </AlertDescription>
  <AlertAction>{/* optional: one small button */}</AlertAction>
</Alert>
```

Alert works in React Server Components.

## When to use

- A message that relates to the page or section it sits in, and stays visible until the content changes. Examples: a form failed to save, or an account needs attention.
- An error the user should notice right away. Use the `destructive` variant.
- A message with one follow-up action, such as "Retry" or "Dismiss". Put the action in the action slot.

TODO: confirm product guidance on which messages deserve an Alert (for example, should success confirmations use it?).

## When not to use

- Static help text or hints that are always present. Every Alert is announced to screen readers as soon as it appears, so constant content creates noise. Use plain text or a field description instead.
- A message that blocks the user until they respond. Use **Dialog**.
- A short status label on an item, such as "New" or "Sold out". Use **Badge**.
- Brief, temporary feedback that disappears on its own. TODO: the library has no toast component yet, so there is no recommended pattern.

## Anatomy

| Part | Required | Content |
| --- | --- | --- |
| `Alert` | Yes | The container, which holds every other part |
| Icon | No | An icon placed first inside `Alert`. It sits to the left, and the title and description align beside it. Its default size is 16px |
| `AlertTitle` | No | One short line, in medium weight |
| `AlertDescription` | No | Supporting text in a muted colour. It may contain several paragraphs and links |
| `AlertAction` | No | One control, such as a small button, pinned to the top-right corner. The text leaves room for it |

Links inside the title or description are underlined.

## Props and variants

`Alert` has one prop of its own:

| Prop | Values | Default |
| --- | --- | --- |
| `variant` | `default`, `destructive` | `default` |

| Variant | Look | Use for |
| --- | --- | --- |
| `default` | Card background, standard text colour, muted description | Neutral or informational messages |
| `destructive` | Card background, red title, icon and description text | Errors and failed actions |

`AlertTitle`, `AlertDescription` and `AlertAction` have no props of their own. There are no size, success, warning or info variants.

## Tokens used

| Token | Where |
| --- | --- |
| `--card` | Background, both variants |
| `--card-foreground` | Text and icon, `default` variant |
| `--destructive` | Text and icon, `destructive` variant. The description uses it at 90% opacity |
| `--muted-foreground` | Description text, `default` variant |
| `--foreground` | Link colour on hover |
| `--border` | 1px outline |
| `--radius` | Corner radius (1.8 × `--radius`, the `2xl` step) |

Every token has a dark-mode value, so the Alert adapts when `.dark` is on.

## Example

An error after a failed payment, from the `Variants` story in `Alert.stories.tsx`:

```tsx
import { CircleAlert } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@piraya.d/ai_designsystem_lab"

<Alert variant="destructive">
  <CircleAlert />
  <AlertTitle>Unable to process your payment</AlertTitle>
  <AlertDescription>
    Check your card details and try again.
  </AlertDescription>
</Alert>
```
