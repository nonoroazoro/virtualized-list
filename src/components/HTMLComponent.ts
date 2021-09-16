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
    public readonly container: HTMLElement;

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
        return this.container.parentElement;
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
            this.container = this.createElement(element);
        }
        else
        {
            this.container = element;
        }

        this._options = options ?? {};
        const { className } = this._options;
        if (className != null)
        {
            this.container.className = className;
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
        this.container.appendChild(
            element instanceof HTMLComponent
                ? element.container
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
        (element instanceof HTMLComponent ? element.container : element).appendChild(this.container);
        this._isAppended = true;
    }

    /**
     * Removes the component from its parent.
     */
    public remove()
    {
        this.container.remove();
        this._isAppended = false;
    }

    /**
     * Sets the component's class name.
     *
     * @param {string} className The class name to set.
     */
    public setClassName(className: string)
    {
        this.container.className = cs(this._options.className, className);
    }

    /**
     * Adds the specified class names to the component.
     *
     * @param {...string[]} classNames The class names to add.
     */
    public addClassNames(...classNames: string[])
    {
        this.container.classList.add(...classNames);
    }

    /**
     * Removes the specified class names from the component.
     *
     * @param {...string[]} classNames The class names to remove.
     */
    public removeClassNames(...classNames: string[])
    {
        this.container.classList.remove(...classNames);
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
        return this.container.classList.toggle(className, force);
    }

    public dispose()
    {
        this.remove();
    }
}
