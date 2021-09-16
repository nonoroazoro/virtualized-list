/**
 * Checks if the input value is a `function`.
 */
export function isFunction(input: any): input is Function
{
    return typeof input === "function";
}

/**
 * Checks if the input value is a `String` primitive or object.
 */
export function isString(input: any): input is string
{
    return (typeof input === "string" || input instanceof String);
}
