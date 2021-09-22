import { createConstructedMessageList } from "./ConstructedMessageList";
import { createInheritedMessageList } from "./InheritedMessageList";
import type { Message } from "./types/Message";

const root = document.getElementById("root") as HTMLDivElement;
// const list = createInheritedMessageList();
const list = createConstructedMessageList();

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

// Although the theoretical maximum number of the messages is not limited,
// we can't render millions of items correctly due to the max padding limitation of chrome/firefox,
// which equals to 2**25 (33554432px).
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
