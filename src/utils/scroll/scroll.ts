import { DEFAULT_SCROLL_TO_CONFIG } from "./ScrollToConfig";
import { isString } from "../lang";
import { supportRAF } from "../caniuse";
import type { ScrollToConfig } from "./ScrollToConfig";
import type { ScrollToOptions } from "./ScrollToOptions";

/**
 * Scrolls to the DOM element.
 *
 * @param {HTMLElement | string} scrollable The scrollable element or its DOM id.
 * @param {HTMLElement | string} target The element that will be scrolled to.
 * @param {ScrollToOptions} [options] The scroll options.
 * @returns {() => void} Returns a function which can be called to cancel the scroll.
 */
export function scrollToElement(scrollable: HTMLElement | string, target: HTMLElement | string, options?: ScrollToOptions)
{
    let isCancelled = false;
    const scrollableElement = isString(scrollable) ? document.getElementById(scrollable) : scrollable;
    if (scrollableElement != null)
    {
        const targetElement = isString(target) ? scrollableElement.querySelector<HTMLElement>(`#${target}`) : target;
        if (targetElement != null)
        {
            const config: ScrollToConfig = { ...DEFAULT_SCROLL_TO_CONFIG, ...options };
            const scrollPropertyName = config.direction === "vertical" ? "scrollTop" : "scrollLeft";
            const offsetPropertyName = config.direction === "vertical" ? "offsetTop" : "offsetLeft";
            const sizePropertyName = config.direction === "vertical" ? "offsetHeight" : "offsetWidth";
            const from = scrollableElement[scrollPropertyName];
            let to = targetElement[offsetPropertyName];
            if (config.alignment === "center")
            {
                to += (targetElement[sizePropertyName] / 2);
            }
            else if (config.alignment === "end")
            {
                to += targetElement[sizePropertyName];
            }
            const enableSmooth = (config.isSmooth && config.duration !== 0) && enableSmoothScrolling(from, to);
            if (supportRAF())
            {
                const frames = enableSmooth ? Math.round(config.duration / 16) : 1;
                const delta = (to - from) / frames;
                _scrollRAF(1, delta, frames, to, scrollableElement, scrollPropertyName, config.onComplete);
            }
            else
            {
                targetElement.scrollIntoView({
                    block: config.direction === "vertical" ? config.alignment : "nearest",
                    inline: config.direction === "horizontal" ? config.alignment : "nearest",
                    behavior: enableSmooth ? "smooth" : "auto"
                });
            }
        }
    }

    function _scrollRAF(
        step: number,
        delta: number,
        frames: number,
        to: number,
        scrollableContainer: HTMLElement,
        scrollPropertyName: string,
        onComplete?: () => void
    )
    {
        if (!isCancelled)
        {
            if (step < frames)
            {
                scrollableContainer[scrollPropertyName] += delta;
                window.requestAnimationFrame(() =>
                {
                    _scrollRAF(
                        step + 1,
                        delta,
                        frames,
                        to,
                        scrollableContainer,
                        scrollPropertyName,
                        onComplete
                    );
                });
            }
            else
            {
                scrollableContainer[scrollPropertyName] = to;
                _exec(onComplete);
            }
        }
    }

    return () => { isCancelled = true; };
}

/**
 * Scrolls to position.
 *
 * @param {HTMLElement | string} scrollable The scrollable element or its DOM id.
 * @param {number} position The position will scroll to.
 * @param {ScrollToOptions} [options] The scroll options.
 * @returns {() => void} Returns a function which can be called to cancel the scroll.
 */
export function scrollToPosition(scrollable: HTMLElement | string, position: number, options?: ScrollToOptions)
{
    let isCancelled = false;
    const scrollableElement = isString(scrollable) ? document.getElementById(scrollable) : scrollable;
    if (scrollableElement != null)
    {
        const config: ScrollToConfig = { ...DEFAULT_SCROLL_TO_CONFIG, ...options };
        const scrollPropertyName = config.direction === "vertical" ? "scrollTop" : "scrollLeft";
        const from = scrollableElement[scrollPropertyName];
        const enableSmooth = (config.isSmooth && config.duration !== 0) && enableSmoothScrolling(from, position);
        if (supportRAF())
        {
            const frames = enableSmooth ? Math.round(config.duration / 16) : 1;
            const delta = (position - from) / frames;
            _scrollRAF(1, delta, frames, position, scrollableElement, scrollPropertyName, config.onComplete);
        }
        else
        {
            scrollableElement[scrollPropertyName] = position;
            _exec(config.onComplete);
        }
    }

    function _scrollRAF(
        step: number,
        delta: number,
        frames: number,
        to: number,
        scrollableContainer: HTMLElement,
        scrollPropertyName: string,
        onComplete?: () => void
    )
    {
        if (!isCancelled)
        {
            if (step < frames)
            {
                scrollableContainer[scrollPropertyName] += delta;
                window.requestAnimationFrame(() =>
                {
                    _scrollRAF(
                        step + 1,
                        delta,
                        frames,
                        to,
                        scrollableContainer,
                        scrollPropertyName,
                        onComplete
                    );
                });
            }
            else
            {
                scrollableContainer[scrollPropertyName] = to;
                _exec(onComplete);
            }
        }
    }

    return () => { isCancelled = true; };
}

/**
 * Checks whether to enable smooth scroll (position difference below the threshold).
 *
 * @param {number} currentPosition The current scroll position.
 * @param {number} targetPosition The target scroll position.
 * @param {number} [threshold=6480] The threshold.
 */
export function enableSmoothScrolling(currentPosition: number, targetPosition: number, threshold: number = 6480)
{
    return Math.abs(targetPosition - currentPosition) < threshold;
}

function _exec(fn: Function | undefined)
{
    if (fn)
    {
        fn();
    }
}
