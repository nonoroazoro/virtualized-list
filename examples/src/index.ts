import { VirtualizedList } from "../../src";
import { InheritedMessageList } from "./InheritedMessageList";
import type { Message } from "./Message";

const root = document.getElementById("root") as HTMLDivElement;
// const list = new InheritedMessageList({ className: "messageList" });
const list = new VirtualizedList({
    className: "messageList",
    generateItemKey,
    renderListItem
});

function renderListItem(itemData: Message, key: string, index: number): HTMLElement
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

function generateItemKey(itemData: Message)
{
    return `key${itemData.id}`;
}

const toggleHeightBtn = document.getElementById("toggleHeight")!;
const toggleWidthBtn = document.getElementById("toggleWidth")!;
const toggleSizeBtn = document.getElementById("toggleSize")!;
toggleHeightBtn.addEventListener("click", () =>
{
    root.classList.toggle("rootSmallHeight");
});
toggleWidthBtn.addEventListener("click", () =>
{
    root.classList.toggle("rootSmallWidth");
});
toggleSizeBtn.addEventListener("click", () =>
{
    root.classList.toggle("rootSmallHeight");
    root.classList.toggle("rootSmallWidth");
});

const scrollToTopBtn = document.getElementById("scrollToTop")!;
const scrollToBottomBtn = document.getElementById("scrollToBottom")!;
const scrollToIndexBtn = document.getElementById("scrollToIndex")!;
const scrollIndexSpan = document.getElementById("scrollIndex")!;
scrollToTopBtn.addEventListener("click", () =>
{
    list.scrollToTop();
});
scrollToBottomBtn.addEventListener("click", () =>
{
    list.scrollToBottom();
});
scrollToIndexBtn.addEventListener("click", () =>
{
    const index = Math.min(Math.floor(Math.random() * 120000), 100000);
    // const index = 50;
    scrollIndexSpan.textContent = String(index);
    list.scrollToIndex(index);
});

// The max padding allowed by chrome is 2**25, which is 33554432px, so 1 million items is not supported.
const data: Message[] = [];
for (let i = 0; i < 100001; i++)
{
    data.push({
        id: `${i}`,
        text: `Message ${i} - Content Content Content Content Content Content Content Content Content Content`
    });
}

list.appendTo(root);
list.dataSource = data;
// list.scrollToBottom();
