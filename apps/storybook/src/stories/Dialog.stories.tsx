import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
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
  Field,
  FieldGroup,
  FieldLabel,
  Input,
} from "lab-ds"
import { expect, fn, userEvent, waitFor, within } from "storybook/test"

const onSave = fn()
const onDelete = fn()

/** Waits for the closing animation to finish and the dialog to leave the page. */
const waitForClosed = (body: ReturnType<typeof within>) =>
  waitFor(() => expect(body.queryByRole("dialog")).toBeNull(), {
    timeout: 3000,
  })

const meta = {
  title: "Components/Dialog",
  component: Dialog,
  args: {
    modal: true,
    disablePointerDismissal: false,
    onOpenChange: fn(),
  },
  // Props are declared by hand: stories import the built package, which
  // docgen cannot read. These are the Dialog (root) props.
  argTypes: {
    open: {
      control: "boolean",
      description: "Opens or closes the dialog from your own state.",
    },
    defaultOpen: {
      control: "boolean",
      description: "Opens the dialog on first render.",
      table: { defaultValue: { summary: "false" } },
    },
    modal: {
      control: "select",
      options: [true, false, "trap-focus"],
      description:
        "`false` lets the user work with the page behind. `trap-focus` keeps focus inside but leaves the page scrollable.",
      table: { defaultValue: { summary: "true" } },
    },
    disablePointerDismissal: {
      control: "boolean",
      description: "Stops a click outside from closing the dialog.",
      table: { defaultValue: { summary: "false" } },
    },
    onOpenChange: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

/** The page behind a dialog, so the dimmed and blurred backdrop has something to cover. */
function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-3">
      <p className="max-w-sm text-sm text-muted-foreground">
        Page content sits behind the dialog. Open it to see the backdrop.
      </p>
      {children}
    </div>
  )
}

/**
 * A short form. `disablePointerDismissal` stops a stray click outside from
 * throwing away what the user typed.
 */
export const Playground: Story = {
  args: { disablePointerDismissal: true },
  render: (args) => (
    <Page>
      <Dialog {...args}>
        <DialogTrigger render={<Button variant="outline" />}>
          Edit profile
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Changes show on your public profile.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="dialog-name">Name</FieldLabel>
              <Input id="dialog-name" defaultValue="Piraya" />
            </Field>
            <Field>
              <FieldLabel htmlFor="dialog-username">Username</FieldLabel>
              <Input id="dialog-username" defaultValue="@piraya" />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <DialogClose render={<Button onClick={onSave} />}>
              Save changes
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Page>
  ),
  play: async ({ canvas, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const trigger = canvas.getByRole("button", { name: "Edit profile" })
    await userEvent.click(trigger)

    const dialog = await body.findByRole("dialog", { name: "Edit profile" })
    await expect(dialog).toHaveAccessibleDescription(
      "Changes show on your public profile."
    )
    await waitFor(() => expect(body.getByLabelText("Name")).toHaveFocus())

    await userEvent.click(body.getByRole("button", { name: "Save changes" }))
    await expect(onSave).toHaveBeenCalledOnce()
    await waitForClosed(body)
    await expect(trigger).toHaveFocus()
  },
}

function ConfirmDeleteDialog(props: React.ComponentProps<typeof Dialog>) {
  const cancelRef = React.useRef<HTMLButtonElement>(null)
  return (
    <Dialog {...props}>
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
          <DialogClose
            render={<Button variant="destructive" onClick={onDelete} />}
          >
            Delete project
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Confirming an action that can't be undone: a specific title, a verb on the
 * confirm button, and focus starts on Cancel (the least destructive button).
 */
export const ConfirmDelete: Story = {
  render: (args) => (
    <Page>
      <ConfirmDeleteDialog {...args} />
    </Page>
  ),
  play: async ({ canvas, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    const trigger = canvas.getByRole("button", { name: "Delete project" })
    await userEvent.click(trigger)

    await body.findByRole("dialog", { name: "Delete project?" })
    await waitFor(() =>
      expect(body.getByRole("button", { name: "Cancel" })).toHaveFocus()
    )

    await userEvent.keyboard("{Escape}")
    await waitForClosed(body)
    await expect(onDelete).not.toHaveBeenCalled()
    await expect(trigger).toHaveFocus()
  },
}

/** Information only: no X button, and the footer adds its own "Close" button. */
export const FooterCloseButton: Story = {
  render: (args) => (
    <Page>
      <Dialog {...args}>
        <DialogTrigger render={<Button variant="outline" />}>
          What's new
        </DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>What's new in version 2.4</DialogTitle>
            <DialogDescription>
              Faster search, a new dark theme, and saved filters on every list.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>
    </Page>
  ),
  play: async ({ canvas, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(canvas.getByRole("button", { name: "What's new" }))
    const dialog = await body.findByRole("dialog")
    await expect(within(dialog).getAllByRole("button")).toHaveLength(1)
    await userEvent.click(within(dialog).getByRole("button", { name: "Close" }))
    await waitForClosed(body)
  },
}

/**
 * Content taller than the screen. The dialog stays 16px inside the screen edges
 * and scrolls, with the title and buttons scrolling along with the text.
 */
export const LongContent: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <Page>
      <Dialog {...args}>
        <DialogTrigger render={<Button variant="outline" />}>
          Terms of service
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Terms of service</DialogTitle>
            <DialogDescription>Last updated 1 November 2026.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            {Array.from({ length: 16 }, (_, i) => (
              <p key={i}>
                Section {i + 1}. These terms describe how you may use the
                service, what we do with the content you upload, and how either
                of us can end the agreement.
              </p>
            ))}
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Decline
            </DialogClose>
            <DialogClose render={<Button />}>Accept</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Page>
  ),
}
