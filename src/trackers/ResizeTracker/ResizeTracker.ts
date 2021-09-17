import { isFunction } from "../../utils";
import type { IDisposable } from "../../IDisposable";
import type { ResizeTrackerEntry } from "./ResizeTrackerEntry";
import type { ResizeTrackerHandler } from "./ResizeTrackerHandler";

/**
 * Provides a way to track the changes to the dimensions of DOM elements.
 */
export class ResizeTracker implements IDisposable
{
    private _observer: ResizeObserver | undefined;
    private _onResized: ResizeTrackerHandler;

    /**
     * Creates an instance of {@link ResizeTracker}.
     *
     * @throws {Error} Throws if the parameter `onResized` is not provided.
     */
    constructor(onResized: ResizeTrackerHandler)
    {
        if (!isFunction(onResized))
        {
            throw new TypeError(`ResizeTracker: parameter 'onResized' must be a function`);
        }
        this._onResized = onResized;
        this._observer = new ResizeObserver(this._handleResize);
    }

    /**
     * Observes and tracking the changes to the dimensions of an element
     *
     * @param {HTMLElement} target A reference to the tracked element.
     * @param {ResizeObserverOptions} [options] The options to use when tracking the element.
     */
    public observe(target: HTMLElement, options?: ResizeObserverOptions)
    {
        if (this._observer)
        {
            this._observer.observe(target, options);
        }
    }

    /**
     * Stops observing an element.
     *
     * @param {Element} target A reference to the tracked element.
     */
    public unobserve(target: Element)
    {
        if (this._observer)
        {
            this._observer.unobserve(target);
        }
    }

    /**
     * Stops the tracker and unobserves all observed elements.
     */
    public stop()
    {
        if (this._observer)
        {
            this._observer.disconnect();
        }
    }

    /**
     * Stops the tracker and releases all resources.
     */
    public dispose()
    {
        this.stop();
        this._observer = undefined;
    }

    private _handleResize = (entries: ResizeObserverEntry[]) =>
    {
        // The `null` `offsetParent` means the element is hidden, so we can skip these elements.
        // See https://stackoverflow.com/a/21696585/1009797
        const result: ResizeTrackerEntry[] = [];
        for (const entry of entries)
        {
            const target = entry.target as HTMLElement;
            if (target.offsetParent !== null)
            {
                result.push({
                    target,
                    contentWidth: entry.contentRect.width,
                    contentHeight: entry.contentRect.height
                });
            }
        }
        if (result.length > 0)
        {
            this._onResized(result);
        }
    };
}
