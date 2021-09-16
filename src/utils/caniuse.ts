import { isFunction } from "./lang";

/**
 * Checks if `window.requestAnimationFrame` is supported.
 */
export function supportRAF()
{
    return (
        isFunction(window.requestAnimationFrame)
        && isFunction(window.cancelAnimationFrame)
    );
}

/**
 * Checks if `window.ResizeObserver` is supported.
 */
export function supportResizeObserver()
{
    return isFunction(window.ResizeObserver);
}
