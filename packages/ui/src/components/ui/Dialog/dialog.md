# Dialog

## Purpose

A modal window over the page that asks the user to finish one short task or make one decision before going back to the page.

## Import and use

**1. Set up once per app.** Install the package, then import its styles once, after Tailwind, in your global CSS file. The package README has the full setup.

```bash
pnpm add @piraya.d/ai_designsystem_lab
```

```css
@import "tailwindcss";
@import "@piraya.d/ai_designsystem_lab/styles.css";
```

Dialog titles use the `--font-heading` font variable, which your app sets.

**2. Import the parts you need** from `@piraya.d/ai_designsystem_lab`:

```tsx
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@piraya.d/ai_designsystem_lab"
```

**3. Build the dialog** from this structure:

```tsx
<Dialog>
  <DialogTrigger render={<Button variant="outline" />}>Edit profile</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>Changes show on your public profile.</DialogDescription>
    </DialogHeader>
    {/* Body: form fields or other content */}
    <DialogFooter>
      <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
      <Button type="submit">Save changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

Dialog is a client component. You can still import it into a React Server Component.

## When to use

Dialogs interrupt the user, so use them for short and infrequent tasks ([Carbon](https://carbondesignsystem.com/components/modal/usage/), [USWDS](https://designsystem.digital.gov/components/modal/)).

- **Confirming a decision that can't be undone.** For example, discarding unsaved work or deleting a project.
- **Getting a small amount of input.** Use it when the input blocks a process the user started, such as naming a file before saving.
- **Showing urgent information.** The user must see it before going on, such as a session about to time out.
- **Doing a quick task without leaving the page.** For example, editing one record from a list ([Atlassian](https://atlassian.design/components/modal-dialog/usage)).

## When not to use

| Situation | Use instead |
| --- | --- |
| A message that relates to the page and needs no response | **Alert**, inline on the page |
| An error on one form field | The field's own error message (**Field**) |
| Brief feedback that confirms an action | TODO: the library has no toast component yet |
| A long, complex or multi-step flow, or a large table | A separate page |
| Content so long that the dialog would scroll | A separate page ([Carbon](https://carbondesignsystem.com/components/modal/usage/)) |
| A decision that needs information hidden behind the dialog | Inline content on the page ([Atlassian](https://atlassian.design/components/modal-dialog/usage)) |
| Marketing, sign-up prompts, or anything shown when the page loads | Inline content ([NN/g](https://www.nngroup.com/articles/modal-nonmodal-dialog/)) |
| Confirming a common action that can be undone, even a destructive one | Skip the confirmation, and offer Undo afterwards ([Apple HIG](https://developer.apple.com/design/human-interface-guidelines/alerts)) |
| Opening one dialog from inside another | Rework the flow so only one dialog is open ([Atlassian](https://atlassian.design/components/modal-dialog/usage)) |

## Anatomy

| Part | Required | Content |
| --- | --- | --- |
| `Dialog` | Yes | Holds the open/closed state. It draws nothing itself |
| `DialogTrigger` | No | The control that opens the dialog, usually a **Button** |
| `DialogContent` | Yes | The window, centred on screen above a dimmed and blurred backdrop. Width is 448px max, or the screen width minus 16px on each side on small screens |
| `DialogHeader` | No | Groups the title and description |
| `DialogTitle` | Yes | The heading. Screen readers announce it as the dialog's name |
| `DialogDescription` | No | Supporting text in a muted colour. Screen readers read it with the title |
| Body | No | Any content placed between the header and the footer |
| `DialogFooter` | No | The action buttons. On wide screens they sit in a row, right-aligned. On small screens they stack, and the last button in the code goes on top |
| `DialogClose` | No | Turns any button into one that closes the dialog, such as "Cancel" |
| Close button (X) | Shown by default | A round icon button in the top-right corner, labelled "Close" for screen readers |

## Content guidance

- **Title:** a short, specific phrase that says what the dialog is for, e.g. "Delete project?". Use the same verb as the button that opened it. Avoid vague titles such as "Error" or "Are you sure?" ([Apple HIG](https://developer.apple.com/design/human-interface-guidelines/alerts), [Carbon](https://carbondesignsystem.com/components/modal/usage/)).
- **Description:** add one only when it gives new information, and keep it to one task or message.
- **Button labels:** name the action with a verb, e.g. "Delete project" or "Save changes", and label the dismiss button "Cancel". Avoid "Yes" and "No" ([Apple HIG](https://developer.apple.com/design/human-interface-guidelines/alerts)).
- **Button order:** in `DialogFooter`, put Cancel first and the primary action last. The primary action then shows on the right on wide screens and on top on small screens.
- **Number of actions:** use one primary action, plus Cancel. Three buttons at most.
- **Destructive actions:** use the **Button** `destructive` variant for the confirming button. Note that the sources disagree here: Apple skips the destructive style when the user deliberately chose to delete.

## Behaviour

Dialog follows the [WAI-ARIA modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) by default:

- **Opening:** focus moves to the first focusable element inside the dialog. If the dialog was opened by touch, the dialog itself is focused instead, so the on-screen keyboard does not pop up.
- **While open:** Tab and Shift+Tab stay inside the dialog, the page behind cannot be scrolled or clicked, and Escape closes the dialog.
- **Closing:** focus returns to the control that opened the dialog.
- **Backdrop click:** clicking or tapping outside the dialog closes it. Turn this off with `disablePointerDismissal` when closing by accident would lose the user's input. The sources disagree on this: Carbon allows backdrop dismissal only for dialogs that just show information.
- **Confirming an irreversible action:** WAI-ARIA recommends focusing the least destructive button, such as Cancel, when the dialog opens. Set `initialFocus` to that button.

## Props and variants

There are no visual variants and no sizes.

**`Dialog`**

| Prop | Values | Default | Use |
| --- | --- | --- | --- |
| `open` | `true`, `false` | | Opens or closes the dialog from your own state |
| `defaultOpen` | `true`, `false` | `false` | Opens the dialog on first render |
| `onOpenChange` | function | | Called when the dialog opens or closes |
| `modal` | `true`, `false`, `"trap-focus"` | `true` | `false` lets the user work with the page behind. `"trap-focus"` keeps focus inside but leaves the page scrollable and clickable |
| `disablePointerDismissal` | `true`, `false` | `false` | Stops a click outside from closing the dialog |

**`DialogContent`**

| Prop | Values | Default | Use |
| --- | --- | --- | --- |
| `showCloseButton` | `true`, `false` | `true` | Shows the X button in the top-right corner |
| `initialFocus` | element | first focusable element | Which element gets focus when the dialog opens |
| `finalFocus` | element | the trigger | Which element gets focus when the dialog closes |

**`DialogFooter`**

| Prop | Values | Default | Use |
| --- | --- | --- | --- |
| `showCloseButton` | `true`, `false` | `false` | Adds an outline "Close" button after the other buttons |

`DialogTrigger` and `DialogClose` are unstyled buttons by default. To make one look like a **Button**, render it as one: `<DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>`. The example below shows this.

TODO: confirm with the team that `modal={false}` is ever acceptable in our products. Industry guidance treats a non-modal dialog as a different pattern.

## Tokens used

| Token | Where |
| --- | --- |
| `--popover` | Dialog background |
| `--popover-foreground` | Dialog text |
| `--foreground` | Thin outline around the dialog (5% opacity, 10% in dark mode), and link colour on hover |
| `--muted-foreground` | Description text |
| `--secondary` | Background of the X close button |
| `--radius` | Corner radius (2.6 × `--radius`, the `4xl` step) |
| `--font-heading` | Title font |

The backdrop is black at 30% opacity with a blur, and the dialog has a large shadow. Neither one is a token. The X button and the footer "Close" button use **Button** tokens.

Every token has a dark-mode value, so the Dialog adapts when `.dark` is on.

## Gaps against industry standards

These come from comparing the component with WAI-ARIA, Carbon, Atlassian, USWDS, Apple HIG and NN/g. None of them has been changed in the code.

- TODO: **There is no alert dialog.** WAI-ARIA uses a separate [`alertdialog`](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/) role for urgent confirmations, such as "Delete project?". Screen readers can treat that role differently, and the user is not meant to dismiss it by clicking outside. Every Dialog here is a regular dialog. Base UI ships an AlertDialog that could be wrapped.
- TODO: **The whole dialog scrolls, not just the body.** Content taller than the screen now stays on screen and scrolls inside the dialog (see the `LongContent` story), but the title and buttons scroll with it. Carbon keeps the header and footer fixed and scrolls only the body. Keep dialog content short so the buttons stay in view.
- TODO: **There are no size options.** Every dialog is 448px max. Carbon and Atlassian offer several widths.

## Example

Confirming a delete, from the `ConfirmDelete` story in `Dialog.stories.tsx`. The title asks a specific question, the confirm button names the action, and focus starts on Cancel:

```tsx
import * as React from "react"
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@piraya.d/ai_designsystem_lab"

function ConfirmDeleteDialog() {
  const cancelRef = React.useRef<HTMLButtonElement>(null)
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="destructive" />}>
        Delete project
      </DialogTrigger>
      <DialogContent initialFocus={cancelRef}>
        <DialogHeader>
          <DialogTitle>Delete project?</DialogTitle>
          <DialogDescription>
            “Storefront redesign” and its 24 files will be deleted. You can’t
            undo this.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose ref={cancelRef} render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <DialogClose render={<Button variant="destructive" />}>
            Delete project
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

TODO: this should become an alert dialog once one exists (see Gaps).
