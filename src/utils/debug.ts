import { ENABLE_DEBUG_TRACING } from "../env";

/**
 * Log a message to the console.
 */
export function log(...messages: any[])
{
    if (ENABLE_DEBUG_TRACING)
    {
        console.info(...messages);
    }
}
