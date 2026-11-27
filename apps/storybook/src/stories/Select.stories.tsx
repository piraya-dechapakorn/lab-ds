import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Field,
  FieldDescription,
  FieldLabel,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "lab-ds"
import type { SelectTriggerSize } from "lab-ds"
import { expect, fn, userEvent, waitFor, within } from "storybook/test"

const FRUITS = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "mango", label: "Mango" },
  { value: "orange", label: "Orange" },
]
const VEGETABLES = [
  { value: "carrot", label: "Carrot" },
  { value: "spinach", label: "Spinach" },
]
const TIMEZONES = [
  { value: "Asia/Bangkok", label: "Bangkok (GMT+7)" },
  { value: "Asia/Tokyo", label: "Tokyo (GMT+9)" },
  { value: "Europe/London", label: "London (GMT+0)" },
  { value: "America/New_York", label: "New York (GMT-5)" },
]
const COUNTRIES = [
  "Argentina", "Australia", "Brazil", "Canada", "Chile", "China", "Denmark",
  "Egypt", "Finland", "France", "Germany", "India", "Indonesia", "Italy",
  "Japan", "Kenya", "Laos", "Malaysia", "Mexico", "Norway", "Peru",
  "Singapore", "Spain", "Thailand", "Vietnam",
].map((name) => ({ value: name.toLowerCase(), label: name }))

const SIZES: SelectTriggerSize[] = ["sm", "default"]

/** The popup renders in a portal, outside the story's canvas. */
const page = (canvasElement: HTMLElement) =>
  within(canvasElement.ownerDocument.body)

