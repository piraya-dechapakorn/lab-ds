# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project

A public React + TypeScript design system published to npm. Components are shadcn/ui-style source built on Base UI primitives (`@base-ui/react`, not Radix) and styled with CSS Modules that use Tailwind CSS v4 `@apply`. Storybook (`apps/storybook`) documents it. A Next.js docs app is planned but does not exist yet.

## Layout (pnpm monorepo)

- `packages/ui`: the published npm package, named `@piraya.d/ai_designsystem_lab` (scoped, published with public access). pnpm `--filter` matches this name, not the folder name. Components, tokens and styles live here. Built with tsup.
- `apps/storybook`: Storybook 10 (`@storybook/react-vite`), package name `storybook`. It depends on `@piraya.d/ai_designsystem_lab` through `workspace:*`, so it uses the built `dist`, the way an external app would.
- `apps/docs` (planned): Next.js App Router, also using `@piraya.d/ai_designsystem_lab` through `workspace:*`.
- Root: pnpm workspace config, plus shared TypeScript (`tsconfig.base.json`), ESLint (`eslint.config.mjs`) and Prettier config.

## Commands

Run these from the repo root. pnpm is pinned in the root `package.json` (`packageManager`). If `pnpm` isn't on PATH, run `npx -y pnpm@10.20.0 <args>`.

```bash
pnpm install
pnpm --filter @piraya.d/ai_designsystem_lab build        # tsup → packages/ui/dist (ESM + CJS + .d.ts + styles.css)
pnpm --filter @piraya.d/ai_designsystem_lab dev          # tsup --watch
pnpm storybook                    # builds lab-ds, then runs tsup --watch + Storybook on :6006
pnpm --filter storybook build     # static Storybook → apps/storybook/storybook-static
pnpm lint
pnpm typecheck
pnpm --filter @piraya.d/ai_designsystem_lab check:package   # after a build: component files + dist rules (see below)
pnpm --filter storybook test         # after a build: every story + play test in headless Chromium
```

There is no unit test runner. Ask before adding one. Tests are Storybook stories: `@storybook/addon-vitest` (`apps/storybook/vitest.config.ts`) renders every story in headless Chromium and fails on a render error or a failing `play` function (imported from `storybook/test`). The same results show in Storybook's Interactions panel. The first local run needs `pnpm --filter storybook exec playwright install chromium`.

`packages/ui/build/check-package.mjs` checks the rules lint and the build can't see: every component folder is exported from `src/index.ts` and has its spec, story and `.mdx` page, and the built `dist` follows the rules under **Build** and **React Server Components** below. When you add a rule there, add its check to that script.

## CI

`.github/workflows/ci.yml` runs on pull requests into `main` and on pushes to `main`. Its one job, **Check components**, runs install (frozen lockfile), the lab-ds build, lint, typecheck, `check:package`, `npm pack --dry-run`, the Storybook build and `storybook test`, in that order. Before you push, run the same commands locally. A new check goes into that job so the single required status check covers it.

## Storybook

- Stories live in `apps/storybook/src/stories/<Name>.stories.tsx`. A compound component gets a folder with one file per part (see `ProductCard/`, titled `Components/ProductCard/<Part>`) and a shared `fixtures.ts`. Fixture images are inline SVG data URIs, so stories make no network requests. All stories import from `"@piraya.d/ai_designsystem_lab"`, never from `packages/ui/src`. Stories therefore show what ships, but `@piraya.d/ai_designsystem_lab` must be built first. `pnpm storybook` builds it and keeps `tsup --watch` running.
- `src/styles.css` follows the consumer setup from the README (`@import "tailwindcss"; @import "@piraya.d/ai_designsystem_lab/styles.css";`) and sets `--font-sans` / `--font-heading`. Tailwind runs through `@tailwindcss/vite`, so layout utilities inside stories work.
- Docgen cannot read the built package, so each story file declares its `argTypes` (options, descriptions, defaults) by hand. Keep them in sync with the component's props.
- The toolbar's Theme global toggles `.dark` on `<html>` (decorator in `.storybook/preview.ts`).
- Use `Button.stories.tsx` as the pattern for new stories: a `Playground` story for controls, a grid of variants and sizes, a `States` matrix of the data and ARIA attributes the module CSS styles, and `play` tests for behaviour.
- `storybook build` warns that `"use client"` directives are ignored when bundling. This is expected.

## Component spec (write it before implementing)

Before you add or change a component, write or update its spec at `src/components/ui/<Name>/<name>.md` (lowercase name, e.g. `Button/button.md`). Then implement against it. Use `Button/button.md` as the pattern. The spec has three readers:

- **Dev**: usage examples, a props table with types and defaults, exported helpers, and which ones are server-safe.
- **Design**: every variant and size, every state with the data or ARIA attribute the module CSS styles for it, and the tokens it uses.
- **LLM**: Markdown tables that give exact prop and value names, plus the public `lds-*` class names. State each fact in a table or code block where it can be found.

Right after the one-line purpose, every spec has an **Import and use** section with three steps (see `Dialog/dialog.md`):

1. The one-time setup: `pnpm add @piraya.d/ai_designsystem_lab` and the two CSS imports from the README.
2. The import line, naming every part.
3. A minimal structure that uses those parts.

The spec is done when every prop, variant, size, styled state and public class name in the code appears in it. Update it in the same change as the code and the story's `argTypes`. It is not a build entry. The build copies the spec of every component exported from `src/index.ts` to `dist/docs/<Name>.md`, so it ships with the package.

### When a spec `.md` changes, update Storybook in the same change

- Each spec has a Guidelines page at `apps/storybook/src/stories/<Name>.mdx`. The page imports the `.md` with `?raw` and renders it through `<Markdown>`. A new spec gets a new page; copy `Dialog.mdx`. Write your changes in the `.md`, since the page only displays it. This raw import is the one place Storybook reads from `packages/ui/src`.
- Every example a spec quotes is taken from a story. When the spec changes an example, prop, variant or behaviour, update the matching story, its `argTypes` and its `play` test so they agree.
- The change is done when the Guidelines page in Storybook shows the new text and every quoted example matches its story.

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
- Consumers write `@import "tailwindcss"; @import "@piraya.d/ai_designsystem_lab/styles.css";`. They need no `@source`, because component styles are precompiled. Keep this in `packages/ui/README.md`, and in `apps/docs` once it exists.
- `sideEffects` in `package.json` lists CSS files so bundlers keep them.

**Exports.** `packages/ui/package.json` has an `exports` map with nested `import`/`require` conditions, each with its own `types` (`.d.ts` / `.d.cts`), plus `./styles.css`. `files` is limited to `dist`.

## Versioning & publishing (manual)

The npm package is versioned and published by hand, with no Changesets or CI release. Only do this when the user asks:

1. Bump `version` in `packages/ui/package.json` using semver. Any change to a public prop, export or `lds-*` class name is breaking.
2. Run `pnpm --filter @piraya.d/ai_designsystem_lab build`, then `pnpm --filter @piraya.d/ai_designsystem_lab exec npm pack --dry-run` to check what will ship.
3. Run `pnpm publish` from `packages/ui`. Use pnpm, not npm, because pnpm rewrites `workspace:` ranges.
