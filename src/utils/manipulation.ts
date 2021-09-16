/**
 * Removes elements from DOM tree.
 *
 * @param {(Element[] | HTMLCollection)} elements The elements to be removed.
 * @param {(element: Element) => void} [fn=noop] The function to be called before the element is removed.
 */
export function removeElements(elements: Element[] | HTMLCollection, fn: (element: Element) => void = noop)
{
    for (const element of elements)
    {
        fn(element);
        element.remove();
    }
}

function noop() { }
