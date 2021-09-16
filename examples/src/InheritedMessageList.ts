import { AbstractVirtualizedList } from "../../src";
import type { Message } from "./Message";
import type { VirtualizedListOptions } from "../../src";

export class InheritedMessageList extends AbstractVirtualizedList<Message>
{
    constructor(options: VirtualizedListOptions)
    {
        super(options);
        this.element.style.border = "1px solid blue";
    }

    protected renderListItem(itemData: Message, key: string, index: number): HTMLElement
    {
        const item = this.createElement("div", "messageListItem");
        item.id = key;
        item.textContent = itemData.text;

        const randomPadding = `${Math.floor(Math.random() * 50)}px`;
        // const randomPadding = "14px";
        item.style.paddingTop = randomPadding;
        item.style.paddingBottom = randomPadding;
        if (index % 2 === 0)
        {
            item.style.backgroundColor = `#EEE`;
        }
        return item;
    }

    public generateItemKey(itemData: Message)
    {
        return `key${itemData.id}`;
    }
}
