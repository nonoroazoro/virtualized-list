import { EventEmitter } from "eventemitter3";

import
{
    calculateAppendedItems,
    calculateLeadingRemovedElements,
    calculatePaddings,
    calculatePrependedItems,
    calculateRenderedIndexRange,
    calculateRenderRange,
    calculateTrailingRemovedElements,
    isRangeEqual,
    offsetRange,
    writeItemDataset
} from "../utils";
import { ResizeTracker } from "../trackers";
import type { AbstractVirtualizedList } from "../components";
import type { IDisposable } from "../IDisposable";
import type { ItemData, RenderedIndexRange, RenderRange } from "../types";
import type { ItemDataManager } from "../store";
import type { ReconcilerEventTypes } from "./ReconcilerEventTypes";
import type { ResizeTrackerEntry } from "../trackers";

/**
 * Provides a way to reconcile the items of a virtualized list.
 */
export class Reconciler<DataType> extends EventEmitter<ReconcilerEventTypes> implements IDisposable
{
    private _list: AbstractVirtualizedList<DataType>;
    private _itemDataManager: ItemDataManager<DataType>;

    private _scrollableResizeTracker: ResizeTracker;
    private _itemsResizeTracker: ResizeTracker;

    private _renderRange: RenderRange = [0, 0];
    private _currentRenderedIndexRange: RenderedIndexRange | undefined;

    private _paddingTop = 0;
    private get paddingTop()
    {
        return this._paddingTop;
    }

    private set paddingTop(value: number)
    {
        this._paddingTop = value;
        this._list.itemsContainer.style.paddingTop = `${value}px`;
    }

    private _paddingBottom = 0;
    private get paddingBottom()
    {
        return this._paddingBottom;
    }

    private set paddingBottom(value: number)
    {
        this._paddingBottom = value;
        this._list.itemsContainer.style.paddingBottom = `${value}px`;
    }

    /**
     * Creates an instance of {@link Reconciler}.
     *
     * @param {AbstractVirtualizedList<DataType>} list The list that is being reconciled.
     * @param {ItemDataManager<DataType>} itemDataManager The item data manager.
     */
    constructor(list: AbstractVirtualizedList<DataType>, itemDataManager: ItemDataManager<DataType>)
    {
        super();

        // Inject.
        this._list = list;
        this._itemDataManager = itemDataManager;

        // Init ScrollableResizeTracker.
        this._scrollableResizeTracker = new ResizeTracker(this._handleScrollableResize);
        this._scrollableResizeTracker.observe(this._list.scrollableContainer);

        // Init ItemsResizeTracker.
        this._itemsResizeTracker = new ResizeTracker(this._handleItemsResize);
    }

    /**
     * Reconciles the items rendered in the list.
     *
     * This will add/remove list items and update the items container's paddings.
     *
     * @param {number} offset The request rendering offset (normally it's the `scrollTop` of the scrollable container).
     */
    public reconcile(offset: number)
    {
        if (this._itemDataManager.dataSourceLength === 0)
        {
            return;
        }

        const { itemsContainer } = this._list;
        let prependedItems: Array<ItemData<DataType>> = [];
        let appendedItems: Array<ItemData<DataType>> = [];
        let leadingRemoved: HTMLElement[] = [];
        let trailingRemoved: HTMLElement[] = [];

        // Calculates the offset render range.
        const offsetRenderRange = offsetRange(this._renderRange, offset);
        if (this._list.itemsContainer.childElementCount > 0)
        {
            const [renderRangeTop, renderRangeBottom] = offsetRenderRange;

            // 1. Calculates items that should be preprened.
            prependedItems = calculatePrependedItems(
                offsetRenderRange,
                itemsContainer.firstElementChild as HTMLElement,
                this._itemDataManager
            );

            // 2. Calculates items that should be appended.
            appendedItems = calculateAppendedItems(
                offsetRenderRange,
                itemsContainer.lastElementChild as HTMLElement,
                this._itemDataManager
            );

            // 3. Calculates items that should be removed from the leading side of the list.
            if (prependedItems.length === 0)
            {
                // Bypassed if scroll up or we are about to prepend items.
                leadingRemoved = calculateLeadingRemovedElements(renderRangeTop, itemsContainer);
            }

            // 4. Calculates items that should be removed from the trailing side of the list.
            if (appendedItems.length === 0)
            {
                // Bypassed if scroll down or we are about to append items.
                trailingRemoved = calculateTrailingRemovedElements(renderRangeBottom, itemsContainer);
            }
        }
        else
        {
            // 5. Calculates items from the scratch.
            appendedItems = this._itemDataManager.getItemsByRange(offsetRenderRange);
        }

        // 5. Remove elements.
        this._removeListItems(leadingRemoved);
        this._removeListItems(trailingRemoved);

        // 6. Render items.
        itemsContainer.append(...appendedItems.map(this._createListItem));
        itemsContainer.prepend(...prependedItems.map(this._createListItem));

        // 7. Update paddings to make up scrollHeight.
        this._updatePaddings();
    }

