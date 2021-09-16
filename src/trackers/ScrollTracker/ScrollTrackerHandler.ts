import type { ScrollTrackerEntry } from "./ScrollTrackerEntry";

/**
 * The function called whenever a scrollbar position change is tracked by `ScrollTracker`.
 *
 * @param {ScrollTrackerEntry} entry The new scroll info of the tracked element.
 */
export type ScrollTrackerHandler = (entries: ScrollTrackerEntry) => void;
