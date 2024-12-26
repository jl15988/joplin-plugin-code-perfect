import joplin from 'api';
import {ContentScriptType} from 'api/types';

const pluginId = "jl15988.JoplinCodePerfectPlugin"

joplin.plugins.register({
    onStart: async function () {
        // await joplin.settings.registerSettings({
        //     "codePerfect": {
        //         value: {
        //             value: 'dark'
        //         },
        //         type: SettingItemType.Array,
        //         label: '代码主题',
        //         public: true,
        //         isEnum: true,
        //         options: {
        //             dark: {
        //                 value: 'dark'
        //             },
        //             white: {
        //                 value: 'white'
        //             }
        //         }
        //     }
        // })

        await joplin.contentScripts.register(
            ContentScriptType.MarkdownItPlugin,
            pluginId,
            './codePerfect.js'
        );

        await joplin.contentScripts.onMessage(pluginId, (message: any) => {
            joplin.clipboard.writeText(decodeURIComponent(message));
        });

        const installDir = await joplin.plugins.installationDir();

        await joplin.window.loadNoteCssFile(`${installDir}/highlight/styles/atom-one-dark.css`);
        await joplin.window.loadNoteCssFile(`${installDir}/codePerfect.css`);
    },
});
