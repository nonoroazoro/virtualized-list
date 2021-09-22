import type { HTMLElementRenderer, ItemKeyGenerator, ItemRenderer } from "../../types";

/**
 * Represents the renderers of the {@link VirtualizedList}.
 */
export interface VirtualizedListRenderers<DataType>
{
    /**
     * Generates an unique identifier for the raw item data.
     */
    generateItemKey: ItemKeyGenerator<DataType>;

    /**
     * Renders the {@link ItemData} as a list item.
     */
    renderListItem: ItemRenderer<DataType>;

    /**
     * Renders the empty state placeholder when the list has no items.
     */
    renderListEmpty?: HTMLElementRenderer;

    /**
     * Renders the list header.
     */
    renderListHeader?: HTMLElementRenderer;

    /**
     * Renders the list footer.
     */
    renderListFooter?: HTMLElementRenderer;
}
