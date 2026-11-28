import type { Meta, StoryObj } from "@storybook/react-vite"
import { ArrowUp, Check, Copy, Eye, Search, X } from "lucide-react"
import {
  Field,
  FieldError,
  FieldLabel,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@piraya.d/ai_designsystem_lab"
import type { InputGroupAddonAlign, InputGroupButtonSize } from "@piraya.d/ai_designsystem_lab"
import { expect, fn, userEvent } from "storybook/test"

const ALIGNS: InputGroupAddonAlign[] = [
  "inline-start",
  "inline-end",
  "block-start",
  "block-end",
]
const BUTTON_SIZES: InputGroupButtonSize[] = ["xs", "sm", "icon-xs", "icon-sm"]
const onCopy = fn()
const onClear = fn()

const meta = {
  title: "Components/InputGroup",
  component: InputGroupAddon,
  parameters: { layout: "padded" },
  args: { align: "inline-start" },
  // Props are declared by hand: stories import the built package, which
  // docgen cannot read. InputGroup has no props of its own, so the controls
  // are for InputGroupAddon.
  argTypes: {
    align: {
      control: "select",
      options: ALIGNS,
      description:
        "Where the addon sits. `inline-*` puts it beside the control, `block-*` above or below it.",
      table: { defaultValue: { summary: "inline-start" } },
    },
    className: { control: "text" },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InputGroupAddon>

export default meta
type Story = StoryObj<typeof meta>

/** Use the Controls panel to move the addon. */
export const Playground: Story = {
  render: (args) => (
    <InputGroup>
      <InputGroupInput
        placeholder="Search products"
        aria-label="Search products"
      />
      <InputGroupAddon {...args}>
        <Search />
      </InputGroupAddon>
    </InputGroup>
  ),
}

/** The four `align` values, each with a text addon. */
export const Alignments: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {ALIGNS.map((align) => (
        <InputGroup key={align}>
          <InputGroupInput aria-label={align} placeholder="Value" />
          <InputGroupAddon align={align}>
            <InputGroupText>{align}</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      ))}
    </div>
  ),
}

/** Text before and after the value, such as a URL prefix or a currency. */
export const WithText: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="ig-website">Website</FieldLabel>
        <InputGroup>
          <InputGroupInput id="ig-website" placeholder="example.com" />
          <InputGroupAddon>
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Field>
        <FieldLabel htmlFor="ig-price">Price</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="ig-price"
            inputMode="decimal"
            placeholder="0.00"
            aria-describedby="ig-price-currency"
          />
          <InputGroupAddon align="inline-end">
            <InputGroupText id="ig-price-currency">THB</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText("Price")).toHaveAccessibleDescription(
      "THB"
    )
  },
}

/** Small buttons inside the box. Icon-only buttons need an `aria-label`. */
export const WithButton: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <InputGroup>
        <InputGroupInput
          aria-label="Share link"
          defaultValue="https://lab-ds.dev/p/42"
          readOnly
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            aria-label="Copy link"
            onClick={onCopy}
          >
            <Copy />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput aria-label="Search" defaultValue="linen shirt" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            aria-label="Clear search"
            onClick={onClear}
          >
            <X />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput
          aria-label="Password"
          type="password"
          defaultValue="hunter22"
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton>
            <Eye />
            Show
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Copy link" }))
    await expect(onCopy).toHaveBeenCalledOnce()
    await expect(
      canvas.getByRole("button", { name: "Copy link" })
    ).toHaveAttribute("type", "button")
  },
}

/** InputGroupButton in its four sizes. The default is `xs`. */
export const ButtonSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {BUTTON_SIZES.map((size) => (
        <InputGroup key={size}>
          <InputGroupInput
            aria-label={`Button size ${size}`}
            placeholder={size}
          />
          <InputGroupAddon align="inline-end">
            {size.startsWith("icon") ? (
              <InputGroupButton size={size} aria-label="Confirm">
                <Check />
              </InputGroupButton>
            ) : (
              <InputGroupButton size={size}>Apply</InputGroupButton>
            )}
          </InputGroupAddon>
        </InputGroup>
      ))}
    </div>
  ),
}

/** A Textarea with a toolbar below it, as in a chat box. */
export const WithTextarea: Story = {
  render: () => (
    <InputGroup>
      <InputGroupTextarea aria-label="Message" placeholder="Ask a question" />
      <InputGroupAddon align="block-end">
        <InputGroupText>0 / 500</InputGroupText>
        <InputGroupButton
          size="icon-xs"
          variant="default"
          className="ml-auto"
          aria-label="Send"
        >
          <ArrowUp />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
}

/** Each state the CSS styles: rest, `aria-invalid` on the control, and `data-disabled` on the group. Tab into one to see the focus ring. */
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <InputGroup>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput aria-label="rest" placeholder="rest" />
      </InputGroup>
      <Field data-invalid>
        <FieldLabel htmlFor="ig-invalid">Website</FieldLabel>
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput
            id="ig-invalid"
            defaultValue="not a url"
            aria-invalid
            aria-describedby="ig-invalid-error"
          />
        </InputGroup>
        <FieldError id="ig-invalid-error">
          Enter a web address like example.com
        </FieldError>
      </Field>
      <InputGroup data-disabled="true">
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          aria-label="disabled"
          placeholder="disabled"
          disabled
        />
      </InputGroup>
    </div>
  ),
}

/** Clicking an addon that isn't a button moves focus to the input. */
export const AddonFocusesInput: Story = {
  render: () => (
    <InputGroup>
      <InputGroupAddon data-testid="addon">
        <InputGroupText>https://</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput aria-label="Website" />
    </InputGroup>
  ),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByTestId("addon"))
    await expect(canvas.getByLabelText("Website")).toHaveFocus()
    await userEvent.keyboard("lab-ds.dev")
    await expect(canvas.getByLabelText("Website")).toHaveValue("lab-ds.dev")
  },
}
