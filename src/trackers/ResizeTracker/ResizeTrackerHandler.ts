import type { ResizeTrackerEntry } from "./ResizeTrackerEntry";

/**
 * The function called whenever a resize change is tracked by `ResizeTracker`.
 *
 * @param {ResizeTrackerEntry[]} entry The new dimensions of the tracked elements.
 */
export type ResizeTrackerHandler = (entries: ResizeTrackerEntry[]) => void;
