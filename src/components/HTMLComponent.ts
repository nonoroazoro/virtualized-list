import { EventEmitter } from "eventemitter3";
import cs from "classnames";
import type { ValidEventTypes } from "eventemitter3";

import { isString } from "../utils";
import type { HTMLComponentOptions } from "./HTMLComponentOptions";
import type { IDisposable } from "../IDisposable";

/**
 * A basic component class wraps an HTML element.
 *
 * @template T The event types of the component.
 */
export class HTMLComponent<T extends ValidEventTypes = string | symbol> extends EventEmitter<T> implements IDisposable
{
    protected _options: HTMLComponentOptions;

    /**
     * Gets or sets a value that indicates whether the component has been appended to a DOM element.
     */
    protected _isAppended = false;

    /**
     * Gets the HTML element wrapped by the component.
     */
    public readonly element: HTMLElement;

    /**
     * Gets the unique identifier of the component.
     */
    public get key()
    {
        return this._options.key;
    }

    /**
     * Gets the parent element of the component.
     */
    public get parent()
    {
        return this.element.parentElement;
    }

    /**
     * Creates an instance of {@link HTMLComponent}.
     *
     * @param {(HTMLElement | keyof HTMLElementTagNameMap)} element The HTML element wrapped by the component.
     * @param {HTMLComponentOptions} [options] The initial options of the component.
     */
    constructor(element: HTMLElement | keyof HTMLElementTagNameMap, options?: HTMLComponentOptions)
    {
        super();

        if (element == null)
        {
            throw new Error("The parameter element is null or empty");
        }

        if (isString(element))
        {
            this.element = this.createElement(element);
        }
        else
        {
            this.element = element;
        }

        this._options = options ?? {};
        const { className } = this._options;
        if (className != null)
        {
            this.element.className = className;
        }
    }

    /**
     * Creates an instance of the element for the specified tag and class names.
     *
     * @param {K} tagName The tag name of the element.
     * @param {...string[]} classNames The class names of the element.
     */
    protected createElement<K extends keyof HTMLElementTagNameMap>(tagName: K, ...classNames: string[])
    {
        const element = document.createElement(tagName);
        if (classNames.length > 0)
        {
            element.className = cs(...classNames);
        }
        return element;
    }

    /**
     * Appends the specified element to the component.
     *
     * @param {(HTMLComponent | HTMLElement)} element The element to append.
     */
    public appendChild(element: HTMLComponent | HTMLElement)
    {
        this.element.appendChild(
            element instanceof HTMLComponent
                ? element.element
                : element
        );
    }

    /**
     * Appends the component to the specified element.
     *
     * @param {(DocumentFragment | HTMLComponent | HTMLElement)} element The element to append to.
     */
    public appendTo(element: DocumentFragment | HTMLComponent | HTMLElement)
    {
        (element instanceof HTMLComponent ? element.element : element).appendChild(this.element);
        this._isAppended = true;
    }

    /**
     * Removes the component from its parent.
     */
    public remove()
    {
        this.element.remove();
        this._isAppended = false;
    }

    /**
     * Sets the component's class name.
     *
     * @param {string} className The class name to set.
     */
    public setClassName(className: string)
    {
        this.element.className = cs(this._options.className, className);
    }

    /**
     * Adds the specified class names to the component.
     *
     * @param {...string[]} classNames The class names to add.
     */
    public addClassNames(...classNames: string[])
    {
        this.element.classList.add(...classNames);
    }

    /**
     * Removes the specified class names from the component.
     *
     * @param {...string[]} classNames The class names to remove.
     */
    public removeClassNames(...classNames: string[])
    {
        this.element.classList.remove(...classNames);
    }

    /**
     * Toggles the specified class name on the component.
     *
     * If `force` is `not given`, toggles the class, `removing` it if it's present and `adding` it if it's not present.
     *
     * If `force` is `true`, `adds` the class name (same as  {@link HTMLComponent.addClassNames}).
     *
     * If `force` is `false`, `removes` the class name (same as {@link HTMLComponent.removeClassNames}).
     *
     * @param {string} className The class name to toggle.
     * @param {boolean} [force] The force flag.
     *
     * @returns Returns `true` if the class name is now present, and `false` otherwise.
     */
    public toggleClassName(className: string, force?: boolean)
    {
        return this.element.classList.toggle(className, force);
    }

    public dispose()
    {
        this.remove();
    }
}
