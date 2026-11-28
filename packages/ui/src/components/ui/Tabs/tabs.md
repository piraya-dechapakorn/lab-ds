# Tabs

## Purpose

A row of tabs that switches between panels of related content in the same place on the page. Built on the Base UI [`Tabs`](https://base-ui.com/react/components/tabs) primitive.

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@piraya.d/ai_designsystem_lab"
```

**3. Build the tabs** from this structure. Each `TabsTrigger` and its `TabsContent` share a `value`:

```tsx
<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account settings</TabsContent>
  <TabsContent value="password">Password settings</TabsContent>
</Tabs>
```

Tabs is a client component. You can still import it into a React Server Component.

## Files

| File | Purpose |
| --- | --- |
| `Tabs.tsx` | `Tabs` and its parts, plus types |
| `Tabs.module.css` | Styles, in `@layer components.primitive` |
| `index.ts` | Re-exports `./Tabs` |

## When to use

- **Switching between views of the same subject,** such as the settings sections of one account, when the user needs one view at a time.

## When not to use

| Situation | Use instead |
| --- | --- |
| Content the user must compare side by side | Show it all on the page |
| Steps the user must do in order | A separate page per step |
| Moving to another page | Links |
| Picking a value for a form | **Select** |

## Anatomy

| Part | Required | Content |
| --- | --- | --- |
| `Tabs` | Yes | Holds the active value. Lays the list and panels out in a column (horizontal) or a row (vertical) |
| `TabsList` | Yes | The row of tabs. `default` is a `muted` pill; `line` is transparent with an underline under the active tab |
| `TabsTrigger` | Yes | One tab. The active tab has a `background` fill (`default`) or a 2px `foreground` underline (`line`) |
| `TabsContent` | Yes | The panel for one value. Only the active panel shows |

## Props and variants

**`Tabs`** (Base UI `Tabs.Root`)

| Prop | Type | Default | Use |
| --- | --- | --- | --- |
| `defaultValue` | value | `0` | Active tab on first render |
| `value` | value | | Controlled active tab |
| `onValueChange` | `(value, details) => void` | | Called when the active tab changes |
| `orientation` | `"horizontal"` \| `"vertical"` | `"horizontal"` | `vertical` puts the list on the left and stacks the tabs |
| `className` | `string \| (state) => string` | | Merged after the module class with `mergeClassName` |

**`TabsList`**

| Prop | Type | Default | Use |
| --- | --- | --- | --- |
| `variant` | `TabsListVariant` (`"default"` \| `"line"`) | `"default"` | Visual treatment |
| `activateOnFocus` | `boolean` | `false` | Base UI: switch tabs as the arrow keys move focus, not only on Enter or Space |
| `loopFocus` | `boolean` | `true` | Base UI: arrow keys wrap from the last tab to the first |

**`TabsTrigger`**

| Prop | Type | Default | Use |
| --- | --- | --- | --- |
| `value` | value | | The panel this tab shows |
| `disabled` | `boolean` | `false` | Dims the tab and blocks it |

**`TabsContent`**

| Prop | Type | Default | Use |
| --- | --- | --- | --- |
| `value` | value | | Matches a `TabsTrigger` |
| `keepMounted` | `boolean` | `false` | Base UI: keep hidden panels in the DOM |

### `variant`

| Value | Look |
| --- | --- |
| `default` | `muted` pill behind the tabs; the active tab is a `background` pill |
| `line` | No background; the active tab gets a 2px `foreground` underline (a right-hand bar when vertical) |

### Icons

An SVG inside a tab is `size-4` by default. Put `data-icon="inline-start"` or `data-icon="inline-end"` on the icon to tighten the padding on that side, as on **Button**.

## States

| Part | Attribute | Effect |
| --- | --- | --- |
| Trigger | `data-active` | `default`: `background` fill and `foreground` text. `line`: underline shows. Dark mode: `input` tint |
| Trigger | `:hover` | `foreground` text |
| Trigger | `:focus-visible` | `ring` outline and a 3px ring |
| Trigger | `data-disabled` / `:disabled` / `aria-disabled="true"` | 50% opacity, no pointer events |
| Root | `data-orientation="vertical"` | List and panel sit side by side; tabs stack, align left and fill the list's width |

## Behaviour

- **Keyboard:** Tab moves focus to the active tab, then into the panel. Arrow Left and Right (Up and Down when vertical) move between tabs. Home and End go to the first and last tab.
- **Activation:** by default, a focused tab activates on Enter or Space. Set `activateOnFocus` on `TabsList` to switch as focus moves.
- **Disabled tabs:** the arrow keys still move focus onto a disabled tab, and screen readers announce it as disabled (`aria-disabled="true"`), but it cannot be activated.
- **Switching:** the old panel carries `data-ending-style` for one frame before it unmounts.

## Data attributes

| Part | Attributes |
| --- | --- |
| `Tabs` | `data-slot="tabs"`, `data-orientation`, plus Base UI's `data-activation-direction` |
| `TabsList` | `data-slot="tabs-list"`, `data-variant`, `data-orientation` |
| `TabsTrigger` | `data-slot="tabs-trigger"`, plus Base UI's `data-active`, `data-disabled`, `data-orientation` |
| `TabsContent` | `data-slot="tabs-content"`, plus Base UI's `data-index`, `data-hidden`, `data-orientation` |

## Tokens used

| Token | Where |
| --- | --- |
| `--muted` | `default` list background |
| `--muted-foreground` | List text colour; inactive tab text in dark mode |
| `--foreground` | Inactive tab text (60%), hover and active text, `line` underline |
| `--background` | Active tab fill (`default`) |
| `--input` | Active tab fill (30%) in dark mode |
| `--ring` | Focus outline and ring |

## Public class names

The built CSS scopes the classes to these names. Consumers may target them, so renaming one is a breaking change.

| Part | Class |
| --- | --- |
| `Tabs` | `lds-Tabs-root` |
| `TabsList` | `lds-Tabs-list` |
| `TabsTrigger` | `lds-Tabs-trigger` |
| `TabsContent` | `lds-Tabs-content` |

## Example

Account settings in a card, from the `InCard` story in `Tabs.stories.tsx`:

```tsx
<Tabs defaultValue="account" className="w-full max-w-sm">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>Change your name and email.</CardDescription>
      </CardHeader>
      <CardContent>
        <Field>
          <FieldLabel htmlFor="tabs-name">Name</FieldLabel>
          <Input id="tabs-name" defaultValue="Alex Kim" />
        </Field>
      </CardContent>
    </Card>
  </TabsContent>
  <TabsContent value="password">
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>You'll be signed out on other devices.</CardDescription>
      </CardHeader>
      <CardContent>
        <Field>
          <FieldLabel htmlFor="tabs-password">New password</FieldLabel>
          <Input id="tabs-password" type="password" />
        </Field>
      </CardContent>
    </Card>
  </TabsContent>
</Tabs>
```

## Storybook

Stories are in `apps/storybook/src/stories/Tabs.stories.tsx`. Keep their `argTypes` in sync with the props above.
