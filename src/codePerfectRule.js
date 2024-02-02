document.addEventListener('joplin-noteDidUpdate', parseContent);
document.addEventListener('DOMContentLoaded', parseContent);

function parseContent() {
    const preElems = document.querySelectorAll("pre.hljs");
    Array.from(preElems).forEach((item, index) => {
        // 行号
        let num = item.innerText.split('\n').length - 1
        let ul = document.createElement("ul")
        ul.setAttribute('class', 'hljs-line-num')
        for (let i = 0; i < num; i++) {
            let n = i + 1
            let childLi = document.createElement("li")
            let li_text = document.createTextNode(n);
            childLi.appendChild(li_text)
            ul.appendChild(childLi)
        }
        item.appendChild(ul)
    });
}