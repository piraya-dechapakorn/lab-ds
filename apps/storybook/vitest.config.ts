import path from "node:path"

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin"
import { playwright } from "@vitest/browser-playwright"
import { defineConfig } from "vitest/config"

/**
 * Runs every story as a test in headless Chromium: the story must render
 * without errors, and its `play` function (if any) must pass.
 *
 *   pnpm --filter storybook test
 *
 * Like Storybook itself, this uses the built `@piraya.d/ai_designsystem_lab`, so build it first.
 */
export default defineConfig({
  plugins: [
    storybookTest({ configDir: path.join(import.meta.dirname, ".storybook") }),
  ],
  test: {
    name: "storybook",
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }],
    },
  },
})
