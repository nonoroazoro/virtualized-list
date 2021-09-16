import { AbstractVirtualizedList } from "../AbstractVirtualizedList";
import type { ItemKeyGenerator, ItemRenderer } from "../../types";
import type { VirtualizedListOptions } from "../AbstractVirtualizedList";

/**
 * Virtualized list component.
 */
export class VirtualizedList<DataType> extends AbstractVirtualizedList<DataType>
{
    private _generateItemKey: ItemKeyGenerator<DataType>;
    private _renderListItem: ItemRenderer<DataType>;

    /**
     * Creates an instance of {@link VirtualizedList}.
     *
     * @param {(VirtualizedListOptions & {
     *         renderListItem: ItemRenderer<DataType>;
     *         generateItemKey: ItemKeyGenerator<DataType>;
     *     })} options The options for the virtualized list.
     */
    constructor(options: VirtualizedListOptions & {
        generateItemKey: ItemKeyGenerator<DataType>;
        renderListItem: ItemRenderer<DataType>;
    })
    {
        const { generateItemKey, renderListItem, ...restOptions } = options;
        super(restOptions);
        this._generateItemKey = generateItemKey;
        this._renderListItem = renderListItem;
    }

    protected renderListItem(itemData: DataType, key: string, index: number)
    {
        return this._renderListItem(itemData, key, index);
    }

    public generateItemKey(itemData: DataType, index: number)
    {
        return this._generateItemKey(itemData, index);
    }
}
