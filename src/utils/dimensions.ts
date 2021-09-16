import type { Range } from "../types";

/**
 * Checks if the two ranges are equal.
 */
export function isRangeEqual<T extends Range>(rangeA: T, rangeB: T): boolean
{
    return (rangeA[0] === rangeB[0] && rangeA[1] === rangeB[1]);
}

/**
 * Returns a new {@link Range} that's offset from the specified {@link Range}.
 *
 * @param {T} range The specified range.
 * @param {number} offset The offset to apply.
 */
export function offsetRange<T extends Range>(range: T, offset: number): T
{
    return [range[0] + offset, range[1] + offset] as T;
}

/**
 * Subtracts {@link Range}B from {@link Range}A, returns the new {@link Range}.
 */
export function subtractRange<T extends Range>(rangeA: T, rangeB: T): T
{
    return [rangeA[0] - rangeB[0], rangeA[1] - rangeB[1]] as T;
}