    /**
     * Removes all list items and resets the {@link RenderRange}, paddings, scroll, etc.
     */
    public reset()
    {
        this._removeListItems([...this._list.itemsContainer.children]);
        this._currentRenderedIndexRange = undefined;
        this.paddingBottom = 0;
        this.paddingTop = 0;
        this._list.scrollableContainer.scrollTop = 0;
    }

    public dispose()
    {
        this.removeAllListeners();
        this._scrollableResizeTracker.dispose();
        this._itemsResizeTracker.dispose();
        this._currentRenderedIndexRange = undefined;
    }

    private _handleScrollableResize = (entries: ResizeTrackerEntry[]) =>
    {
        // Calculates the render range.
        const nextRenderRange = calculateRenderRange(
            this._list.options.leadingBufferZone,
            this._list.options.trailingBufferZone,
            entries[0].contentHeight
        );
        if (!isRangeEqual(this._renderRange, nextRenderRange))
        {
            this._renderRange = nextRenderRange;
            this.reconcile(this._list.scrollableContainer.scrollTop);
        }
    };

    private _handleItemsResize = (entries: ResizeTrackerEntry[]) =>
    {
        // 1. Updates items' height and calculates the total height difference.
        const delta = entries.reduce(
            (acc, entry) => acc + this._itemDataManager.updateItemHeight(entry.target, entry.contentHeight),
            0
        );

        // 2. Reconcile items.
        this.reconcile(this._list.scrollableContainer.scrollTop);

        // 3. Emit event.
        this.emit("itemsResize", delta);
    };

    private _updatePaddings()
    {
        const nextRenderedIndexRange = calculateRenderedIndexRange(this._list.itemsContainer);
        if (nextRenderedIndexRange == null)
        {
            // 1. Clear paddings.
            this.paddingTop = 0;
            this.paddingBottom = 0;
        }
        else if (this._currentRenderedIndexRange == null)
        {
            // 2. Build the paddings `from the scratch`.
            // Note: This is an `expensive operation`, should never be called frequently.
            const { paddingTop, paddingBottom } = calculatePaddings(nextRenderedIndexRange, this._itemDataManager);
            this.paddingTop = paddingTop;
            this.paddingBottom = paddingBottom;
        }
        else if (!isRangeEqual(this._currentRenderedIndexRange, nextRenderedIndexRange))
        {
            // 3. Update paddings incrementally.

            // Calculates padding top.
            let deltaPaddingTop = 0;
            let sign = 1;
            let start = this._currentRenderedIndexRange[0];
            let end = nextRenderedIndexRange[0];
            if (end < start)
            {
                // Swap.
                sign *= -1;
                end = start;
                start = nextRenderedIndexRange[0];
            }
            // [start, end)
            for (let i = start; i < end; i++)
            {
                deltaPaddingTop += this._itemDataManager.getItem(i).height;
            }
            deltaPaddingTop *= sign;

            // Calculates padding bottom.
            let deltaPaddingBottom = 0;
            sign = -1;
            start = this._currentRenderedIndexRange[1];
            end = nextRenderedIndexRange[1];
            if (end < start)
            {
                // Swap.
                sign *= -1;
                end = start;
                start = nextRenderedIndexRange[1];
            }
            // (start, end]
            for (let i = start + 1; i <= end; i++)
            {
                deltaPaddingBottom += this._itemDataManager.getItem(i).height;
            }
            deltaPaddingBottom *= sign;

            if (deltaPaddingTop !== 0)
            {
                this.paddingTop += deltaPaddingTop;
            }

            if (deltaPaddingBottom !== 0)
            {
                this.paddingBottom += deltaPaddingBottom;
            }
        }
        this._currentRenderedIndexRange = nextRenderedIndexRange;
    }

    private _createListItem = (itemData: ItemData<DataType>) =>
    {
        const element = this._list.createListItem(itemData);
        writeItemDataset(element, itemData);
        this._itemsResizeTracker.observe(element);
        return element;
    };

    private _removeListItems(elements: Element[])
    {
        elements.forEach(element =>
        {
            element.remove();
            this._itemsResizeTracker.unobserve(element);
        });
    }
}
