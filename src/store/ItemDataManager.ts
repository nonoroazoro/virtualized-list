import { readItemIndex } from "../utils";
import type { AbstractVirtualizedList } from "../components";
import type { IDisposable } from "../IDisposable";
import type { ItemData, Range } from "../types";

/**
 * Provides the data management for list items.
 */
export class ItemDataManager<DataType> implements IDisposable
{
    /**
     * Note: This is a sparse array, so be careful.
     */
    private _data: Array<ItemData<DataType>> = [];
    private _list: AbstractVirtualizedList<DataType>;

    private _dataSource: DataType[] = [];
    private _dataSourceLength: number = 0;

    /**
     * Gets the length of the dataSource.
     */
    public get dataSourceLength()
    {
        return this._dataSourceLength;
    }

    /**
     * Gets the dataSource.
     */
    public get dataSource()
    {
        return this._dataSource;
    }

    /**
     * Sets the dataSource.
     */
    public set dataSource(value: DataType[])
    {
        // TODO: Diff Data.
        this._dataSource = value;
        this._dataSourceLength = this._dataSource.length;
        this._data = [];
    }

    /**
     * Creates an instance of {@link ItemDataManager}.
     *
     * @param {AbstractVirtualizedList<DataType>} list The virtualized list.
     */
    constructor(list: AbstractVirtualizedList<DataType>)
    {
        this._list = list;
    }

    /**
     * Gets the {@link ItemData} at the specified index.
     *
     * @param {number} index The index of the {@link ItemData}.
     */
    public getItem(index: number)
    {
        let itemData = this._data[index];
        if (itemData == null)
        {
            // Creates item data on the fly to improve performance.
            const data = this._dataSource[index];
            if (data == null)
            {
                throw new Error(`Invalid data is found at index: ${index}`);
            }
            itemData = {
                data,
                height: this._list.options.defaultItemHeight,
                index,
                key: this._list.generateItemKey(data, index)
            };
            this._data[index] = itemData;
        }
        return itemData;
    }

    /**
     * Updates an {@link ItemData}'s height.
     *
     * @param {HTMLElement} element The element corresponding to the {@link ItemData}.
     * @param {number} height The height of the element.
     * @returns {number} Returns the `height difference` (ΔH).
     */
    public updateItemHeight(element: HTMLElement, height: number): number
    {
        const data = this.getItem(readItemIndex(element));
        const delta = height - data.height;
        data.height = height;
        return delta;
    }

    /**
     * Gets the offset of the specified {@link ItemData}.
     *
     * @param {number} index The index of the {@link ItemData}.
     */
    getItemOffset(index: number): [offsetTop: number, height: number]
    {
        if (index < 0 || index >= this._dataSourceLength)
        {
            return [0, 0];
        }

        // TODO: cache offsets to improve performance.
        const item = this.getItem(index);
        let offsetTop = this._list.listHeaderContainer.offsetHeight;
        for (let i = 0; i < index; i++)
        {
            offsetTop += this.getItem(i).height;
        }
        return [offsetTop, item.height];
    }

    /**
     * Gets all {@link ItemData} in the given range.
     *
     * @param {Range} renderRange The render range.
     */
    public getItemsByRange(renderRange: Range)
    {
        const result: Array<ItemData<DataType>> = [];
        this.iterateByRange(renderRange, itemData => result.push(itemData));
        return result;
    }

    /**
     * Iterates all {@link ItemData} in the given range.
     *
     * @param {Range} renderRange The render range.
     * @param {(value: ItemData<DataType>) => void} fn The function to be called for each {@link ItemData}.
     */
    public iterateByRange(renderRange: Range, fn: (value: ItemData<DataType>) => void)
    {
        let offsetTop = this._list.listHeaderContainer.offsetHeight;
        const [top, bottom] = renderRange;
        for (let i = 0; i < this._dataSourceLength; i++)
        {
            const itemData = this.getItem(i);
            const itemBottom = offsetTop + itemData.height;
            if (itemBottom > top && offsetTop < bottom)
            {
                fn(itemData);
            }

            offsetTop = itemBottom;
            if (offsetTop >= bottom)
            {
                // Break if the next item's top is larger or equal than the bottom.
                break;
            }
        }
    }

    public dispose()
    {
        this._data.splice(0);
        this._dataSource.splice(0);
    }
}
