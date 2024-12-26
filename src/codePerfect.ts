import hljs = require("./highlight/highlight");

module.exports = {
    default: function (context) {
        return {
            plugin: function (markdownIt, options) {
                const pluginId = context.pluginId;

                const defaultRender = markdownIt.renderer.rules.fence || function (tokens, idx, options, env, self) {
                    return self.renderToken(tokens, idx, options, env, self);
                };
                markdownIt.renderer.rules.fence = function (tokens, idx, options, env, self) {
                    // 自定义highlight
                    options.highlight = (str, lang) => {
                        if (lang && hljs.getLanguage(lang)) {
                            try {
                                return '<pre class="hljs"><code class="hljs">' +
                                    hljs.highlight(lang, str, true).value +
                                    '</code></pre>';
                            } catch (__) {
                            }
                        }

                        return str; // 使用额外的默认转义
                    }

                    // 复制按钮
                    const token = tokens[idx];
                    const oneLineContent = encodeURIComponent(token.content)
                        .replace(/'/g, "\\'");
                    const onClick = `
                        webviewApi.postMessage('${pluginId}', '${oneLineContent}');
                        document.getElementsByClassName('code-perfect-clipboard-button-${idx}')[0].classList.add('copied');
                        setTimeout(() => document.getElementsByClassName('code-perfect-clipboard-button-${idx}')[0].classList.remove('copied'), ${2 * 1000});
                    `.replace(/\n/g, ' ');

                    const button = `
                        <div class="code-perfect-clipboard-button code-perfect-clipboard-button-${idx}" onclick="${onClick}" title="Copy">
                            <span class="code-perfect-clipboard-copy">Copy</span>
                            <span class="code-perfect-clipboard-copied">Copied</span>
                        </div>
                    `

                    // 行号
                    const codePerfectContainerElement = document.createElement("div");
                    codePerfectContainerElement.innerHTML = `${defaultRender(tokens, idx, options, env, self)} ${button}`;
                    const preElems = codePerfectContainerElement.querySelectorAll("pre.hljs");
                    Array.from(preElems).forEach((item, index) => {
                        let num = item.innerHTML.split('\n').length - 1
                        let ul = document.createElement("ul")
                        ul.setAttribute('class', 'hljs-line-num')
                        for (let i = 0; i < num; i++) {
                            let n = i + 1
                            let childLi = document.createElement("li")
                            let li_text = document.createTextNode(String(n));
                            childLi.appendChild(li_text)
                            ul.appendChild(childLi)
                        }
                        item.appendChild(ul)
                    });

                    // 折叠
                    // const foldElem = document.createElement("div");
                    // foldElem.classList.add("code-perfect-fold-button");

                    const escapeHtml = markdownIt.utils.escapeHtml;
                    const language = escapeHtml(token.info).split(/\s+/g)[0];
                    const source = `${token.markup}${escapeHtml(token.info)}&NewLine;`

                    return `
                        <div class="joplin-editable code-perfect-container">
                            <pre
                                class="joplin-source"
                                data-joplin-language="${language}"
                                data-joplin-source-open="${source}"
                                data-joplin-source-close="${token.markup}"
                            >${escapeHtml(token.content)}</pre>
                            ${codePerfectContainerElement.innerHTML}
                        </div>
                    `;
                }
            },
        }
    }
}
