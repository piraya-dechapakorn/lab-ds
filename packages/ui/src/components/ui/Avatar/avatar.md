# Avatar

## Purpose

A small round picture of a person, with their initials shown while the picture loads or when there is none.

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
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@piraya.d/ai_designsystem_lab"
```

**3. Build the avatar** from this structure. Always include a fallback:

```tsx
<Avatar>
  <AvatarImage src="/people/piraya.jpg" alt="Piraya Dechapakorn" />
  <AvatarFallback>PD</AvatarFallback>
</Avatar>
```

Avatar is a client component. You can still import it into a React Server Component.

## When to use

- To show who someone is next to their content, such as a comment, a message or an assignee.
- `AvatarGroup` to show several people on one item, such as project members.
- `AvatarBadge` to show a person's status, such as online, on their picture.

## When not to use

| Situation | Use instead |
| --- | --- |
| A logo or a product image | An `<img>`, or **ProductCard**'s media |
| A decorative icon | The icon alone |
| A status label with words, such as "Away" | **Badge** next to the name |

## Anatomy

| Part | Required | Content |
| --- | --- | --- |
| `Avatar` | Yes | The round frame, with a hairline ring |
| `AvatarImage` | No | The picture. It shows only once it has loaded |
| `AvatarFallback` | Yes | Initials or an icon on a grey circle, shown while the image loads or if it fails |
| `AvatarBadge` | No | A small dot in the bottom-right corner. It can hold an icon on `default` and `lg` sizes |
| `AvatarGroup` | No | A row of avatars that overlap, each with a ring in the page colour |
| `AvatarGroupCount` | No | A grey circle at the end of a group, such as "+3", for people not shown |

## Content guidance

- **Alt text:** if the avatar stands alone, set `alt` to the person's name. If the name is already written next to it, set `alt=""` so screen readers don't read the name twice, and hide the fallback with `aria-hidden` (see the `WithName` story).
- **Initials:** one or two letters, such as "PD". Fall back to an icon when you don't know the name.
- **Status dot:** colour alone doesn't say what it means. Put the status in text inside the badge, such as a visually hidden "Online" (see the `WithBadge` story).
- **Group count:** say what the number means to screen readers, such as "+3 more people", and give the group a label, such as "Project members: 7 people" (see the `Group` story).
- **Group size:** show up to five avatars, then the count ([Atlassian](https://atlassian.design/components/avatar-group/usage)). If several groups are on one page, give each a different label.
- **Tooltips:** don't put a tooltip with the name on an avatar that isn't a link or button. Keyboard and screen-reader users can't reach it.

## Behaviour

- **Loading:** the fallback shows until the image has loaded. If the image fails, the fallback stays (see the `Fallback` story).
- **Group sizing:** `AvatarGroupCount` takes the size of the avatars in its group.
- **Not interactive:** an Avatar is not a button or link. To make it one, wrap it in a link or **Button** with an accessible name.

## Props and variants

**`Avatar`**

| Prop | Values | Default | Use |
| --- | --- | --- | --- |
| `size` | `sm`, `default`, `lg` | `default` | `sm` is 24px, `default` 32px, `lg` 40px |
| `className` | string or function of state | | Merged after the built-in class, so your utilities win |

**`AvatarImage`**

| Prop | Values | Default | Use |
| --- | --- | --- | --- |
| `src` | URL | | The picture |
| `alt` | text | | The person's name, or `""` when the name is written beside it |

**`AvatarFallback`**

| Prop | Values | Default | Use |
| --- | --- | --- | --- |
| `delay` | milliseconds | | Waits before showing the fallback, so it doesn't flash when the image loads quickly |

`AvatarBadge`, `AvatarGroup` and `AvatarGroupCount` take the attributes of a `<span>` or `<div>` and have no props of their own. Set the badge colour with a class, such as `bg-green-600`. Its default colour is `--primary`.

### Sizes

| Size | Avatar | Fallback text | Badge |
| --- | --- | --- | --- |
| `sm` | 24px | 12px | 8px dot, icons hidden |
| `default` | 32px | 14px | 10px dot, 8px icon |
| `lg` | 40px | 14px | 12px dot, 8px icon |

## Tokens used

| Token | Where |
| --- | --- |
| `--border` | Hairline ring around each avatar |
| `--muted` | Fallback and group count background |
| `--muted-foreground` | Fallback and group count text |
| `--primary`, `--primary-foreground` | Default badge fill and icon |
| `--background` | Ring around the badge and around each avatar in a group, so they separate from what's behind |

Every token has a dark-mode value.

## Gaps against industry standards

- TODO: **There is no `xl` size** for profile pages. Most systems offer five or more sizes.
- TODO: **The badge has no status colours.** Each consumer picks its own colour for online, away and busy.
- TODO: **The fallback has no default icon.** With no initials, the circle is empty.
- TODO: **Initials are read letter by letter.** When the image fails, a standalone avatar loses its `alt`, and screen readers read "P D" instead of the name. Put the full name in hidden text inside the fallback.
- TODO: **The group count can't open the full list.** Atlassian makes "+N" a button that shows the hidden names.
- TODO: **The status dot needs 3:1 contrast** against the picture and the page (WCAG 1.4.11).

## Example

Project members with a count, from the `Group` story in `Avatar.stories.tsx`:

```tsx
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@piraya.d/ai_designsystem_lab"

<AvatarGroup role="group" aria-label="Project members: 7 people">
  <Avatar>
    <AvatarImage src="/people/piraya.jpg" alt="Piraya Dechapakorn" />
    <AvatarFallback>PD</AvatarFallback>
  </Avatar>
  {/* three more Avatars */}
  <AvatarGroupCount>
    +3<span className="sr-only"> more people</span>
  </AvatarGroupCount>
</AvatarGroup>
```

## Class names

The built CSS scopes these classes. Consumers may target them, so renaming one is a breaking change.

| Part | Class |
| --- | --- |
| `Avatar` | `lds-Avatar-root` |
| `AvatarImage` | `lds-Avatar-image` |
| `AvatarFallback` | `lds-Avatar-fallback` |
| `AvatarBadge` | `lds-Avatar-badge` |
| `AvatarGroup` | `lds-Avatar-group` |
| `AvatarGroupCount` | `lds-Avatar-groupCount` |

## Storybook

Stories are in `apps/storybook/src/stories/Avatar.stories.tsx`. Keep their `argTypes` in sync with the props above.
