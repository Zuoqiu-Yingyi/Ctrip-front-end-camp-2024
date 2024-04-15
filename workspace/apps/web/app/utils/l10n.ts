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

import { useTranslation } from "react-i18next";
import { setDefaultConfig } from "antd-mobile";

import antd_en_US from "antd-mobile/es/locales/en-US";
import antd_zh_CN from "antd-mobile/es/locales/zh-CN";
import antd_zh_HK from "antd-mobile/es/locales/zh-HK";

export type TLocale = "zh-Hans" | "zh-Hant" | "en";

/**
 * 获取支持的地区
 */
export function mapLocale(
    //
    lang: string = globalThis.navigator.language,
    preset: TLocale[] = ["en", "zh-Hans", "zh-Hant"],
): TLocale {
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
    return lang as TLocale;
}

/**
 * 更改本地化选项
 * @param locale 地区
 */
export function changeLocale(locale: TLocale | string) {
    const { i18n } = useTranslation();
    switch (locale) {
        case "en":
            // REF: https://www.i18next.com/overview/api#changelanguage
            i18n.changeLanguage("en");

            // REF: https://mobile.ant.design/zh/guide/i18n/
            setDefaultConfig({ locale: antd_en_US });
            break;
        case "zh-Hans":
            i18n.changeLanguage("zh-Hans");
            setDefaultConfig({ locale: antd_en_US });
            break;
        case "zh-Hant":
            i18n.changeLanguage("zh-Hant");
            setDefaultConfig({ locale: antd_en_US });
            break;
        default:
            changeLocale(mapLocale());
            break;
    }
}
