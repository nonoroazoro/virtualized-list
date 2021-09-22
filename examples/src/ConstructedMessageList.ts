import { VirtualizedList } from "../../src";
import * as renderers from "./Renderers";

export function createConstructedMessageList()
{
    const list = new VirtualizedList({ className: "messageList", ...renderers });
    list.container.style.border = "1px solid orange";
    return list;
}
