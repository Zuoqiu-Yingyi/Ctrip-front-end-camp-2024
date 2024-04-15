/**
 * Copyright (C) 2024 Zuoqiu Yingyi
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/locales/en/mobile.json";
import zh_Hans from "@/locales/zh-Hans/mobile.json";
import zh_Hant from "@/locales/zh-Hant/mobile.json";

export type I18N = typeof zh_Hans;
export type TLocale = "zh-Hans" | "zh-Hant" | "en";

export function mapLang(lang: string = globalThis.navigator.language, preset: string[] = []): string {
    lang = lang.replace("_", "-").toLowerCase();

    switch (true) {
        case lang in preset:
            break;

        case lang.startsWith("zh-chs"):
        case lang.startsWith("zh-cns"):
            lang = "zh-Hans";
            break;
        case lang.startsWith("zh-cht"):
        case lang.startsWith("zh-cnt"):
            lang = "zh-Hant";
            break;

        case lang.startsWith("zh-hans"):
        case lang.startsWith("zh-cn"):
        case lang.startsWith("zh-sg"):
            lang = "zh-Hans";
            break;

        case lang.startsWith("zh-hant"):
        case lang.startsWith("zh-tw"):
        case lang.startsWith("zh-hk"):
        case lang.startsWith("zh-mo"):
            lang = "zh-Hant";
            break;

        case lang.startsWith("zh"):
            lang = "zh-Hans";
            break;

        case lang.startsWith("en"):
        default:
            lang = "en";
            break;
    }
    return lang;
}

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
    en: {
        translation: en,
    },
    "zh-Hans": {
        translation: zh_Hans,
    },
    "zh-Hant": {
        translation: zh_Hant,
    },
};

i18n.use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        fallbackLng: "en",
        lng: mapLang(), // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
        // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
        // if you're using a language detector, do not define the lng option
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
    });

export default i18n;
