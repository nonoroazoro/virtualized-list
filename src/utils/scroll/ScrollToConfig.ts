/**
 * Represents the configuration for a scroll operation.
 */
export interface ScrollToConfig
{
    /**
     * Specifies whether to enable smooth scroll.
     *
     * Defaults to `true`, enables smooth scroll.
     */
    readonly isSmooth: boolean;

    /**
     * Specifies the duration of the scroll animation in `milliseconds`.
     *
     * This option will only take effect when `isSmooth` is set to `true`.
     *
     * Defaults to `300`.
     */
    readonly duration: number;

    /**
     * Specifies the scroll direction.
     *
     * Defaults to `vertical`.
     */
    readonly direction: "horizontal" | "vertical";

    /**
     * Specifies the alignment corresponding to the scroll direction.
     *
     * Defaults to `start`.
     */
    readonly alignment: "center" | "end" | "start";

    /**
     * Specifies the function that is called when the scrolling is completed.
     */
    readonly onComplete?: () => void;
}

/**
 * The default scroll configuration for a scroll operation.
 */
export const DEFAULT_SCROLL_TO_CONFIG: ScrollToConfig = {
    isSmooth: true,
    duration: 300,
    direction: "vertical",
    alignment: "start"
};
