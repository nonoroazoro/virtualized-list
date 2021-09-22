import cs from "classnames";

import { debounce, DEFAULT_SCROLL_TO_CONFIG, log } from "../../utils";
import { DEFAULT_LIST_CONFIG } from "./VirtualizedListConfig";
import { HTMLComponent } from "../HTMLComponent";
import { ItemDataManager } from "../../store";
import { Reconciler } from "../../reconciler";
import { ScrollManager } from "../../scroll";
import { ScrollTracker } from "../../trackers";
import type { ItemData } from "../../types";
import type { ScrollOptionsSupported } from "../../scroll";
import type { ScrollTrackerEntry } from "../../trackers";
import type { VirtualizedListConfig } from "./VirtualizedListConfig";
import type { VirtualizedListEventTypes } from "./VirtualizedListEventTypes";
import type { VirtualizedListOptions } from "./VirtualizedListOptions";

import * as styles from "./AbstractVirtualizedList.less";

/**
 * Abstract virtualized list component.
 */
export abstract class AbstractVirtualizedList<DataType> extends HTMLComponent<VirtualizedListEventTypes>
{
    protected override _options: VirtualizedListConfig;

    private _itemDataManager: ItemDataManager<DataType>;
    private _scrollTracker: ScrollTracker;
    private _scrollManager: ScrollManager;
    private _reconciler: Reconciler<DataType>;
    private _continueScrollToIndex: Function | undefined;

    private _listHeader: HTMLElement | undefined;
    private _listFooter: HTMLElement | undefined;
    private _listEmpty: HTMLElement | undefined;

    /**
     * Gets the options of the list.
     */
    public get options()
    {
        return this._options;
    }

    /**
     * Sets the data source of the list.
     *
     * Note: This triggers a re-render.
     */
    public set dataSource(value: DataType[])
    {
        log("=== set dataSource ===");
        this._itemDataManager.dataSource = value;
        this._render();
    }

    private _scrollableContainer: HTMLDivElement;
    /**
     * Gets the scrollable container element.
     */
    public get scrollableContainer(): HTMLDivElement
    {
        return this._scrollableContainer;
    }

    private _listHeaderContainer: HTMLDivElement;
    /**
     * Gets the list header container element.
     */
    public get listHeaderContainer(): HTMLDivElement
    {
        return this._listHeaderContainer;
    }

    private _itemsContainer: HTMLDivElement;
    /**
     * Gets the items container element.
     */
    public get itemsContainer(): HTMLDivElement
    {
        return this._itemsContainer;
    }

    private _listFooterContainer: HTMLDivElement;
    /**
     * Gets the list footer container element.
     */
    public get listFooterContainer(): HTMLDivElement
    {
        return this._listFooterContainer;
    }

    /**
     * Creates an instance of {@link AbstractVirtualizedList}.
     *
     * @param {VirtualizedListOptions} [options] The options for the list.
     */
    constructor(options?: VirtualizedListOptions)
    {
        super(
            "div",
            {
                ...DEFAULT_LIST_CONFIG,
                ...options,
                className: cs(styles.container, options?.className)
            }
        );
        this._init();
    }

    /**
     * Generates an unique identifier for the raw item data.
     *
     * @param {DataType} itemData The raw item data.
     * @returns Returns the unique identifier.
     */
    public abstract generateItemKey(itemData: DataType, index: number): string;

    /**
     * Renders a list item.
     *
     * @param {DataType} itemData The {@link ItemData} used to render the list item.
     * @param {string} key The unique identifier generated by {@link AbstractVirtualizedList.generateItemKey}.
     * @param {number} index The index of the {@link ItemData}.
     * @returns Returns the corresponding {@link HTMLElement}.
     */
    protected abstract renderListItem(itemData: DataType, key: string, index: number): HTMLElement;

    /**
     * Renders the empty state placeholder when the list has no items.
     *
     * @returns Returns the corresponding {@link HTMLElement}.
     */
    protected renderListEmpty(): HTMLElement | undefined { return; }

