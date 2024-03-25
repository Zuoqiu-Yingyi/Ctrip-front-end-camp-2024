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

const str: string = "test.ts";
console.log(str);

/**
 * @param param1 这是一个 `字符串`
 * @param param2 这是一个 `数字`
 *
 * @returns 返回一个 `字符串`
 *
 * {@link Document.URL}
 */
function func(
    param1: string, //
    param2: number, //
): string {
    return param1;
}

function func2<
    T, //
    U, //
>() {}

const arr = [
    1, //
    2, //
];

/**
 * @returns true if the specified tag is surrounded with `{`
 * and `}` characters.
 *
 * @example
 * Prints "true" for `{@link}` but "false" for `@internal`:
 * ```ts
 * console.log(isInlineTag('{@link}'));
 * console.log(isInlineTag('@internal'));
 * ```
 * @see {@link http://example.com/@internal | the @internal tag}
 */
declare function isInlineTag(tagName: string): boolean;
