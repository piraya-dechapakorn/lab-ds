"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"

import { mergeClassName } from "../../../lib/utils"
import styles from "./Tabs.module.css"

export type TabsProps = TabsPrimitive.Root.Props

function Tabs({ className, orientation = "horizontal", ...props }: TabsProps) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className={mergeClassName(styles.root, className)}
      {...props}
    />
  )
}

export type TabsListVariant = "default" | "line"

export type TabsListProps = TabsPrimitive.List.Props & {
  /** Visual treatment. @default "default" */
  variant?: TabsListVariant
}

function TabsList({ className, variant = "default", ...props }: TabsListProps) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={mergeClassName(styles.list, className)}
      {...props}
    />
  )
}

export type TabsTriggerProps = TabsPrimitive.Tab.Props

function TabsTrigger({ className, ...props }: TabsTriggerProps) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={mergeClassName(styles.trigger, className)}
      {...props}
    />
  )
}

export type TabsContentProps = TabsPrimitive.Panel.Props

function TabsContent({ className, ...props }: TabsContentProps) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={mergeClassName(styles.content, className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