    /**
     * Renders the list header.
     *
     * @returns Returns the corresponding {@link HTMLElement}.
     */
    protected renderListHeader(): HTMLElement | undefined { return; }

    /**
     * Renders the list footer.
     *
     * @returns Returns the corresponding {@link HTMLElement}.
     */
    protected renderListFooter(): HTMLElement | undefined { return; }

    public override appendTo(element: DocumentFragment | HTMLComponent | HTMLElement)
    {
        super.appendTo(element);
        this._render();
    }

    /**
     * Creates a list item from {@link ItemData}.
     *
     * @param {ItemData<DataType>} itemData The specified {@link ItemData}.
     * @returns Returns the corresponding {@link HTMLElement}.
     */
    public createListItem(itemData: ItemData<DataType>)
    {
        const element = this.createElement("div");
        element.appendChild(this.renderListItem(
            itemData.data,
            itemData.key,
            itemData.index
        ));
        return element;
    }

    public override dispose()
    {
        this._clearInProgressScroll();

        this._reconciler.dispose();
        this._scrollManager.dispose();
        this._scrollTracker.dispose();
        this._itemDataManager.dispose();

        this._listEmpty = undefined;

        super.dispose();
    }

    //#region Scroll
    /**
     * Scrolls to the position.
     *
     * @param {number} position The pixels along the y-axis.
     * @param {boolean} [isSmooth] Specifies whether to enable smooth scroll.
     */
    scrollTo(position: number, isSmooth?: ScrollOptionsSupported["isSmooth"])
    {
        this._clearInProgressScroll();
        this._scrollManager.scrollTo(position, isSmooth == null ? undefined : { isSmooth });
    }

    /**
     * Scrolls to top.
     *
     * @param {boolean} [isSmooth] Specifies whether to enable smooth scroll.
     */
    public scrollToTop(isSmooth: ScrollOptionsSupported["isSmooth"] = false)
    {
        this._clearInProgressScroll();
        this._scrollManager.scrollTo(0, { isSmooth });
    }

    /**
     * Scrolls to bottom.
     *
     * @param {boolean} [isSmooth] Specifies whether to enable smooth scroll.
     */
    public scrollToBottom(isSmooth: ScrollOptionsSupported["isSmooth"] = false)
    {
        // TODO: May trigger bottomReached event twice (it actually reached bottom twice...).
        // Set in-progress scroll.
        this._continueScrollToIndex = this.scrollToBottom.bind(this, isSmooth);

        // Start scrolling.
        this._scrollManager.scrollToBottom({ isSmooth });
    }

    /**
     * Scrolls to the item at the specified index.
     *
     * @param {number} index The item index.
     * @param {ScrollOptionsSupported} [options] The scroll options.
     */
    public scrollToIndex(index: number, options?: ScrollOptionsSupported)
    {
        let narrowedIndex = Math.min(index, this._itemDataManager.dataSourceLength - 1);
        narrowedIndex = Math.max(0, narrowedIndex);

        const position = this._itemDataManager.getItemOffset(narrowedIndex);
        let offsetTop = position[0];
        if (options != null)
        {
            if (options.alignment === "center")
            {
                // Align to the center of the scrollable container.
                offsetTop -= (this._scrollableContainer.clientHeight - position[1]) / 2;
            }
            else if (options.alignment === "end")
            {
                // Align to the end of the scrollable container.
                offsetTop -= (this._scrollableContainer.clientHeight - position[1]);
            }
        }

        // Set in-progress scroll.
        this._continueScrollToIndex = this.scrollToIndex.bind(this, narrowedIndex, options);

        // Start scrolling.
        this._scrollManager.scrollTo(offsetTop, options);
    }
    //#endregion

