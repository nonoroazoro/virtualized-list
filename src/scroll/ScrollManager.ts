import { scrollToPosition } from "../utils";
import type { IDisposable } from "../IDisposable";
import type { ScrollOptionsSupported } from "./ScrollOptionsSupported";

/**
 * Provides scroll management for a scrollable DOM element.
 */
export class ScrollManager implements IDisposable
{
    private _scrollable: HTMLElement;
    private _cancelScrollHandler: Function | undefined;
    private _lastRequestPosition: number | undefined;

    /**
     * Creates an instance of {@link ScrollManager}.
     *
     * @param {HTMLElement} scrollable The specified scrollable DOM element.
     */
    constructor(scrollable: HTMLElement)
    {
        this._scrollable = scrollable;
    }

    /**
     * Scrolls to the position.
     *
     * @param {number} position The pixels along the y-axis.
     * @param {ScrollOptionsSupported} [options] The scroll options.
     */
    scrollTo(position: number, options?: ScrollOptionsSupported)
    {
        if (
            position !== this._scrollable.scrollTop
            && position !== this._lastRequestPosition
        )
        {
            this._cancelScroll();
            this._lastRequestPosition = position;
            this._cancelScrollHandler = scrollToPosition(
                this._scrollable,
                position,
                {
                    ...options,
                    onComplete: this._handleComplete
                }
            );
        }
    }

    /**
     * Scrolls to top.
     *
     * @param {ScrollOptionsSupported} [options] The scroll options.
     */
    public scrollToTop(options?: ScrollOptionsSupported)
    {
        this.scrollTo(0, options);
    }

    /**
     * Scrolls to bottom.
     *
     * @param {ScrollOptionsSupported} [options] The scroll options.
     */
    public scrollToBottom(options?: ScrollOptionsSupported)
    {
        this.scrollTo(this._scrollable.scrollHeight, options);
    }

    public dispose()
    {
        this._cancelScroll();
    }

    private _cancelScroll()
    {
        if (this._cancelScrollHandler != null)
        {
            this._cancelScrollHandler();
            this._cancelScrollHandler = undefined;
        }
        this._lastRequestPosition = undefined;
    }

    private _handleComplete = () =>
    {
        this._lastRequestPosition = undefined;
    };
}
