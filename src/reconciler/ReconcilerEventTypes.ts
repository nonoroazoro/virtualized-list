/**
 * Represents the event types of the {@link Reconciler}.
 */
export interface ReconcilerEventTypes
{
    /**
     * Triggers when some items are resized.
     *
     * @param {number} delta The total size (height) difference.
     */
    itemsResize(delta: number): void;
}