    private _init()
    {
        // Create scrollable container.
        this._scrollableContainer = this.createElement("div", styles.scrollableContainer);

        // Create list header container.
        this._listHeaderContainer = this.createElement("div");

        // Create items container.
        this._itemsContainer = this.createElement("div", styles.itemsContainer);

        // Create list footer container.
        this._listFooterContainer = this.createElement("div");

        // Commit.
        this._scrollableContainer.appendChild(this._listHeaderContainer);
        this._scrollableContainer.appendChild(this._itemsContainer);
        this._scrollableContainer.appendChild(this._listFooterContainer);
        this.appendChild(this._scrollableContainer);

        // Init ItemDataManager.
        this._itemDataManager = new ItemDataManager(this);

        // Init ScrollTracker.
        this._scrollTracker = new ScrollTracker(this._scrollableContainer);
        this._scrollTracker.on("scroll", this._handleScroll);
        this._scrollTracker.on("scrollChange", this._handleScrollChange);
        this._scrollTracker.on("topReached", this._handleTopReached);
        this._scrollTracker.on("bottomReached", this._handleBottomReached);
        this._scrollTracker.observe();

        // Init ScrollManager.
        this._scrollManager = new ScrollManager(this._scrollableContainer);
        this._handleScrollEnd = debounce(this._handleScrollEnd, DEFAULT_SCROLL_TO_CONFIG.duration);

        // Init Reconciler.
        this._reconciler = new Reconciler(this, this._itemDataManager);
        this._reconciler.on("itemsResize", this._handleItemsResize);
    }

    private _clear()
    {
        this._removeListHeader();
        this._removeListFooter();
        this._removeListEmpty();
        this._reconciler.reset();
    }

    private _render()
    {
        // Only render if the list container has been appended.
        if (this._isAppended)
        {
            const scrollTop = this._scrollableContainer.scrollTop;

            // TODO: If we have a way to diff the data, we can bypass this clear function.
            this._clear();

            this._renderListHeader();
            this._renderListFooter();
            if (this._itemDataManager.dataSourceLength === 0)
            {
                this._renderListEmpty();
            }
            else
            {
                log("=== render: reconcile");
                this._reconciler.reconcile(scrollTop);
            }
        }
    }

    private _handleScroll = (entry: ScrollTrackerEntry) =>
    {
        log("=== reconcile: Scroll");
        this.emit("scroll", entry);
        this._reconciler.reconcile(entry.scrollTop);
    };

    private _handleScrollChange = (isScrolling: boolean) =>
    {
        this.emit("scrollChange", isScrolling);
        if (!isScrolling)
        {
            this._handleScrollEnd();
        }
    };

    private _handleTopReached = () =>
    {
        log("=== scroll topReached");
        this.emit("topReached");
    };

    private _handleBottomReached = () =>
    {
        log("=== scroll bottomReached");
        this.emit("bottomReached");
    };

    /**
     * Note: This method is debounced.
     */
    private _handleScrollEnd = () =>
    {
        this._clearInProgressScroll();
    };

    private _handleItemsResize = (delta: number) =>
    {
        // Due to the items resizing, we need to continue the in-progress scroll.
        // This fulfils the scrollToIndex method.
        if (delta !== 0 && this._continueScrollToIndex)
        {
            this._continueScrollToIndex();
        }
    };

    private _renderListHeader()
    {
        this._listHeader = this.renderListHeader();
        if (this._listHeader != null)
        {
            this._listHeaderContainer.append(this._listHeader);
        }
    }

    private _renderListFooter()
    {
        this._listFooter = this.renderListFooter();
        if (this._listFooter != null)
        {
            this._listFooterContainer.append(this._listFooter);
        }
    }

    private _renderListEmpty()
    {
        this._listEmpty = this.renderListEmpty();
        if (this._listEmpty != null)
        {
            this._itemsContainer.append(this._listEmpty);
        }
    }

    private _removeListHeader()
    {
        if (this._listHeader != null)
        {
            this._listHeader.remove();
            this._listHeader = undefined;
        }
    }

    private _removeListFooter()
    {
        if (this._listFooter != null)
        {
            this._listFooter.remove();
            this._listFooter = undefined;
        }
    }

    private _removeListEmpty()
    {
        if (this._listEmpty != null)
        {
            this._listEmpty.remove();
            this._listEmpty = undefined;
        }
    }

    private _clearInProgressScroll()
    {
        this._continueScrollToIndex = undefined;
    }
}
