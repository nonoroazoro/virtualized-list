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
     * The `vertical` scroll position.
     */
    scrollTop: number;

    /**
     * The scroll direction.
     */
    direction: ScrollDirection;
}
