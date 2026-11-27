import type { Meta, StoryObj } from "@storybook/react-vite"
import { Bell, Lock, User } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  FieldLabel,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "lab-ds"
import type { TabsListVariant } from "lab-ds"
import { expect, fn, userEvent, waitFor } from "storybook/test"

const VARIANTS: TabsListVariant[] = ["default", "line"]
const ORIENTATIONS = ["horizontal", "vertical"] as const

const SECTIONS = [
  { value: "account", label: "Account", icon: User },
  { value: "password", label: "Password", icon: Lock },
  { value: "notifications", label: "Notifications", icon: Bell },
]

/** Three tabs and panels, shared by the stories below. */
function SettingsTabs({
  variant,
  withIcons = false,
  disabled,
  ...props
}: React.ComponentProps<typeof Tabs> & {
  variant?: TabsListVariant
  withIcons?: boolean
  disabled?: string
}) {
  return (
    <Tabs {...props}>
      <TabsList variant={variant}>
        {SECTIONS.map(({ value, label, icon: Icon }) => (
          <TabsTrigger key={value} value={value} disabled={value === disabled}>
            {withIcons && <Icon data-icon="inline-start" />}
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
      {SECTIONS.map(({ value, label }) => (
        <TabsContent key={value} value={value} className="p-2">
          {label} settings
        </TabsContent>
      ))}
    </Tabs>
  )
}

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  args: {
    defaultValue: "account",
    orientation: "horizontal",
    onValueChange: fn(),
  },
  // Props are declared by hand: stories import the built package, which
  // docgen cannot read. These are the Tabs (root) props; TabsList `variant`
  // is shown in the Variants story.
  argTypes: {
    defaultValue: {
      control: "select",
      options: SECTIONS.map((s) => s.value),
      description: "Active tab on first render.",
      table: { defaultValue: { summary: "0" } },
    },
    value: { control: "text", description: "Controlled active tab." },
    orientation: {
      control: "select",
      options: ORIENTATIONS,
      description: "`vertical` puts the list on the left and stacks the tabs.",
      table: { defaultValue: { summary: "horizontal" } },
    },
    className: { control: "text" },
    onValueChange: { control: false },
    children: { control: false },
    render: { control: false },
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

/** Use the Controls panel to try each prop. */
export const Playground: Story = {
  render: (args) => <SettingsTabs {...args} />,
}

/** The minimal structure. Quoted in `tabs.md` (Import and use). */
export const Basic: Story = {
  render: () => (
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Account settings</TabsContent>
      <TabsContent value="password">Password settings</TabsContent>
    </Tabs>
  ),
}

/** Each `TabsList` variant in each orientation. */
export const Variants: Story = {
  parameters: { layout: "padded" },
  render: (args) => (
    <div className="grid gap-8">
      {ORIENTATIONS.map((orientation) =>
        VARIANTS.map((variant) => (
          <div key={`${orientation}-${variant}`} className="grid gap-2">
            <span className="font-mono text-sm text-muted-foreground">
              {orientation} · {variant}
            </span>
            <SettingsTabs {...args} orientation={orientation} variant={variant} />
          </div>
        ))
      )}
    </div>
  ),
}

/** `data-icon="inline-start"` on the icon tightens the padding on that side. */
export const WithIcons: Story = {
  render: (args) => (
    <div className="grid gap-6">
      {VARIANTS.map((variant) => (
        <SettingsTabs key={variant} {...args} variant={variant} withIcons />
      ))}
    </div>
  ),
}

/** Active, inactive and disabled tabs in each variant. Hover and focus show on interaction. */
export const States: Story = {
  parameters: { layout: "padded" },
  render: (args) => (
    <div className="grid gap-6">
      {VARIANTS.map((variant) => (
        <div key={variant} className="grid gap-2">
          <span className="font-mono text-sm text-muted-foreground">
            {variant}: active · inactive · disabled
          </span>
          <SettingsTabs {...args} variant={variant} disabled="notifications" />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    const [active] = canvas.getAllByRole("tab", { name: "Account" })
    await expect(active).toHaveAttribute("data-active")
    await expect(active).toHaveAttribute("aria-selected", "true")
    const [disabled] = canvas.getAllByRole("tab", { name: "Notifications" })
    await expect(disabled).toHaveAttribute("data-disabled")
  },
}

/**
 * Clicking a tab shows its panel and calls `onValueChange`. The old panel
 * leaves after Base UI's exit frame, so the panel check waits for it.
 */
export const Switching: Story = {
  render: (args) => <SettingsTabs {...args} />,
  play: async ({ args, canvas }) => {
    await expect(canvas.getByRole("tabpanel")).toHaveTextContent("Account settings")
    await userEvent.click(canvas.getByRole("tab", { name: "Password" }))
    await expect(canvas.getByRole("tab", { name: "Password" })).toHaveAttribute("data-active")
    await waitFor(() =>
      expect(canvas.getByRole("tabpanel")).toHaveTextContent("Password settings")
    )
    await expect(args.onValueChange).toHaveBeenCalledWith("password", expect.anything())
  },
}

/**
 * Arrow keys move focus between tabs and Enter activates. A disabled tab
 * still takes focus (announced as disabled) but cannot be activated.
 */
export const Keyboard: Story = {
  render: (args) => <SettingsTabs {...args} disabled="password" />,
  play: async ({ canvas }) => {
    await userEvent.tab()
    await expect(canvas.getByRole("tab", { name: "Account" })).toHaveFocus()

    await userEvent.keyboard("{ArrowRight}")
    const password = canvas.getByRole("tab", { name: "Password" })
    await expect(password).toHaveFocus()
    await expect(password).toHaveAttribute("aria-disabled", "true")
    await userEvent.keyboard("{Enter}")
    await expect(password).not.toHaveAttribute("data-active")

    await userEvent.keyboard("{ArrowRight}")
    await expect(canvas.getByRole("tab", { name: "Notifications" })).toHaveFocus()
    await userEvent.keyboard("{Enter}")
    await waitFor(() =>
      expect(canvas.getByRole("tabpanel")).toHaveTextContent("Notifications settings")
    )
  },
}

/** Account settings in a card. Quoted in `tabs.md`. */
export const InCard: Story = {
  render: () => (
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
  ),
}
