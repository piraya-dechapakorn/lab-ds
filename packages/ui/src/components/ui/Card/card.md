# Card

## Purpose

A raised surface that groups related content and actions about one subject, such as a settings section, a summary or a sign-in form.

## Import and use

**1. Set up once per app.** Install the package, then import its styles once, after Tailwind, in your global CSS file. The package README has the full setup.

```bash
pnpm add @piraya.d/ai_designsystem_lab
```

```css
@import "tailwindcss";
@import "@piraya.d/ai_designsystem_lab/styles.css";
```

Card titles use the `--font-heading` font variable, which your app sets.

**2. Import the parts you need** from `@piraya.d/ai_designsystem_lab`:

```tsx
import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@piraya.d/ai_designsystem_lab"
```

**3. Build the card** from this structure. Give the card a width, or put it in a container that has one (see Anatomy):

```tsx
<Card className="w-full max-w-sm">
  <CardHeader>
    <CardTitle>Notifications</CardTitle>
    <CardDescription>Choose what we email you about.</CardDescription>
    <CardAction>
      <Button variant="ghost" size="sm">Edit</Button>
    </CardAction>
  </CardHeader>
  <CardContent>{/* Body */}</CardContent>
  <CardFooter>
    <Button>Save</Button>
  </CardFooter>
</Card>
```

Card has no `"use client"`. It renders in React Server Components.

## Files

| File | Purpose |
| --- | --- |
| `Card.tsx` | `Card` and its parts, plus types |
| `Card.module.css` | Styles, in `@layer components.primitive` |
| `index.ts` | Re-exports `./Card` |

## When to use

- **Grouping one subject.** Each card covers one thing, such as one plan, one account setting or one summary.
- **A form or panel that sits on the page,** such as a sign-in box.

## When not to use

| Situation | Use instead |
| --- | --- |
| A product in a shop grid | **ProductCard** |
| A message about the page | **Alert** |
| A task that must be finished before going back to the page | **Dialog** |
| Rows of the same kind of data | **Table** |

## Anatomy

| Part | Required | Content |
| --- | --- | --- |
| `Card` | Yes | The surface: `card` background, a 1px ring, a medium shadow and rounded corners. Children stack vertically with a gap equal to the card's spacing. The card takes its width from its container: `CardHeader` is a size container (`@container/card-header`), so it adds no width of its own, and in a shrink-to-fit parent (a flex item, `w-fit`) the card collapses. Set a width, such as `w-full max-w-sm` |
| `CardHeader` | No | A grid that holds the title, description and action |
| `CardTitle` | No | The heading, in `--font-heading`, base size, medium weight. A `div`, so give it a heading role or wrap a heading if the page needs one |
| `CardDescription` | No | Supporting text in a muted colour |
| `CardAction` | No | A control in the header's top-right corner. It spans the title and description rows |
| `CardContent` | No | The body, with side padding |
| `CardFooter` | No | A row of actions along the bottom |
| Image | No | An `<img>` as the first child sits flush with the top edge (the card drops its top padding), and as the last child it sits flush with the bottom edge |

## Props and variants

There are no visual variants.

**`Card`**

| Prop | Type | Default | Use |
| --- | --- | --- | --- |
| `size` | `CardSize` (`"default"` \| `"sm"`) | `"default"` | Spacing scale for padding and gaps |
| `className` | `string` | | Merged after the module class with `cn`, so consumer utilities win |

All parts accept the props of a native `div`.

### `size`

| Value | Spacing (`--card-spacing`) |
| --- | --- |
| `default` | `--spacing(6)`, 24px |
| `sm` | `--spacing(4)`, 16px |

The spacing is the card's vertical padding, the gap between parts and the side padding of the header, content and footer.

## States

Card is not interactive, so it has no focus, hover or disabled styles. It reacts to its content:

| Condition | Effect |
| --- | --- |
| `data-size="sm"` | Smaller spacing |
| `<img>` is the first child | No top padding; the image takes the top corners |
| `<img>` is the last child | The image takes the bottom corners |
| `CardHeader` contains a `CardAction` | Header becomes two columns, with the action on the right |
| `CardHeader` contains a `CardDescription` | Header becomes two rows |
| `CardHeader` has the class `border-b` | Spacing below the border |
| `CardFooter` has the class `border-t` | Spacing above the border |
| `.dark` on an ancestor | The ring goes from 5% to 10% `foreground` |

## Data attributes

| Part | Attributes |
| --- | --- |
| `Card` | `data-slot="card"`, `data-size` |
| `CardHeader` | `data-slot="card-header"` |
| `CardTitle` | `data-slot="card-title"` |
| `CardDescription` | `data-slot="card-description"` |
| `CardAction` | `data-slot="card-action"` |
| `CardContent` | `data-slot="card-content"` |
| `CardFooter` | `data-slot="card-footer"` |

## Tokens used

| Token | Where |
| --- | --- |
| `--card` | Background |
| `--card-foreground` | Text |
| `--foreground` | Ring (5%, 10% in dark mode) |
| `--muted-foreground` | Description text |
| `--radius` | Corner radius (2.6 × `--radius`, the `4xl` step) |
| `--font-heading` | Title font |

## Public class names

The built CSS scopes the classes to these names. Consumers may target them, so renaming one is a breaking change.

| Part | Class |
| --- | --- |
| `Card` | `lds-Card-root` |
| `CardHeader` | `lds-Card-header` |
| `CardTitle` | `lds-Card-title` |
| `CardDescription` | `lds-Card-description` |
| `CardAction` | `lds-Card-action` |
| `CardContent` | `lds-Card-content` |
| `CardFooter` | `lds-Card-footer` |

## Example

A sign-in card, from the `SignIn` story in `Card.stories.tsx`:

```tsx
<Card className="w-full max-w-sm">
  <CardHeader>
    <CardTitle>Sign in</CardTitle>
    <CardDescription>Use the email you signed up with.</CardDescription>
    <CardAction>
      <Button variant="link" size="sm">Sign up</Button>
    </CardAction>
  </CardHeader>
  <CardContent>
    <Field>
      <FieldLabel htmlFor="card-email">Email</FieldLabel>
      <Input id="card-email" type="email" placeholder="you@example.com" />
    </Field>
  </CardContent>
  <CardFooter>
    <Button className="w-full">Sign in</Button>
  </CardFooter>
</Card>
```

## Storybook

Stories are in `apps/storybook/src/stories/Card.stories.tsx`. Keep their `argTypes` in sync with the props above.
