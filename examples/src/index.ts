import { VirtualizedList } from "../../src";
import { InheritedMessageList } from "./InheritedMessageList";
import type { Message } from "./Message";

const root = document.getElementById("root") as HTMLDivElement;
// const list = new InheritedMessageList({ className: "messageList" });
const list = new VirtualizedList({
    className: "messageList",
    generateItemKey,
    renderListItem,
    renderListEmpty,
    renderListFooter,
    renderListHeader
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

function renderListHeader()
{
    const header = this.createElement("div");
    header.textContent = "List Header";
    header.style.textAlign = "center";
    header.style.padding = `${Math.floor(Math.random() * 500)}px 0`;
    // header.style.padding = `500px 0`;
    header.style.backgroundColor = "#ddd";
    return header;
}

function renderListFooter()
{
    const footer = this.createElement("div");
    footer.textContent = "List Footer";
    footer.style.textAlign = "center";
    footer.style.padding = `${Math.floor(Math.random() * 500)}px 0`;
    // footer.style.padding = `500px 0`;
    footer.style.backgroundColor = "#ddd";
    return footer;
}

function renderListEmpty()
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
// setTimeout(() =>
// {
//     list.dataSource = [];
//     setTimeout(() =>
//     {
//         list.dataSource = data;
//         setTimeout(() =>
//         {
//             list.dataSource = [];
//             setTimeout(() =>
//             {
//                 list.dataSource = data;
//             }, 2000);
//         }, 2000);
//     }, 2000);
// }, 2000);
// list.scrollToBottom();
