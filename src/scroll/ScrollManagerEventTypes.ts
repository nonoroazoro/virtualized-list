/**
 * Represents the event types of the {@link ScrollManager}.
 */
export interface ScrollManagerEventTypes
{
    /**
     * Triggers when the scrolling is completed.
     */
    readonly onComplete?: () => void;
}
