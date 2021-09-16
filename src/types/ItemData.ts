import type { ItemDataset } from "./ItemDataset";

/**
 * Represents the data wrapper of a list item element.
 */
export interface ItemData<DataType> extends ItemDataset
{
    /**
     * The raw data of the item.
     */
    data: DataType;

    /**
     * The height of the item.
     */
    height: number;
}
