import { supportRAF } from "./caniuse";

/**
 * Creates a debounced function.
 */
export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number)
{
    const isNextTick = (delay === 0 && supportRAF());

    let timer: number;
    let invokeArgs: any[] | undefined;
    let invokeThis: any | undefined;

    function invoke()
    {
        const args = invokeArgs ?? [];
        const thisArg = invokeThis;
        invokeArgs = undefined;
        invokeThis = undefined;
        fn.apply(thisArg, args);
    }

    return function debounced(this: any, ...args: Parameters<T>)
    {
        invokeArgs = args;
        invokeThis = this;

        if (isNextTick)
        {
            window.cancelAnimationFrame(timer);
            timer = window.requestAnimationFrame(invoke);
        }
        else
        {
            window.clearTimeout(timer);
            timer = window.setTimeout(invoke, delay);
        }
    };
}
