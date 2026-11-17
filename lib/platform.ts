import { useSyncExternalStore } from "react"

export type ModKey = "⌘" | "Ctrl"

const APPLE_PLATFORM = /Mac|iPhone|iPad/

// The platform never changes during a session, so there is nothing to subscribe to.
const subscribe = () => () => {}
const getClientSnapshot = (): ModKey =>
  APPLE_PLATFORM.test(navigator.platform) ? "⌘" : "Ctrl"
const getServerSnapshot = (): ModKey => "Ctrl"

/**
 * Label for the platform's primary shortcut modifier.
 * Returns "Ctrl" on the server and during hydration (so markup matches),
 * then "⌘" after mount on Apple platforms.
 */
export function useModKey(): ModKey {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)
}
