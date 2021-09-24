import { AbstractVirtualizedList } from "../../src";
import * as renderers from "./Renderers";
import type { Message } from "./types/Message";
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
        return renderers.renderListItem(itemData, key, index);
    }

    protected override renderListHeader()
    {
        return renderers.renderListHeader();
    }

    protected override renderListFooter()
    {
        return renderers.renderListFooter();
    }

    protected override renderListEmpty()
    {
        return renderers.renderListEmpty();
    }

    public generateItemKey(itemData: Message)
    {
        return renderers.generateItemKey(itemData);
    }
}

export function createInheritedMessageList()
{
    return new InheritedMessageList({ className: "messageList" });
}
