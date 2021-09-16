import type { ScrollToConfig } from "../utils";

/**
 * Represents the options for a scroll operation.
 */
export type ScrollOptionsSupported = Pick<Partial<ScrollToConfig>, "alignment" | "isSmooth">;
