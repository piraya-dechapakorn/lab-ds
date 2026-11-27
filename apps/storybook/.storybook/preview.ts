import type { Decorator, Preview } from "@storybook/react-vite"

import "../src/styles.css"

/** Toggles `.dark` on <html>, which is how lab-ds switches themes. */
const withTheme: Decorator = (Story, context) => {
  document.documentElement.classList.toggle(
    "dark",
    context.globals.theme === "dark"
  )
  return Story()
}

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: "lab-ds colour theme",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "light" },
  parameters: {
    layout: "centered",
    backgrounds: { disable: true },
    controls: { expanded: true, sort: "requiredFirst" },
  },
  tags: ["autodocs"],
}

export default preview
