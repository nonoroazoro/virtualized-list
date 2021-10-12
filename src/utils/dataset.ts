import type { ItemDataset } from "../types";

// R/W DOM property instead of data-attributes to avoid related performance issue.
// See https://stackoverflow.com/questions/13529503/dom-penalty-of-using-html-attributes

const INDEX_PROPERTY = "VL_ITEM_INDEX";

/**
 * Writes an {@link ItemDataset} to its DOM element.
 *
 * @param {HTMLElement} element The element corresponding to the item.
 * @param {ItemDataset} itemDataset The item dataset.
 */
export function writeItemDataset(element: HTMLElement, itemDataset: ItemDataset)
{
    element[INDEX_PROPERTY] = itemDataset.index;
}

/**
 * Reads the {@link ItemData.index} from its DOM element.
 *
 * @param {HTMLElement} element The element corresponding to the item.
 * @throws {Error} Throws if the property is not found.
 */
export function readItemIndex(element: HTMLElement): number
{
    const index = element[INDEX_PROPERTY];
    if (index == null)
    {
        throw new Error(`The item meta property "${INDEX_PROPERTY}" is not found`);
    }
    return Number(index);
}
