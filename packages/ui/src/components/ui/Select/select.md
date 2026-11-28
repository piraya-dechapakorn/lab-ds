# Select

## Purpose

A button that opens a list of options and shows the one the user picked. Built on the Base UI [`Select`](https://base-ui.com/react/components/select) primitive.

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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@piraya.d/ai_designsystem_lab"
```

**3. Build the select** from this structure:

```tsx
<Select items={FRUITS}>
  <SelectTrigger aria-label="Fruit">
    <SelectValue placeholder="Pick a fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Fruit</SelectLabel>
      {FRUITS.map((fruit) => (
        <SelectItem key={fruit.value} value={fruit.value}>
          {fruit.label}
        </SelectItem>
      ))}
    </SelectGroup>
  </SelectContent>
</Select>
```

`items` is a list of `{ value, label }` objects. Select uses it to show the label of the picked value in `SelectValue`. Without it, `SelectValue` shows the raw value.

Select is a client component. You can still import it into a React Server Component.

## Files

| File | Purpose |
| --- | --- |
| `Select.tsx` | `Select` and its parts, plus types |
| `Select.module.css` | Styles, in `@layer components.primitive` |
| `index.ts` | Re-exports `./Select` |

## When to use

- **Picking one option from a list of about 5 to 15,** where showing every option at once would take too much space.

## When not to use

| Situation | Use instead |
| --- | --- |
| Two to four options that the user should compare | TODO: the library has no radio group yet |
| Picking several options | **Checkbox**, one per option |
| A long list the user needs to search | TODO: the library has no combobox yet |
| Free text | **Input** |

## Anatomy

| Part | Required | Content |
| --- | --- | --- |
| `Select` | Yes | Holds the value and open state. It draws nothing itself |
| `SelectTrigger` | Yes | A rounded button with an `input` fill and a chevron icon on the right. Its width fits its content |
| `SelectValue` | Yes | The picked option's label, or the placeholder in a muted colour. Long labels are cut to one line |
| `SelectContent` | Yes | The popup list. By default it opens over the trigger with the picked item lined up on it. It is as wide as the trigger (144px minimum), as tall as the screen allows, and scrolls inside |
| `SelectGroup` | No | Groups items, with padding |
| `SelectLabel` | No | A small muted heading for a group |
| `SelectItem` | Yes | One option, with a check icon on the right when it is picked |
| `SelectSeparator` | No | A 1px line between groups |
| Scroll arrows | Automatic | Arrows at the top and bottom of the list when it overflows. Hovering them scrolls the list |

## Props and variants

There are no visual variants.

**`Select`** (Base UI `Select.Root`)

| Prop | Type | Default | Use |
| --- | --- | --- | --- |
| `items` | `{ value, label }[]` or a value-to-label record | | Lets `SelectValue` show labels |
| `value` | value | | Controlled value |
| `defaultValue` | value | `null` | Value on first render |
| `onValueChange` | `(value, details) => void` | | Called when the user picks an option |
| `open` / `defaultOpen` / `onOpenChange` | | | Open state |
| `disabled` | `boolean` | `false` | Blocks the whole select |
| `required` | `boolean` | `false` | Must have a value before the form submits |
| `name` | `string` | | Sent with the form |
| `multiple` | `boolean` | `false` | Lets the user pick several items |

**`SelectTrigger`**

| Prop | Type | Default | Use |
| --- | --- | --- | --- |
| `size` | `SelectTriggerSize` (`"default"` \| `"sm"`) | `"default"` | Height |
| `aria-invalid` | `boolean` | | Shows the error style |
| `className` | `string \| (state) => string` | | Merged after the module class with `mergeClassName` |

**`SelectValue`**

| Prop | Type | Default | Use |
| --- | --- | --- | --- |
| `placeholder` | `ReactNode` | | Shown when nothing is picked |

**`SelectContent`**

| Prop | Type | Default | Use |
| --- | --- | --- | --- |
| `alignItemWithTrigger` | `boolean` | `true` | Opens over the trigger, lined up on the picked item. `false` opens below the trigger like a menu |
| `side` | `"top"` \| `"bottom"` \| `"left"` \| `"right"` \| `"inline-start"` \| `"inline-end"` | `"bottom"` | Side of the trigger when `alignItemWithTrigger` is `false` |
| `sideOffset` | `number` | `4` | Gap from the trigger, in px |
| `align` | `"start"` \| `"center"` \| `"end"` | `"center"` | Alignment along the trigger |
| `alignOffset` | `number` | `0` | Shift along the trigger, in px |

**`SelectItem`**

| Prop | Type | Default | Use |
| --- | --- | --- | --- |
| `value` | value | | The value this option sets |
| `disabled` | `boolean` | `false` | Dims the option and blocks it |
| `label` | `string` | | Text used for type-ahead when the children are not plain text |

### `size`

| Value | Height |
| --- | --- |
| `sm` | `h-8` |
| `default` | `h-9` |

## States

| Part | Attribute | Effect |
| --- | --- | --- |
| Trigger | `:focus-visible` | `ring` coloured border and a 3px ring |
| Trigger | `data-placeholder` | Muted text while nothing is picked |
| Trigger | `data-disabled` | 50% opacity and a not-allowed cursor |
| Trigger | `aria-invalid="true"` | `destructive` border and ring, stronger in dark mode |
| Content | `data-open` / `data-closed` | Fades and zooms in and out |
| Content | `data-side` | Slides in from the trigger's side, only when `alignItemWithTrigger` is `false` |
| Content | `data-align-trigger="true"` | No open animation, so the list appears in place over the trigger |
| Item | `:focus` / `data-highlighted` | `accent` background and `accent-foreground` text, for the pointer or the arrow keys |
| Item | `data-selected` | The check icon shows |
| Item | `data-disabled` | 50% opacity, no pointer events |

## Behaviour

- **Opening:** click the trigger, or press Enter, Space, Arrow Down or Arrow Up while it has focus.
- **While open:** the arrow keys move through items, typing a letter jumps to a matching item, Enter picks it, and Escape closes the list without changing the value.
- **Closing:** focus returns to the trigger.
- **Accessible name:** give the trigger an `aria-label`, or put the select in a `Field` with a `FieldLabel`.

## Data attributes

| Part | Attributes |
| --- | --- |
| `SelectTrigger` | `data-slot="select-trigger"`, `data-size`, plus Base UI's `data-popup-open`, `data-placeholder`, `data-disabled` and field state attributes |
| `SelectValue` | `data-slot="select-value"` |
| `SelectContent` | `data-slot="select-content"`, `data-align-trigger`, plus Base UI's `data-open`, `data-closed`, `data-side`, `data-align` |
| `SelectGroup` | `data-slot="select-group"` |
| `SelectLabel` | `data-slot="select-label"` |
| `SelectItem` | `data-slot="select-item"`, plus Base UI's `data-selected`, `data-highlighted`, `data-disabled` |
| `SelectSeparator` | `data-slot="select-separator"` |
| Scroll arrows | `data-slot="select-scroll-up-button"` / `"select-scroll-down-button"` |

## Tokens used

| Token | Where |
| --- | --- |
| `--input` | Trigger fill (50%) |
| `--muted-foreground` | Placeholder, chevron icon and group labels |
| `--ring` | Trigger focus border and ring |
| `--destructive` | Invalid border and ring |
| `--popover` / `--popover-foreground` | List background and text |
| `--foreground` | Ring around the list (5%, 10% in dark mode) |
| `--accent` / `--accent-foreground` | Highlighted item |
| `--border` | Separator |
| `--radius` | Corner radius of the trigger and list (`3xl`) and of items (`2xl`) |

## Public class names

The built CSS scopes the classes to these names. Consumers may target them, so renaming one is a breaking change.

| Part | Class |
| --- | --- |
| `SelectTrigger` | `lds-Select-trigger` |
| Trigger chevron | `lds-Select-icon` |
| `SelectValue` | `lds-Select-value` |
| Popup positioner | `lds-Select-positioner` |
| `SelectContent` | `lds-Select-content` |
| `SelectGroup` | `lds-Select-group` |
| `SelectLabel` | `lds-Select-label` |
| `SelectItem` | `lds-Select-item` |
| Item text | `lds-Select-itemText` |
| Item check icon | `lds-Select-itemIndicator` |
| `SelectSeparator` | `lds-Select-separator` |
| Scroll arrows | `lds-Select-scrollButton` |

## Example

A labelled select inside a `Field`, from the `InField` story in `Select.stories.tsx`:

```tsx
<Field className="w-56">
  <FieldLabel htmlFor="timezone">Time zone</FieldLabel>
  <Select items={TIMEZONES} defaultValue="Asia/Bangkok">
    <SelectTrigger id="timezone" className="w-full">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {TIMEZONES.map((tz) => (
        <SelectItem key={tz.value} value={tz.value}>
          {tz.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
  <FieldDescription>Used for reminder emails.</FieldDescription>
</Field>
```

## Storybook

Stories are in `apps/storybook/src/stories/Select.stories.tsx`. Keep their `argTypes` in sync with the props above.
