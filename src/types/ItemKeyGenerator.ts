/**
 * Generates an unique identifier for the raw item data.
 *
 * @param {DataType} data The raw item data.
 * @param {number} index The index of the raw item data.
 * @returns Returns the unique identifier.
 */
export type ItemKeyGenerator<DataType> = (data: DataType, index: number) => string;
