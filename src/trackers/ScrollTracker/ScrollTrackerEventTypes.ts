import type { ScrollTrackerEntry } from "./ScrollTrackerEntry";

/**
 * Represents the event types of the {@link ScrollTracker}.
 */
export interface ScrollTrackerEventTypes
{
    /**
     * Triggers when the scrollbar position is changed.
     *
     * @param {ScrollTrackerEntry} entry The new scroll info.
     */
    scroll(entry: ScrollTrackerEntry): void;

    /**
     * Triggers when the scrolling status is changed.
     *
     * @param {boolean} isScrolling The new scrolling status.
     */
    scrollingChange(isScrolling: boolean): void;
}
