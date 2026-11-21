import { cn } from "cn"

export { cn }

/**
 * Merge a component's own (CSS Module) class with a consumer `className`.
 *
 * Base UI primitives accept `className` as either a string or a function of
 * the component state, so both forms are preserved here.
 */
export function mergeClassName<State>(
  base: string | undefined,
  className?: string | ((state: State) => string | undefined)
): string | ((state: State) => string) {
  if (typeof className === "function") {
    return (state: State) => cn(base, className(state))
  }
  return cn(base, className)
}
