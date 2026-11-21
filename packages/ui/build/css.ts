/**
 * CSS build for lab-ds.
 *
 * Components are styled with CSS Modules (`*.module.css`) that use Tailwind
 * `@apply` against `src/styles/globals.css`. The package ships them
 * precompiled, so consumers never run Tailwind over the component styles:
 *
 *   1. each module is compiled with Tailwind, then scoped by postcss-modules
 *      to stable names (`lds-<Component>-<class>`, e.g. `lds-Button-root`);
 *   2. the module's JS side becomes a plain `{ root: "lds-Button-root" }` map;
 *   3. everything is concatenated into `dist/styles.css` together with the
 *      design tokens, the `@theme inline` mapping and the base layer taken
 *      from globals.css.
 */
import fs from "node:fs"
import path from "node:path"

import tailwind from "@tailwindcss/postcss"
import postcss, { type AtRule, type ChildNode, type Root } from "postcss"
import postcssModules from "postcss-modules"

/**
 * Package root: the nearest folder with lab-ds's package.json. Found by
 * walking up because tsup runs this file from a bundled copy of its config.
 */
function findPackageRoot(start: string) {
  for (let dir = start; dir !== path.dirname(dir); dir = path.dirname(dir)) {
    const pkg = path.join(dir, "package.json")
    if (
      fs.existsSync(pkg) &&
      JSON.parse(fs.readFileSync(pkg, "utf8")).name === "lab-ds"
    ) {
      return dir
    }
  }
  throw new Error(`lab-ds package.json not found above ${start}`)
}

export const PKG_ROOT = findPackageRoot(import.meta.dirname)
const GLOBALS = path.join(PKG_ROOT, "src/styles/globals.css")

/** Layer order shared with Tailwind; component layers sit inside `components`. */
const LAYER_ORDER = [
  "@layer properties, theme, base, components, utilities;",
  "@layer components.primitive, components.composite;",
]

/**
 * Tailwind utilities used directly as class names in component markup
 * (not through a CSS Module). They are compiled in so the components look
 * right even if the consumer's Tailwind never scans this package.
 */
const MARKUP_UTILITIES = ["sr-only"]

function tailwindPlugin() {
  // `optimize` runs Lightning CSS, which flattens CSS nesting so the output
  // works without a nesting-aware browser or bundler. Minifying is left to
  // the consumer.
  return tailwind({ base: PKG_ROOT, optimize: { minify: false } })
}

function componentName(file: string) {
  return path.basename(file).replace(/\.module\.css$/, "")
}

/** Compile one CSS Module: Tailwind first, then scope the class names. */
export async function compileCssModule(file: string) {
  let classes: Record<string, string> = {}
  const name = componentName(file)
  const source = fs.readFileSync(file, "utf8")

  const result = await postcss([
    tailwindPlugin(),
    postcssModules({
      generateScopedName: (local: string) => `lds-${name}-${local}`,
      getJSON: (_file: string, json: Record<string, string>) => {
        classes = json
      },
    }),
  ]).process(source, { from: file })

  return { css: result.css, classes }
}

/** Split globals.css into the parts that ship in styles.css. */
async function globalsParts() {
  const root = postcss.parse(fs.readFileSync(GLOBALS, "utf8"), {
    from: GLOBALS,
  })

  const theme: string[] = [] // Tailwind directives, kept as source
  const tokens: string[] = [] // :root / .dark custom properties
  const base: string[] = [] // @layer base, compiled below

  root.each((node) => {
    if (node.type === "atrule") {
      if (node.name === "custom-variant" || node.name === "theme") {
        // a body-less at-rule loses its `;` when printed on its own
        theme.push(node.toString() + (node.nodes ? "" : ";"))
      } else if (node.name === "layer" && node.params === "base") {
        base.push(node.toString())
      }
    } else if (node.type === "rule") {
      tokens.push(node.toString())
    }
  })

  const compiledBase = await postcss([tailwindPlugin()]).process(
    [`@reference "./globals.css";`, ...base].join("\n"),
    { from: path.join(PKG_ROOT, "src/styles/__base.css") }
  )

  const utilities = await postcss([tailwindPlugin()]).process(
    [
      `@import "tailwindcss/utilities.css" layer(utilities) source(none);`,
      ...MARKUP_UTILITIES.map((c) => `@source inline("${c}");`),
    ].join("\n"),
    { from: path.join(PKG_ROOT, "src/styles/__utilities.css") }
  )

  return {
    theme: theme.join("\n\n"),
    tokens: tokens.join("\n\n"),
    base: compiledBase.css,
    utilities: utilities.css,
  }
}

/**
 * `@property` rules tw-animate-css declares at the top level. The app gets
 * them from `@import "tw-animate-css"` in globals.css; compiling a module
 * with `@reference` does not emit them, so they are copied here.
 */
function twAnimateProperties() {
  // tw-animate-css exports only its `style` condition, so read it by path.
  const file = path.join(
    PKG_ROOT,
    "node_modules/tw-animate-css/dist/tw-animate.css"
  )
  const root = postcss.parse(fs.readFileSync(file, "utf8"))
  const out: string[] = []
  root.each((node) => {
    if (node.type === "atrule" && node.name === "property") {
      out.push(node.toString())
    }
  })
  return out.join("\n")
}

/**
 * Drop what every compiled chunk repeats: Tailwind banners, the layer order
 * statements, and identical top-level `@property` / `@keyframes` rules.
 */
function dedupe(root: Root) {
  const seen = new Set<string>()

  root.walkComments((c) => {
    if (c.text.startsWith("! tailwindcss")) c.remove()
  })

  root.each((node: ChildNode) => {
    if (node.type !== "atrule") return
    const rule = node as AtRule
    const isLayerStatement = rule.name === "layer" && !rule.nodes
    if (
      isLayerStatement ||
      rule.name === "property" ||
      rule.name === "keyframes"
    ) {
      const key = rule.toString().replace(/\s+/g, " ")
      if (seen.has(key)) rule.remove()
      else seen.add(key)
    }
  })
}

/** Assemble dist/styles.css from the compiled module chunks. */
export async function writeStylesheet(
  outFile: string,
  moduleCss: Map<string, string>
) {
  const parts = await globalsParts()
  const modules = [...moduleCss.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([file, css]) => `/* ${path.relative(PKG_ROOT, file)} */\n${css}`)

  const root = postcss.parse(
    [
      "/*! lab-ds styles — import after `@import \"tailwindcss\"`. */",
      ...LAYER_ORDER,
      "/* ---- theme (read by the consumer's Tailwind) ---- */",
      parts.theme,
      "/* ---- design tokens ---- */",
      parts.tokens,
      "/* ---- base ---- */",
      parts.base,
      "/* ---- utilities used in component markup ---- */",
      parts.utilities,
      "/* ---- components ---- */",
      ...modules,
      twAnimateProperties(),
    ].join("\n\n")
  )
  dedupe(root)

  fs.mkdirSync(path.dirname(outFile), { recursive: true })
  fs.writeFileSync(outFile, root.toString())
}
