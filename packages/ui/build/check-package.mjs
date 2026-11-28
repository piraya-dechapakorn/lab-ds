/**
 * Checks the rules in AGENTS.md that lint, typecheck and the build cannot see.
 * Run it after `pnpm --filter @piraya.d/ai_designsystem_lab build`:
 *
 *   pnpm --filter @piraya.d/ai_designsystem_lab check:package
 *
 * Components (source):
 *   - every component folder is exported from src/index.ts;
 *   - every component has its spec (<Name>/<name>.md), a story file and a
 *     Guidelines page (.mdx) in apps/storybook.
 *
 * Build output (dist):
 *   - no `@/` imports and no absolute local paths;
 *   - the files carrying "use client" match the source files that start with it;
 *   - every *.module.css became a non-empty class map, and its classes are in
 *     dist/styles.css;
 *   - styles.css is the only CSS file.
 *
 * Exits with code 1 and lists every problem found.
 */
import fs from "node:fs"
import path from "node:path"

const PKG_ROOT = path.resolve(import.meta.dirname, "..")
const REPO_ROOT = path.resolve(PKG_ROOT, "../..")
const SRC = path.join(PKG_ROOT, "src")
const DIST = path.join(PKG_ROOT, "dist")
const COMPONENTS = path.join(SRC, "components/ui")
const STORIES = path.join(REPO_ROOT, "apps/storybook/src/stories")

const problems = []
const fail = (msg) => problems.push(msg)
const rel = (file) => path.relative(REPO_ROOT, file)

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name)
    return d.isDirectory() ? walk(p) : [p]
  })
}

/** True when the file's directive prologue contains "use client". */
function hasUseClient(code) {
  const prologue = code.match(/^(?:\s*(?:\/\/[^\n]*\n)*\s*["'][^"']*["'];?)*/)
  return /["']use client["']/.test(prologue?.[0] ?? "")
}

// --- Components -------------------------------------------------------------

const componentNames = fs
  .readdirSync(COMPONENTS, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)

const indexSource = fs.readFileSync(path.join(SRC, "index.ts"), "utf8")

for (const name of componentNames) {
  if (!indexSource.includes(`"./components/ui/${name}"`)) {
    fail(`${name}: not exported from packages/ui/src/index.ts`)
  }

  const spec = path.join(COMPONENTS, name, `${name.toLowerCase()}.md`)
  if (!fs.existsSync(spec)) fail(`${name}: missing spec ${rel(spec)}`)

  const inFolder = (ext) => path.join(STORIES, name, `${name}${ext}`)
  const flat = (ext) => path.join(STORIES, `${name}${ext}`)
  for (const [ext, what] of [
    [".stories.tsx", "story file"],
    [".mdx", "Guidelines page"],
  ]) {
    if (!fs.existsSync(flat(ext)) && !fs.existsSync(inFolder(ext))) {
      fail(`${name}: missing ${what} ${rel(flat(ext))}`)
    }
  }
}

// --- Build output -----------------------------------------------------------

if (!fs.existsSync(DIST)) {
  fail(
    "packages/ui/dist does not exist. Run `pnpm --filter @piraya.d/ai_designsystem_lab build` first."
  )
} else {
  const distFiles = walk(DIST)
  const codeFiles = distFiles.filter((f) => /\.(c?js|d\.c?ts)$/.test(f))

  // No `@/` imports and no absolute local paths.
  const importOfAlias = /(?:from\s*|import\s*\(\s*|require\s*\(\s*)["']@\//
  const localPath = new RegExp(
    [REPO_ROOT, "/Users/", "/home/", "C:\\\\"]
      .map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|")
  )
  for (const file of distFiles) {
    const code = fs.readFileSync(file, "utf8")
    if (codeFiles.includes(file) && importOfAlias.test(code)) {
      fail(`${rel(file)}: still imports from "@/"`)
    }
    if (localPath.test(code))
      fail(`${rel(file)}: contains an absolute local path`)
  }

  // "use client" in dist matches the source.
  for (const file of walk(SRC)) {
    if (!/\.tsx?$/.test(file) || file.endsWith(".d.ts")) continue
    const wantsDirective = hasUseClient(fs.readFileSync(file, "utf8"))
    const base = path.join(
      DIST,
      path.relative(SRC, file).replace(/\.tsx?$/, "")
    )
    for (const ext of [".js", ".cjs"]) {
      const out = base + ext
      if (!fs.existsSync(out)) {
        fail(`${rel(file)}: no built ${path.basename(out)} in dist`)
        continue
      }
      const has = hasUseClient(fs.readFileSync(out, "utf8"))
      if (wantsDirective && !has) fail(`${rel(out)}: missing "use client"`)
      if (!wantsDirective && has)
        fail(`${rel(out)}: has "use client" but its source does not`)
    }
  }

  // Class maps are non-empty and their classes are in styles.css.
  const stylesPath = path.join(DIST, "styles.css")
  const styles = fs.existsSync(stylesPath)
    ? fs.readFileSync(stylesPath, "utf8")
    : ""
  if (!styles) fail("packages/ui/dist/styles.css is missing or empty")

  const builtJs = distFiles
    .filter((f) => f.endsWith(".js"))
    .map((f) => fs.readFileSync(f, "utf8"))
    .join("\n")
  const classMap = /\/\/ css-module:(\S+)#lds\s*\n\s*var \w+ = (\{[^\n]*\});/g
  const maps = new Map()
  for (const [, source, json] of builtJs.matchAll(classMap)) {
    maps.set(source, JSON.parse(json))
  }

  for (const file of walk(SRC).filter((f) => f.endsWith(".module.css"))) {
    const key = path.relative(PKG_ROOT, file)
    const classes = maps.get(key)
    if (!classes) {
      fail(`${key}: no class map found in the built .js files`)
      continue
    }
    if (Object.keys(classes).length === 0) {
      fail(
        `${key}: built class map is empty ({}); the #lds interception has broken`
      )
    }
    for (const scoped of Object.values(classes)) {
      for (const cls of String(scoped).split(/\s+/)) {
        // postcss-modules also maps @keyframes names.
        const inStyles =
          styles.includes(`.${cls}`) || styles.includes(`@keyframes ${cls}`)
        if (!inStyles) fail(`${key}: ${cls} is not in dist/styles.css`)
      }
    }
  }

  // Every exported component ships its spec as dist/docs/<Name>.md, and
  // nothing else lands in dist/docs.
  const docsDir = path.join(DIST, "docs")
  const shippedDocs = fs.existsSync(docsDir) ? fs.readdirSync(docsDir) : []
  for (const name of componentNames) {
    if (!shippedDocs.includes(`${name}.md`))
      fail(`${name}: missing dist/docs/${name}.md`)
  }
  for (const doc of shippedDocs) {
    if (!componentNames.includes(doc.replace(/\.md$/, "")))
      fail(`dist/docs/${doc}: no exported component of that name`)
  }

  // styles.css is the only CSS file.
  for (const file of distFiles.filter((f) => f.endsWith(".css"))) {
    if (file !== stylesPath) fail(`${rel(file)}: unexpected CSS file in dist`)
  }
}

if (problems.length) {
  console.error(`check-package found ${problems.length} problem(s):\n`)
  for (const p of problems) console.error(`  ✗ ${p}`)
  process.exit(1)
}
console.log(
  `check-package: ${componentNames.length} components and dist look right.`
)
