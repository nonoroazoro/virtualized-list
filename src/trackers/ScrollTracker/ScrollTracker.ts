import { debounce, isFunction } from "../../utils";
import { ScrollDirection } from "./ScrollDirection";
import type { IDisposable } from "../../IDisposable";
import type { ScrollTrackerHandler } from "./ScrollTrackerHandler";

/**
 * Provides a way to track the changes to the scrollbar position of a DOM element.
 */
export class ScrollTracker implements IDisposable
{
    private _element: HTMLElement | undefined;
    private _onScrolled: ScrollTrackerHandler;

    private _isObserving = false;
    private _lastScrollTop = 0;

    private _isScrolling = false;
    /**
     * Gets a value that indicates whether the tracked element is scrolling.
     */
    public get isScrolling()
    {
        return this._isScrolling;
    }

    private _scrollDirection = ScrollDirection.NONE;
    /**
     * Gets a value that indicates the scroll directrion of the tracked element.
     */
    public get scrollDirection()
    {
        return this._scrollDirection;
    }

    /**
     * Creates an instance of `ScrollTracker`.
     */
    constructor(element: HTMLElement, onScrolled: ScrollTrackerHandler)
    {
        if (!isFunction(onScrolled))
        {
            throw new TypeError(`ScrollTracker: parameter 'onScrolled' must be a function`);
        }
        this._element = element;
        this._onScrolled = onScrolled;
        this._detectScrollEnd = debounce(this._detectScrollEnd, 100);
    }

    /**
     * Observes and tracking the changes to the scrollbar position of an element
     */
    public observe()
    {
        if (this._element && !this._isObserving)
        {
            this._element.addEventListener("scroll", this._handleScroll, { passive: true });
            this._isObserving = true;
        }
    }

    /**
     * Stops the tracker and unobserves the observed element.
     */
    public stop()
    {
        if (this._element && this._isObserving)
        {
            this._element.removeEventListener("scroll", this._handleScroll);
            this._isObserving = false;
        }
    }

    /**
     * Stops the tracker and releases all resources.
     */
    public dispose()
    {
        this.stop();
        this._element = undefined;
    }

    private _handleScroll = (e: Event) =>
    {
        // Note: We can optimize the scroll events by requestAnimationFrame, but it seems unnecessary here.
        // See https://developer.mozilla.org/en-US/docs/Web/API/Document/scroll_event#scroll_event_throttling
        const target = e.target as Element;
        const scrollTop = target.scrollTop;
        this._updateScrollStatus(scrollTop);
        this._onScrolled({
            target,
            scrollTop,
            direction: this._scrollDirection
        });
    };

    private _updateScrollStatus(scrollTop: number)
    {
        this._isScrolling = true;
        this._scrollDirection = scrollTop - this._lastScrollTop > 0
            ? ScrollDirection.DOWN
            : ScrollDirection.UP;
        this._lastScrollTop = scrollTop;
        this._detectScrollEnd();
    }

    /**
     * Note: This method is debounced.
     */
    private _detectScrollEnd = () =>
    {
        this._isScrolling = false;
        this._scrollDirection = ScrollDirection.NONE;
    };
}
