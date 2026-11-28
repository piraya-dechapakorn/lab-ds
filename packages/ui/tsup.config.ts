import fs from "node:fs"
import path from "node:path"

import type { Plugin } from "esbuild"
import { defineConfig } from "tsup"

import { compileCssModule, PKG_ROOT, writeStylesheet } from "./build/css"

const SRC = path.join(PKG_ROOT, "src")
const DIST = path.join(PKG_ROOT, "dist")
const SOURCE_EXTS = [".tsx", ".ts"]

/** Compiled CSS per module file, shared by the ESM and CJS builds. */
const moduleCss = new Map<string, string>()

function resolveSourceFile(base: string) {
  const candidates = [
    ...SOURCE_EXTS.map((ext) => base + ext),
    ...SOURCE_EXTS.map((ext) => path.join(base, "index" + ext)),
  ]
  return candidates.find((file) => fs.existsSync(file))
}

/**
 * Every source file is its own entry (so each keeps its own "use client").
 * This plugin:
 *  - turns `*.module.css` imports into a class-name map and collects the CSS;
 *  - keeps imports of other source files (relative or `@/`) as imports of the
 *    matching file in `dist`, instead of inlining a second copy;
 *  - writes `dist/styles.css` once the JS is built.
 */
function labDs(): Plugin {
  return {
    name: "@piraya.d/ai_designsystem_lab",
    setup(build) {
      const outExt = build.initialOptions.format === "cjs" ? ".cjs" : ".js"

      // The path is package-relative so no local path ends up in dist; the
      // `#lds` suffix keeps tsup's own `*.css` handling from loading it.
      build.onResolve({ filter: /\.module\.css$/ }, (args) => ({
        path:
          path.relative(PKG_ROOT, path.resolve(args.resolveDir, args.path)) +
          "#lds",
        namespace: "css-module",
      }))

      build.onLoad({ filter: /#lds$/, namespace: "css-module" }, async (args) => {
        const file = path.join(PKG_ROOT, args.path.slice(0, -"#lds".length))
        const { css, classes } = await compileCssModule(file)
        moduleCss.set(file, css)
        return {
          contents: `export default ${JSON.stringify(classes)}`,
          loader: "js",
          watchFiles: [file],
        }
      })

      build.onResolve({ filter: /^(\.{1,2}\/|@\/)/ }, (args) => {
        if (args.kind === "entry-point" || args.path.endsWith(".css")) return
        const base = args.path.startsWith("@/")
          ? path.join(SRC, args.path.slice(2))
          : path.resolve(args.resolveDir, args.path)
        const target = resolveSourceFile(base)
        if (!target) return
        let rel = path
          .relative(args.resolveDir, target)
          .replace(/\.tsx?$/, outExt)
        if (!rel.startsWith(".")) rel = "./" + rel
        return { path: rel, external: true }
      })

      build.onEnd(async (result) => {
        if (result.errors.length) return
        await writeStylesheet(path.join(DIST, "styles.css"), moduleCss)
      })
    },
  }
}

/**
 * esbuild drops module-level directives when bundling, so put "use client"
 * back on every built file whose source starts with it.
 */
function restoreUseClient() {
  const walk = (dir: string): string[] =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
      const p = path.join(dir, d.name)
      return d.isDirectory() ? walk(p) : [p]
    })

  for (const file of walk(SRC)) {
    if (!/\.tsx?$/.test(file) || file.endsWith(".d.ts")) continue
    const head = fs.readFileSync(file, "utf8").trimStart()
    if (!/^["']use client["']/.test(head)) continue

    const rel = path.relative(SRC, file).replace(/\.tsx?$/, "")
    for (const ext of [".js", ".cjs"]) {
      const out = path.join(DIST, rel + ext)
      if (!fs.existsSync(out)) continue
      const code = fs.readFileSync(out, "utf8")
      // Already in the directive prologue (CJS puts "use strict" first)?
      const prologue = code.match(/^(?:\s*(?:\/\/[^\n]*\n)*\s*["'][^"']*["'];?)*/)
      if (!/["']use client["']/.test(prologue?.[0] ?? "")) {
        fs.writeFileSync(out, `"use client";\n${code}`)
      }
    }
  }
}

/**
 * Ship each exported component's spec as dist/docs/<Name>.md. Only folders
 * re-exported from src/index.ts count, so private components never ship docs.
 */
function copySpecs() {
  const index = fs.readFileSync(path.join(SRC, "index.ts"), "utf8")
  const exported = [
    ...index.matchAll(/from\s+["']\.\/components\/ui\/([^"'/]+)["']/g),
  ].map((m) => m[1])

  const docs = path.join(DIST, "docs")
  fs.mkdirSync(docs, { recursive: true })
  for (const name of exported) {
    const spec = path.join(SRC, "components/ui", name, `${name.toLowerCase()}.md`)
    if (fs.existsSync(spec)) fs.copyFileSync(spec, path.join(docs, `${name}.md`))
  }
}

export default defineConfig({
  entry: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: false,
  splitting: false,
  treeshake: false,
  target: "es2020",
  platform: "browser",
  outDir: "dist",
  esbuildPlugins: [labDs()],
  esbuildOptions(options) {
    options.jsx = "automatic"
  },
  onSuccess: async () => {
    restoreUseClient()
    copySpecs()
  },
})
