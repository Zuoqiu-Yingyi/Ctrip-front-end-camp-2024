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

export enum Theme {
    auto = "auto",
    light = "light",
    dark = "dark",
}

/**
 * 是否自动切换主题模式
 */
var auto: boolean = true;

/**
 * 设置主题模式
 */
export function setTheme(theme: Theme.light | Theme.dark) {
    switch (theme) {
        default:
        case Theme.light:
            // REF: https://mobile.ant.design/zh/guide/dark-mode
            document.documentElement.setAttribute("data-prefers-color-scheme", "light");
            break;
        case Theme.dark:
            // REF: https://mobile.ant.design/zh/guide/dark-mode
            document.documentElement.setAttribute("data-prefers-color-scheme", "dark");
            break;
    }
}

/**
 * 更改主题模式
 * @param theme 主题模式
 */
export function changeTheme(theme: Theme) {
    switch (theme) {
        case Theme.light:
        case Theme.dark:
            auto = false;
            setTheme(theme);
            break;

        case Theme.auto:
        default:
            auto = true;
            setTheme(
                // REF: https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryListEvent/matches
                window.matchMedia("(prefers-color-scheme: light)").matches //
                    ? Theme.light
                    : Theme.dark,
            );
            break;
    }
}

if ("matchMedia" in globalThis) {
    /**
     * 监听系统主题更改
     */
    // REF: https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryListEvent/matches
    globalThis.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e) => {
        console.debug(e.matches);
        if (auto) {
            setTheme(e.matches ? Theme.light : Theme.dark);
        }
    });
}
