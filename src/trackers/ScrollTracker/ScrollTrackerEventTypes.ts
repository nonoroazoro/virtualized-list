import type { ScrollTrackerEntry } from "./ScrollTrackerEntry";

/**
 * Represents the event types of the {@link ScrollTracker}.
 */
export interface ScrollTrackerEventTypes
{
    /**
     * Triggers when the scroll position is changed.
     *
     * @param {ScrollTrackerEntry} entry The new scroll info.
     */
    scroll(entry: ScrollTrackerEntry): void;

    /**
     * Triggers when the scroll has started or stopped scrolling.
     *
     * @param {boolean} isScrolling The new scroll status.
     */
    scrollChange(isScrolling: boolean): void;

    /**
     * Triggers when the scroll has reached the top.
     */
    topReached(): void;

    /**
     * Triggers when the scroll has reached the bottom.
     */
    bottomReached(): void;
}
