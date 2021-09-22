import type { HTMLComponentOptions } from "../HTMLComponentOptions";

/**
 * Represents the configuration for the {@link VirtualizedList}.
 */
export interface VirtualizedListConfig extends HTMLComponentOptions
{
    /**
     * The default height (in `px`) assumption of the list item.
     *
     * Defaults to `50` px.
     */
    readonly defaultItemHeight: number;

    /**
     * The height (in `px`) of a buffer zone to render extra items on the leading side of current visible area.
     *
     * Defaults to `300` px.
     */
    readonly leadingBufferZone: number;

    /**
     * The height (in `px`) of a buffer zone to render extra items on the trailing side of current visible area.
     *
     * Defaults to `300` px.
     */
    readonly trailingBufferZone: number;
}

/**
 * The default configuration for the {@link VirtualizedList}.
 */
export const DEFAULT_LIST_CONFIG: VirtualizedListConfig = {
    defaultItemHeight: 50,
    leadingBufferZone: 300,
    trailingBufferZone: 300
};
