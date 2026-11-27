# Table

## Purpose

Rows and columns of data that people scan, compare and look up, such as invoices or orders.

## Import and use

**1. Set up once per app.** Install the package, then import its styles once, after Tailwind, in your global CSS file. The package README has the full setup.

```bash
pnpm add lab-ds
```

```css
@import "tailwindcss";
@import "lab-ds/styles.css";
```

**2. Import the parts you need** from `lab-ds`:

```tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "lab-ds"
```

**3. Build the table** from this structure. Each part is the matching HTML table element:

```tsx
<Table>
  <TableCaption>Invoices for November 2026</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead scope="col">Invoice</TableHead>
      <TableHead scope="col" align="end">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableHead scope="row">INV-001</TableHead>
      <TableCell align="end">฿2,490.00</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

Table works in React Server Components.

## When to use

- Data with the same fields for every item, where people compare values across rows or read along a row.
- Numbers that need to line up, such as prices or totals.

## When not to use

| Situation | Use instead |
| --- | --- |
| Laying out a page or a form | CSS grid or flex. Screen readers would read a layout table as data |
| A short list of items with one or two facts each | A list |
| Items people browse by picture, such as products | A grid of cards, such as **ProductCard** |
| Very wide data that must work on phones | Fewer columns, or one card per row on small screens |

## Content guidance

- **Caption:** give every table a `TableCaption` that says what it holds, such as "Invoices for November 2026". Screen readers use it as the table's name. If a visible caption doesn't fit, use `aria-label` on `Table` (see the `SelectableRows` story).
- **Headers:** short nouns in sentence case. Put the unit in the header, such as "Weight (kg)", rather than in every cell.
- **Row headers:** make the first cell that names the row a `TableHead` with `scope="row"`, such as the invoice number.
- **Numbers:** align them with `align="end"`, use the same number of decimals in a column, and format currency and dates the same way in every row.
- **Empty cells:** show "–" or "None" rather than leaving a cell blank, so it doesn't look like the data failed to load.
- **Status:** use a **Badge** with words, not colour alone.

## Behaviour

- **Wide tables:** the table sits in a container that scrolls sideways, so a wide table never widens the page (see the `WideTable` story).
- **Sticky header:** with `stickyHeader`, the header row stays in view while the container scrolls. Give the container a height with `containerClassName`, such as `max-h-96 overflow-y-auto`.
- **Hover:** a row gets a light fill under the pointer, to help the eye follow it.
- **Selected rows:** put a checkbox in the first cell of each row, labelled with the row's name, such as "Select Somchai K.", and set `data-state="selected"` on the `TableRow` to highlight it (see the `SelectableRows` story). The checkbox is what keyboard and screen-reader users use. `aria-selected` isn't valid on rows of a plain table. The table doesn't manage selection itself.
- **Clickable rows:** a row isn't a link. When a row leads somewhere, put a real link in its first cell, such as the invoice number.
- **Footer:** `TableFooter` has a top border and a light fill, for totals.

## Props and variants

**`Table`**

| Prop | Values | Default | Use |
| --- | --- | --- | --- |
| `density` | `default`, `compact` | `default` | `compact` uses 12px text, 32px header rows and less cell padding, for dense admin data |
| `stickyHeader` | `true`, `false` | `false` | Keeps the header row in view while the container scrolls |
| `containerClassName` | string | | Class for the scroll container around the table, for a height, border or rounded corners |
| `className` | string | | Class for the `<table>` itself |

**`TableHead` and `TableCell`**

| Prop | Values | Default | Use |
| --- | --- | --- | --- |
| `align` | `start`, `center`, `end` | `start` | Text alignment. `end` also uses digits of equal width, so numbers line up |
| `scope` | `col`, `row` | | On `TableHead`: whether it heads a column or a row |

**`TableRow`**

| Prop | Values | Default | Use |
| --- | --- | --- | --- |
| `data-state` | `selected` | | Highlights the row |

`TableHeader`, `TableBody`, `TableFooter` and `TableCaption` take the attributes of their HTML element and have no props of their own.

## States

| State | How to set it | Look |
| --- | --- | --- |
| Row rest | | 1px `--border` line below each row, none after the last one |
| Row hover | Pointer over a row | `--muted` fill at 50% |
| Row selected | `data-state="selected"` on `TableRow`, with a checked checkbox in the row | `--muted` fill |

## Tokens used

| Token | Where |
| --- | --- |
| `--border` | Lines between rows, below the header and above the footer |
| `--foreground` | Header text |
| `--muted` | Row hover (50%), selected row and footer (50%) fills |
| `--muted-foreground` | Caption text |
| `--background` | Header background when `stickyHeader` is on, so rows scroll under it |

Every token has a dark-mode value.

## Gaps against industry standards

- TODO: **The scroll container can't be reached by keyboard.** When a table scrolls sideways, keyboard users need to focus the container to scroll it. The usual fix is `tabindex="0"`, `role="region"`, `aria-labelledby` pointing at the caption, and a visible focus ring on the container ([Adrian Roselli](https://adrianroselli.com/2020/11/under-engineered-responsive-tables.html)). `containerClassName` can't set these attributes.
- TODO: **There is no sorting.** Sortable columns need a button in the header and `aria-sort` on the `TableHead` ([WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/patterns/table/examples/sortable-table/)).
- TODO: **The caption sits below the table.** Screen readers still use it as the name, but sighted users read it last. Many systems put it above.
- TODO: **There is no empty or loading state.**
- TODO: **A sticky header can cover rows** when the page is zoomed in or the container is short.

## Example

Invoices with a caption, row headers and a total, from the `Playground` story in `Table.stories.tsx`:

```tsx
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
} from "lab-ds"

<Table>
  <TableCaption>Invoices for November 2026</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead scope="col">Invoice</TableHead>
      <TableHead scope="col">Customer</TableHead>
      <TableHead scope="col">Status</TableHead>
      <TableHead scope="col">Method</TableHead>
      <TableHead scope="col" align="end">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableHead scope="row" className="font-medium">INV-003</TableHead>
      <TableCell>Anong S.</TableCell>
      <TableCell>
        <Badge variant="destructive">Unpaid</Badge>
      </TableCell>
      <TableCell>Bank transfer</TableCell>
      <TableCell align="end">฿12,350.00</TableCell>
    </TableRow>
    {/* one TableRow per invoice */}
  </TableBody>
  <TableFooter>
    <TableRow>
      <TableHead scope="row" colSpan={4}>Total</TableHead>
      <TableCell align="end">฿21,779.50</TableCell>
    </TableRow>
  </TableFooter>
</Table>
```

## Class names

The built CSS scopes these classes. Consumers may target them, so renaming one is a breaking change.

| Part | Class |
| --- | --- |
| Scroll container | `lds-Table-container` |
| `Table` | `lds-Table-root` |
| `TableHeader` | `lds-Table-header` |
| `TableBody` | `lds-Table-body` |
| `TableFooter` | `lds-Table-footer` |
| `TableRow` | `lds-Table-row` |
| `TableHead` | `lds-Table-head` |
| `TableCell` | `lds-Table-cell` |
| `TableCaption` | `lds-Table-caption` |

## Storybook

Stories are in `apps/storybook/src/stories/Table.stories.tsx`. Keep their `argTypes` in sync with the props above.
