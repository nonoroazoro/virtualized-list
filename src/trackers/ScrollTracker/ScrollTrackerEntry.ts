import type { ScrollDirection } from "./ScrollDirection";

/**
 * Represents the scroll info of the tracked element.
 */
export interface ScrollTrackerEntry
{
    /**
     * The scrolled element.
     */
    target: Element;

    /**
     * The `vertical` position of the scrollbar.
     */
    scrollTop: number;

    /**
     * The scroll direction.
     */
    direction: ScrollDirection;
}
