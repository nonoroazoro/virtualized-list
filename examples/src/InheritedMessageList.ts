import { AbstractVirtualizedList } from "../../src";
import * as renderers from "./Renderers";
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
        return renderers.renderListItem.call(this, itemData, key, index);
    }

    protected override renderListHeader()
    {
        return renderers.renderListHeader.call(this);
    }

    protected override renderListFooter()
    {
        return renderers.renderListFooter.call(this);
    }

    protected override renderListEmpty()
    {
        return renderers.renderListEmpty.call(this);
    }

    public generateItemKey(itemData: Message)
    {
        return renderers.generateItemKey.call(this, itemData);
    }
}

export function createInheritedMessageList()
{
    return new InheritedMessageList({ className: "messageList" });
}
