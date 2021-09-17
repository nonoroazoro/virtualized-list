import { AbstractVirtualizedList } from "../../src";
import type { Message } from "./Message";
import type { VirtualizedListOptions } from "../../src";

export class InheritedMessageList extends AbstractVirtualizedList<Message>
{
    constructor(options: VirtualizedListOptions)
    {
        super(options);
        this.container.style.border = "1px solid blue";
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

    protected override renderListHeader()
    {
        const header = this.createElement("div");
        header.textContent = "List Header";
        header.style.textAlign = "center";
        header.style.padding = `${Math.floor(Math.random() * 500)}px 0`;
        // header.style.padding = `500px 0`;
        header.style.backgroundColor = "#ddd";
        return header;
    }

    protected override renderListFooter()
    {
        const footer = this.createElement("div");
        footer.textContent = "List Footer";
        footer.style.textAlign = "center";
        footer.style.padding = `${Math.floor(Math.random() * 500)}px 0`;
        // footer.style.padding = `500px 0`;
        footer.style.backgroundColor = "#ddd";
        return footer;
    }

    protected override renderListEmpty()
    {
        const empty = this.createElement("div");
        empty.textContent = "No Items";
        empty.style.textAlign = "center";
        empty.style.padding = "100px";
        empty.style.border = "1px solid green";
        empty.style.margin = "20px";
        // empty.style.marginBottom = "500px";
        return empty;
    }

    public generateItemKey(itemData: Message)
    {
        return `key${itemData.id}`;
    }
}
