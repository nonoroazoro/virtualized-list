import { AbstractVirtualizedList } from "../AbstractVirtualizedList";
import type { VirtualizedListOptions } from "../AbstractVirtualizedList";
import type { VirtualizedListRenderers } from "./VirtualizedListRenderers";

/**
 * Virtualized list component.
 */
export class VirtualizedList<DataType> extends AbstractVirtualizedList<DataType>
{
    private _renderers: VirtualizedListRenderers<DataType>;

    /**
     * Creates an instance of {@link VirtualizedList}.
     *
     * @param {(VirtualizedListOptions & VirtualizedListRenderers<DataType>)} options The options for the virtualized list.
     */
    constructor(options: VirtualizedListOptions & VirtualizedListRenderers<DataType>)
    {
        const {
            generateItemKey,
            renderListItem,
            renderListEmpty,
            renderListHeader,
            renderListFooter,
            ...restOptions
        } = options;
        super(restOptions);
        this._renderers = {
            generateItemKey,
            renderListItem,
            renderListEmpty,
            renderListHeader,
            renderListFooter
        };
    }

    protected renderListItem(itemData: DataType, key: string, index: number)
    {
        return this._renderers.renderListItem.call(this, itemData, key, index);
    }

    public generateItemKey(itemData: DataType, index: number)
    {
        return this._renderers.generateItemKey.call(this, itemData, index);
    }

    public override renderListEmpty()
    {
        return this._renderers.renderListEmpty?.call(this);
    }

    public override renderListHeader()
    {
        return this._renderers.renderListHeader?.call(this);
    }

    public override renderListFooter()
    {
        return this._renderers.renderListFooter?.call(this);
    }
}
