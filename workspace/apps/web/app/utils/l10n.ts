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

import { setDefaultConfig } from "antd-mobile";

import antd_en_US from "antd-mobile/es/locales/en-US";
import antd_zh_CN from "antd-mobile/es/locales/zh-CN";
import antd_zh_HK from "antd-mobile/es/locales/zh-HK";
import i18n from "./i18n";
import {
    //
    mapLocale,
    type TLocale,
} from "./locale";

/**
 * 更改本地化选项
 * @param locale 地区
 */
export function changeLocale(locale: TLocale | string) {
    switch (locale) {
        case "en":
            // REF: https://www.i18next.com/overview/api#changelanguage
            i18n.changeLanguage("en");

            // REF: https://mobile.ant.design/zh/guide/i18n/
            setDefaultConfig({ locale: antd_en_US });
            break;
        case "zh-Hans":
            i18n.changeLanguage("zh-Hans");
            setDefaultConfig({ locale: antd_zh_CN });
            break;
        case "zh-Hant":
            i18n.changeLanguage("zh-Hant");
            setDefaultConfig({ locale: antd_zh_HK });
            break;
        default:
            changeLocale(mapLocale());
            break;
    }
}
