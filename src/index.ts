import joplin from 'api';
import {ContentScriptType} from 'api/types';

const pluginId = "jl15988.JoplinCodePerfectPlugin"

joplin.plugins.register({
    onStart: async function () {
        await joplin.contentScripts.register(
            ContentScriptType.MarkdownItPlugin,
            pluginId,
            './codePerfect.js'
        );
    },
});
