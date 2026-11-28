import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import {
  Badge,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@piraya.d/ai_designsystem_lab"
import type { TableDensity } from "@piraya.d/ai_designsystem_lab"
import { expect, userEvent, within } from "storybook/test"

const INVOICES = [
  {
    id: "INV-001",
    customer: "Piraya D.",
    status: "Paid",
    method: "Credit card",
    amount: 2490,
  },
  {
    id: "INV-002",
    customer: "Somchai K.",
    status: "Pending",
    method: "PromptPay",
    amount: 990,
  },
  {
    id: "INV-003",
    customer: "Anong S.",
    status: "Unpaid",
    method: "Bank transfer",
    amount: 12350,
  },
  {
    id: "INV-004",
    customer: "Mali T.",
    status: "Paid",
    method: "PromptPay",
    amount: 349.5,
  },
  {
    id: "INV-005",
    customer: "Krit P.",
    status: "Paid",
    method: "Credit card",
    amount: 5600,
  },
]

const baht = (n: number) =>
  new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB" }).format(
    n
  )

const TOTAL = INVOICES.reduce((sum, i) => sum + i.amount, 0)

const meta = {
  title: "Components/Table",
  component: Table,
  parameters: { layout: "padded" },
  args: { density: "default", stickyHeader: false },
  // Props are declared by hand: stories import the built package, which
  // docgen cannot read. These are the Table props.
  argTypes: {
    density: {
      control: "select",
      options: ["default", "compact"] satisfies TableDensity[],
      description: "`compact` uses smaller text and shorter rows.",
      table: { defaultValue: { summary: "default" } },
    },
    stickyHeader: {
      control: "boolean",
      description: "Keeps the header row in view while the container scrolls.",
      table: { defaultValue: { summary: "false" } },
    },
    containerClassName: {
      control: "text",
      description: "Class for the scroll container around the `<table>`.",
    },
    className: { control: "text" },
    children: { control: false },
  },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

/** Caption, header, body and footer, with the amount column aligned to the end. */
function InvoiceTable(props: React.ComponentProps<typeof Table>) {
  return (
    <Table {...props}>
      <TableCaption>Invoices for November 2026</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead scope="col">Invoice</TableHead>
          <TableHead scope="col">Customer</TableHead>
          <TableHead scope="col">Status</TableHead>
          <TableHead scope="col">Method</TableHead>
          <TableHead scope="col" align="end">
            Amount
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {INVOICES.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableHead scope="row" className="font-medium">
              {invoice.id}
            </TableHead>
            <TableCell>{invoice.customer}</TableCell>
            <TableCell>
              <Badge
                variant={
                  invoice.status === "Unpaid"
                    ? "destructive"
                    : invoice.status === "Pending"
                      ? "outline"
                      : "secondary"
                }
              >
                {invoice.status}
              </Badge>
            </TableCell>
            <TableCell>{invoice.method}</TableCell>
            <TableCell align="end">{baht(invoice.amount)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableHead scope="row" colSpan={4}>
            Total
          </TableHead>
          <TableCell align="end">{baht(TOTAL)}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

/** Use the Controls panel to try each prop. */
export const Playground: Story = {
  render: (args) => <InvoiceTable {...args} />,
  play: async ({ canvas }) => {
    const table = canvas.getByRole("table", {
      name: "Invoices for November 2026",
    })
    const amount = within(table).getByRole("columnheader", { name: "Amount" })
    await expect(amount).toHaveAttribute("data-align", "end")
    await expect(
      within(table).getByRole("rowheader", { name: "INV-003" })
    ).toBeVisible()
  },
}

/** `compact` for dense data such as admin lists. */
export const Compact: Story = {
  args: { density: "compact" },
  render: (args) => <InvoiceTable {...args} />,
}

/** The header stays in view while the container scrolls. Give the container a height. */
export const StickyHeader: Story = {
  args: {
    stickyHeader: true,
    containerClassName: "max-h-48 overflow-y-auto rounded-xl border",
  },
  render: (args) => <InvoiceTable {...args} />,
  play: async ({ canvasElement }) => {
    const head = canvasElement.querySelector("th")!
    await expect(getComputedStyle(head).position).toBe("sticky")
  },
}

/** `align` on head and cell: `start`, `center`, `end`. Use `end` for numbers so the digits line up. */
export const Alignment: Story = {
  render: (args) => (
    <Table {...args}>
      <TableHeader>
        <TableRow>
          <TableHead scope="col">start</TableHead>
          <TableHead scope="col" align="center">
            center
          </TableHead>
          <TableHead scope="col" align="end">
            end
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[12, 1290, 349.5].map((n) => (
          <TableRow key={n}>
            <TableCell>Item</TableCell>
            <TableCell align="center">{n % 2 ? "Yes" : "No"}</TableCell>
            <TableCell align="end">{baht(n)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}

/**
 * Selectable rows: a checkbox in each row does the selecting, so keyboard and
 * screen-reader users can use it. `data-state="selected"` highlights the row.
 */
export const SelectableRows: Story = {
  render: function SelectableTable(args) {
    const [selected, setSelected] = React.useState<string[]>([])
    const toggle = (id: string) =>
      setSelected((ids) =>
        ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]
      )
    return (
      <Table {...args} aria-label="Customers">
        <TableHeader>
          <TableRow>
            <TableHead scope="col" className="w-8">
              <span className="sr-only">Select</span>
            </TableHead>
            <TableHead scope="col">Customer</TableHead>
            <TableHead scope="col" align="end">
              Amount
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {INVOICES.slice(0, 3).map((invoice) => {
            const isSelected = selected.includes(invoice.id)
            return (
              <TableRow
                key={invoice.id}
                data-state={isSelected ? "selected" : undefined}
              >
                <TableCell>
                  <input
                    type="checkbox"
                    className="size-4 align-middle"
                    checked={isSelected}
                    onChange={() => toggle(invoice.id)}
                    aria-label={`Select ${invoice.customer}`}
                  />
                </TableCell>
                <TableCell>{invoice.customer}</TableCell>
                <TableCell align="end">{baht(invoice.amount)}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    )
  },
  play: async ({ canvas }) => {
    const checkbox = canvas.getByRole("checkbox", { name: "Select Somchai K." })
    await userEvent.click(checkbox)
    await expect(checkbox).toBeChecked()
    await expect(checkbox.closest("tr")).toHaveAttribute(
      "data-state",
      "selected"
    )
  },
}

/** A wide table scrolls sideways inside its container instead of widening the page. */
export const WideTable: Story = {
  render: (args) => (
    <div className="max-w-sm">
      <InvoiceTable {...args} className="min-w-[36rem]" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const container = canvasElement.querySelector<HTMLElement>(
      '[data-slot="table-container"]'
    )!
    await expect(container.scrollWidth).toBeGreaterThan(container.clientWidth)
  },
}
