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

                    return `<div class="code-perfect-clipboard-container">${defaultRender(tokens, idx, options, env, self)} ${button}</div>`;
                }
            },
            assets: function () {
                return [
                    {name: 'highlight/styles/atom-one-dark.css'},
                    {name: 'codePerfect.css'},
                    {name: 'codePerfectRule.js'}
                ];
            },
        }
    }
}