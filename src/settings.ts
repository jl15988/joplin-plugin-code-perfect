import joplin from 'api';
import {SettingItemType} from "api/types";
import {ChangeEvent} from "api/JoplinSettings";

const SECTION_NAME = 'codePerfectSection';

export const settingNames = {
    codeTheme: 'codeTheme',
    showLineNumbers: 'showLineNumbers',
    showCopy: 'showCopy'
}

export const CodeThemes = [
    "a11y-dark",
    "a11y-light",
    "androidstudio",
    "arduino-light",
    "atom-one-dark",
    "atom-one-light",
    "brown-paper",
    "codepen-embed",
    "color-brewer",
    "dark",
    "default",
    "docco",
    "far",
    "foundation",
    "github",
    "github-dark",
    "googlecode",
    "grayscale",
    "hybrid",
    "idea",
    "ir-black",
    "kimbie-dark",
    "kimbie-light",
    "magula",
    "monokai",
    "monokai-sublime",
    "night-owl"
]

function getCodeThemeOptions() {
    const res = {}
    CodeThemes.forEach((value, index) => {
        res[index] = value;
    })
    return res
}

// 设置内容
const settingsValue = {
    [settingNames.codeTheme]: {
        label: '代码主题',
        type: SettingItemType.Int,
        value: CodeThemes["atom-one-dark"],
        public: true,
        isEnum: true,
        options: getCodeThemeOptions(),
        section: SECTION_NAME
    },
    [settingNames.showLineNumbers]: {
        label: '显示行号',
        type: SettingItemType.Bool,
        value: true,
        public: true,
        section: SECTION_NAME
    },
    [settingNames.showCopy]: {
        label: '显示复制',
        type: SettingItemType.Bool,
        value: true,
        public: true,
        section: SECTION_NAME
    }
}

function useSettings() {

    async function registerSettings() {
        // 注册菜单
        await joplin.settings.registerSection(SECTION_NAME, {
            label: 'CodePerfect',
        });
        // 注册设置
        await joplin.settings.registerSettings(settingsValue);
    }

    async function getSetting(name: string): Promise<any> {
        return await joplin.settings.value(name)
    }

    async function handleChange(cb: (settingInfo: Record<string, any>, event: ChangeEvent) => void) {
        await joplin.settings.onChange(async event => {
            const keys = event.keys
            const settingInfo: Record<string, any> = {}
            for (let key of keys) {
                const settingVal = await getSetting(key)
                settingInfo[key] = settingVal
            }
            cb && cb(settingInfo, event);
        })
    }

    async function loadSetting(settingInfo: Record<string, any>) {
        const installDir = await joplin.plugins.installationDir();
        for (let settingInfoKey in settingInfo) {
            const settingVal = settingInfo[settingInfoKey];
            if (settingInfoKey === settingNames.codeTheme) {
                await joplin.window.loadNoteCssFile(`${installDir}/highlight/styles/${CodeThemes[settingVal]}.css`);
            } else if (settingInfoKey === settingNames.showLineNumbers) {
                if (settingVal) {
                    await joplin.window.loadNoteCssFile(`${installDir}/css/line-number.css`);
                } else {
                    await joplin.window.loadNoteCssFile(`${installDir}/css/line-number-hide.css`);
                }
            } else if (settingInfoKey === settingNames.showCopy) {
                if (settingVal) {
                    await joplin.window.loadNoteCssFile(`${installDir}/css/clipboard.css`);
                } else {
                    await joplin.window.loadNoteCssFile(`${installDir}/css/clipboard-hide.css`);
                }
            }
        }
    }

    return {
        registerSettings,
        getSetting,
        handleChange,
        loadSetting
    }
}

export default useSettings
