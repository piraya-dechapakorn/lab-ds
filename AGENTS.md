# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project

A public React + TypeScript design system published to npm. Components are shadcn/ui-style source built on Base UI primitives (`@base-ui/react`, not Radix) and styled with CSS Modules that use Tailwind CSS v4 `@apply`. A Next.js docs app and Storybook will document it; neither exists yet.

## Layout (pnpm monorepo)

- `packages/ui`: the published npm package, named `lab-ds` (unscoped). pnpm `--filter` matches this name, not the folder name. Components, tokens and styles live here. Built with tsup.
- `apps/*`: planned home for `apps/docs` (Next.js App Router, using the package through `workspace:*` like an external app would) and Storybook. Already covered by `pnpm-workspace.yaml`.
- Root: pnpm workspace config, plus shared TypeScript (`tsconfig.base.json`), ESLint (`eslint.config.mjs`) and Prettier config.

## Commands

Run these from the repo root. pnpm is pinned in the root `package.json` (`packageManager`). If `pnpm` isn't on PATH, run `npx -y pnpm@10.20.0 <args>`.

```bash
pnpm install
pnpm --filter lab-ds build        # tsup → packages/ui/dist (ESM + CJS + .d.ts + styles.css)
pnpm --filter lab-ds dev          # tsup --watch
pnpm lint
pnpm typecheck
```

There is no test runner yet. Ask before adding one.

## Architecture rules

**Components are source, not a dependency.** Add them with the shadcn CLI from `packages/ui`, which has its own `components.json`. The output lands in `src/components/ui/<Name>/` as `<Name>.tsx` + `<Name>.module.css` + `index.ts`, and is owned and edited here from then on. Class merging goes through `cn()` / `mergeClassName()` in `src/lib/utils.ts`. Use `mergeClassName` for Base UI parts, whose `className` can be a function of state.

**The package must work outside this repo:**
- `packages/ui` imports nothing from `next/*`. Next.js belongs to `apps/docs`.
- `react` and `react-dom` are `peerDependencies`. Runtime imports (`@base-ui/react`, `cn`, `input-otp`, `lucide-react`) are `dependencies`. Build-only CSS inputs (`tailwindcss`, `tw-animate-css`, `shadcn`) are `devDependencies`, because their output is compiled into `styles.css`.
- Component code uses relative imports. The build also resolves the `@/` imports the shadcn CLI generates. After a build, `dist` contains no `@/` and no absolute `/Users/…` paths.
- Every public component is exported from `src/index.ts`. Anything not exported there is private.

**Build (`tsup.config.ts` + `build/css.ts`).** Every source file is its own entry, so `dist` mirrors `src`:
- Imports of sibling source files stay as imports of the built sibling (`../Button/index.js` or `.cjs`). They are never inlined twice.
- `*.module.css` imports load through the plugin under a `#lds` suffix. The suffix keeps tsup's built-in CSS handling from taking them, which would silently produce empty class maps.
- If a new module's classes come out `{}`, or a per-component `.css` file shows up in `dist`, that interception has broken.

**React Server Components.** Interactive components start with `"use client"`. esbuild drops module-level directives, so `restoreUseClient()` writes them back into each built `.js` and `.cjs`. Server-safe files must stay directive-free: `buttonStyles`, `badgeStyles` and `formatPrice` have to stay callable from server code. After a build, the files carrying `"use client"` in `dist` match the source files that start with it.

**Styling (precompiled CSS Modules):**
- Design tokens are CSS variables in `src/styles/globals.css`, on `:root` with overrides under `.dark`. The same file maps them to utilities with `@theme inline`. Dark mode overrides the variables. There is no `tailwind.config.js`.
- Each `*.module.css` starts with `@reference "../../../styles/globals.css";` and sits in `@layer components.primitive` (or `components.composite` for components that restyle other components). That keeps consumer utilities winning.
- `build/css.ts` compiles each module with Tailwind, scopes class names to `lds-<Component>-<class>`, and writes a single `dist/styles.css`. That file holds the tokens, the `@theme inline` block, the base layer and the component CSS. Those class names are effectively public: consumers may target them, so renaming a module class is a breaking change.
- A Tailwind utility used directly in markup (not through a module) must be listed in `MARKUP_UTILITIES` in `build/css.ts`. Today the list is `sr-only`.
- Consumers write `@import "tailwindcss"; @import "lab-ds/styles.css";`. They need no `@source`, because component styles are precompiled. Keep this in `packages/ui/README.md`, and in `apps/docs` once it exists.
- `sideEffects` in `package.json` lists CSS files so bundlers keep them.

**Exports.** `packages/ui/package.json` has an `exports` map with nested `import`/`require` conditions, each with its own `types` (`.d.ts` / `.d.cts`), plus `./styles.css`. `files` is limited to `dist`.

## Versioning & publishing (manual)

The npm package is versioned and published by hand, with no Changesets or CI release. Only do this when the user asks:

1. Bump `version` in `packages/ui/package.json` using semver. Any change to a public prop, export or `lds-*` class name is breaking.
2. Run `pnpm --filter lab-ds build`, then `pnpm --filter lab-ds exec npm pack --dry-run` to check what will ship.
3. Run `pnpm publish` from `packages/ui`. Use pnpm, not npm, because pnpm rewrites `workspace:` ranges.
