import { readItemIndex } from "./dataset";
import type { ItemData, RenderedIndexRange, RenderRange } from "../types";
import type { ItemDataManager } from "../store";

/**
 * Calculates the range that is allowed to render items.
 *
 * Note: The coordinate origin is at the top-left corner of the scrollable container.
 *
 * @param {number} leadingBufferZone The height of the leading buffer zone.
 * @param {number} trailingBufferZone The height of the trailing buffer zone.
 * @param {number} scrollableContainerHeight The height of the scrollable container.
 */
export function calculateRenderRange(
    leadingBufferZone: number,
    trailingBufferZone: number,
    scrollableContainerHeight: number
): RenderRange
{
    const leadingBufferRange = [-leadingBufferZone, 0];
    const viewRange = [0, scrollableContainerHeight];
    const trailingBufferRange = [viewRange[1], viewRange[1] + trailingBufferZone];
    return [leadingBufferRange[0], trailingBufferRange[1]];
}

/**
 * Calculates the index range of the items that have been rendered.
 *
 * @param {HTMLElement} itemsContainer The items container element.
 */
export function calculateRenderedIndexRange(itemsContainer: HTMLElement): RenderedIndexRange | undefined
{
    const firstItemElement = itemsContainer.firstElementChild as HTMLElement;
    if (firstItemElement)
    {
        return [
            readItemIndex(firstItemElement),
            readItemIndex(itemsContainer.lastElementChild as HTMLElement)
        ];
    }
    return;
}

/**
 * Calculates the items that should be prepended to the list.
 *
 * @param {RenderRange} renderRange The render range.
 * @param {HTMLElement} firstItemElement The first item element rendered in the list.
 * @param {ItemDataManager<DataType>} itemDataManager The {@link ItemDataManager}.
 */
export function calculatePrependedItems<DataType>(
    renderRange: RenderRange,
    firstItemElement: HTMLElement,
    itemDataManager: ItemDataManager<DataType>
): Array<ItemData<DataType>>
{
    const result = [];
    const [renderRangeTop, renderRangeBottom] = renderRange;
    const firstChildIndex = readItemIndex(firstItemElement);
    let nextItemBottom = firstItemElement.offsetTop;
    for (let i = firstChildIndex - 1; i >= 0; i--)
    {
        const itemData = itemDataManager.getItem(i);
        const height = itemData.height;
        const nextItemTop = nextItemBottom - height;
        if (nextItemBottom > renderRangeTop)
        {
            if (nextItemTop < renderRangeBottom)
            {
                result.unshift(itemData);
            }
        }
        else
        {
            break;
        }
        nextItemBottom = nextItemTop;
    }
    return result;
}

/**
 * Calculates the items that should be appended to the list.
 *
 * @param {RenderRange} renderRange The render range.
 * @param {HTMLElement} lastItemElement The last item element rendered in the list.
 * @param {ItemDataManager<DataType>} itemDataManager The {@link ItemDataManager}.
 */
export function calculateAppendedItems<DataType>(
    renderRange: RenderRange,
    lastItemElement: HTMLElement,
    itemDataManager: ItemDataManager<DataType>
): Array<ItemData<DataType>>
{
    const result = [];
    const [renderRangeTop, renderRangeBottom] = renderRange;
    const lastChildIndex = readItemIndex(lastItemElement);
    let nextItemTop = lastItemElement.offsetTop + lastItemElement.offsetHeight;
    for (let i = lastChildIndex + 1; i < itemDataManager.dataSourceLength; i++)
    {
        const itemData = itemDataManager.getItem(i);
        const height = itemData.height;
        const nextItemBottom = nextItemTop + height;
        if (nextItemTop < renderRangeBottom)
        {
            if (nextItemBottom > renderRangeTop)
            {
                result.push(itemData);
            }
        }
        else
        {
            break;
        }
        nextItemTop = nextItemBottom;
    }
    return result;
}

/**
 * Calculates the elements that should be removed from the leading side of the list.
 *
 * @param {number} renderRangeTop The top of the render range.
 * @param {HTMLElement} itemsContainer The items container element.
 */
export function calculateLeadingRemovedElements(renderRangeTop: number, itemsContainer: HTMLElement)
{
    const elements: HTMLElement[] = [];
    for (let i = 0; i < itemsContainer.childElementCount; i++)
    {
        const element = itemsContainer.children[i] as HTMLElement;
        const itemBottom = element.offsetTop + element.offsetHeight;
        if (itemBottom <= renderRangeTop)
        {
            elements.push(element);
        }
        else
        {
            break;
        }
    }
    return elements;
}

/**
 * Calculates the elements that should be removed from the trailing side of the list.
 *
 * @param {number} renderRangeBottom The bottom of the render range.
 * @param {HTMLElement} itemsContainer The items container element.
 */
export function calculateTrailingRemovedElements(renderRangeBottom: number, itemsContainer: HTMLElement)
{
    const elements: HTMLElement[] = [];
    for (let i = itemsContainer.childElementCount - 1; i >= 0; i--)
    {
        const element = itemsContainer.children[i] as HTMLElement;
        const itemTop = element.offsetTop;
        if (itemTop >= renderRangeBottom)
        {
            elements.push(element);
        }
        else
        {
            break;
        }
    }
    return elements;
}

/**
 * Calculates the paddings (padding-top and padding-bottom) base on the {@link RenderedIndexRange}.
 *
 * @param {RenderedIndexRange} renderedIndexRange The specified {@link RenderedIndexRange}.
 * @param {ItemDataManager<DataType>} itemDataManager The {@link ItemDataManager}.
 */
export function calculatePaddings<DataType>(renderedIndexRange: RenderedIndexRange, itemDataManager: ItemDataManager<DataType>)
{
    let paddingTop = 0;
    let paddingBottom = 0;
    const [renderedIndexStart, renderedIndexEnd] = renderedIndexRange;

    for (let i = 0; i < renderedIndexStart; i++)
    {
        paddingTop += itemDataManager.getItem(i).height;
    }

    for (let i = renderedIndexEnd + 1; i < itemDataManager.dataSourceLength; i++)
    {
        paddingBottom += itemDataManager.getItem(i).height;
    }
    return { paddingTop, paddingBottom };
}