const meta = {
  title: "Components/Select",
  component: Select,
  args: {
    items: FRUITS,
    disabled: false,
    required: false,
    onValueChange: fn(),
  },
  // Props are declared by hand: stories import the built package, which
  // docgen cannot read. These are the Select (root) props; trigger and
  // content props are shown in the stories below.
  argTypes: {
    items: {
      control: false,
      description: "`{ value, label }[]`, so `SelectValue` can show labels.",
    },
    value: { control: "text", description: "Controlled value." },
    defaultValue: {
      control: "select",
      options: [null, ...FRUITS.map((f) => f.value)],
      description: "Value on first render.",
      table: { defaultValue: { summary: "null" } },
    },
    open: { control: "boolean" },
    defaultOpen: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    name: { control: "text" },
    multiple: { control: false },
    onValueChange: { control: false },
    onOpenChange: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

/** Use the Controls panel to try the root props. */
export const Playground: Story = {
  render: (args) => (
    <Select {...args}>
      <SelectTrigger aria-label="Fruit" className="w-44">
        <SelectValue placeholder="Pick a fruit" />
      </SelectTrigger>
      <SelectContent>
        {FRUITS.map((fruit) => (
          <SelectItem key={fruit.value} value={fruit.value}>
            {fruit.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
}

/** The minimal structure. Quoted in `select.md` (Import and use). */
export const Basic: Story = {
  render: () => (
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
  ),
}

/** Two groups, labels, a separator and a disabled item. */
export const Groups: Story = {
  render: () => (
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
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Vegetables</SelectLabel>
          {VEGETABLES.map((veg) => (
            <SelectItem key={veg.value} value={veg.value} disabled={veg.value === "spinach"}>
              {veg.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

/** `SelectTrigger` sizes: `sm` is `h-8`, `default` is `h-9`. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      {SIZES.map((size) => (
        <Select key={size} {...args} defaultValue="apple">
          <SelectTrigger size={size} aria-label={`Fruit (${size})`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FRUITS.map((fruit) => (
              <SelectItem key={fruit.value} value={fruit.value}>
                {fruit.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("combobox", { name: "Fruit (sm)" })).toHaveStyle({ height: "32px" })
    await expect(canvas.getByRole("combobox", { name: "Fruit (default)" })).toHaveStyle({ height: "36px" })
  },
}

/** Each trigger state the module CSS styles. */
export const States: Story = {
  parameters: { layout: "padded" },
  render: (args) => {
    const states = [
      { label: "placeholder", root: {}, trigger: {} },
      { label: "value", root: { defaultValue: "mango" }, trigger: {} },
      { label: "aria-invalid", root: {}, trigger: { "aria-invalid": true } },
      { label: "disabled", root: { disabled: true }, trigger: {} },
    ]
    return (
      <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3 text-sm">
        {states.map((s) => (
          <div key={s.label} className="contents">
            <span className="font-mono text-muted-foreground">{s.label}</span>
            <Select {...args} {...s.root}>
              <SelectTrigger aria-label={s.label} className="w-44" {...s.trigger}>
                <SelectValue placeholder="Pick a fruit" />
              </SelectTrigger>
              <SelectContent>
                {FRUITS.map((fruit) => (
                  <SelectItem key={fruit.value} value={fruit.value}>
                    {fruit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    )
  },
}

/** A labelled select inside a `Field`. Quoted in `select.md`. */
export const InField: Story = {
  render: () => (
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
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("combobox", { name: "Time zone" })
    await expect(trigger).toHaveTextContent("Bangkok (GMT+7)")
  },
}

/** Opens with the mouse, picks an item, closes, and shows the label. */
export const PickWithMouse: Story = {
  render: Playground.render,
  play: async ({ args, canvas, canvasElement }) => {
    const trigger = canvas.getByRole("combobox", { name: "Fruit" })
    await expect(trigger).toHaveAttribute("data-placeholder")
    await userEvent.click(trigger)
    const option = await page(canvasElement).findByRole("option", { name: "Mango" })
    await userEvent.click(option)
    await waitFor(() => expect(trigger).toHaveTextContent("Mango"))
    await expect(trigger).not.toHaveAttribute("data-placeholder")
    await expect(args.onValueChange).toHaveBeenCalledWith("mango", expect.anything())
    await waitFor(() => expect(page(canvasElement).queryByRole("listbox")).toBeNull())
  },
}

/** Keyboard: Arrow Down opens, arrows move, Enter picks, focus returns to the trigger. */
export const PickWithKeyboard: Story = {
  render: Playground.render,
  play: async ({ canvas, canvasElement }) => {
    const trigger = canvas.getByRole("combobox", { name: "Fruit" })
    trigger.focus()
    await userEvent.keyboard("{ArrowDown}")
    const listbox = await page(canvasElement).findByRole("listbox")
    await waitFor(() => expect(listbox).toBeVisible())
    await userEvent.keyboard("{ArrowDown}{ArrowDown}{Enter}")
    await waitFor(() => expect(page(canvasElement).queryByRole("listbox")).toBeNull())
    await expect(trigger).not.toHaveAttribute("data-placeholder")
    await expect(trigger).toHaveFocus()
  },
}

/** Escape closes the list without changing the value. */
export const EscapeKeepsValue: Story = {
  args: { defaultValue: "banana" },
  render: Playground.render,
  play: async ({ args, canvas, canvasElement }) => {
    const trigger = canvas.getByRole("combobox", { name: "Fruit" })
    await userEvent.click(trigger)
    await page(canvasElement).findByRole("listbox")
    await userEvent.keyboard("{ArrowDown}{Escape}")
    await waitFor(() => expect(page(canvasElement).queryByRole("listbox")).toBeNull())
    await expect(trigger).toHaveTextContent("Banana")
    await expect(args.onValueChange).not.toHaveBeenCalled()
  },
}

/** A long list caps at the screen height and scrolls inside, with scroll arrows. */
export const LongList: Story = {
  render: () => (
    <Select items={COUNTRIES} defaultValue="thailand">
      <SelectTrigger aria-label="Country" className="w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {COUNTRIES.map((c) => (
          <SelectItem key={c.value} value={c.value}>
            {c.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
}

/** `alignItemWithTrigger={false}` opens below the trigger like a menu, sliding in. */
export const BelowTrigger: Story = {
  render: () => (
    <Select items={FRUITS}>
      <SelectTrigger aria-label="Fruit" className="w-44">
        <SelectValue placeholder="Pick a fruit" />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        {FRUITS.map((fruit) => (
          <SelectItem key={fruit.value} value={fruit.value}>
            {fruit.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole("combobox", { name: "Fruit" }))
    const listbox = await page(canvasElement).findByRole("listbox")
    const popup = listbox.closest('[data-slot="select-content"]')
    await expect(popup).toHaveAttribute("data-align-trigger", "false")
    await expect(popup).toHaveAttribute("data-side", "bottom")
    await userEvent.keyboard("{Escape}")
  },
}
