import hljs = require("./highlight/highlight");

module.exports = {
    default: function (context) {
        return {
            plugin: function (markdownIt, options) {
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

                    return defaultRender(tokens, idx, options, env, self);
                }
            },
            assets: function () {
                return [
                    {name: 'highlight/styles/atom-one-dark.css'},
                    {name: 'codePerfect.css'}
                ];
            },
        }
    }
}