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

import { Rule } from "antd/es/form";
import { TFunction } from "i18next";

/**
 * 用户名正则表达式
 * 支持大小写英文字母, 数字, 短横线与下划线
 */
const USERNAME_PATTERN = /^[0-9a-zA-Z\-\_]+$/;

/**
 * 用户口令正则表达式
 * 支持所有可视的 ASCII 字符
 */
const PASSPHRASE_PATTERN = /^[\x21-\x7E]+$/;

/**
 * 创建用户名校验规则列表
 */
export function createUsernameRules(t: TFunction<"translation", undefined>): Rule[] {
    return [
        {
            required: true,
            message: t("input.username.rules.required.message"),
        },
        {
            min: 2,
            max: 32,
            message: t("input.username.rules.length.message"),
        },
        {
            pattern: USERNAME_PATTERN,
            message: t("input.username.rules.pattern.message"),
        },
    ];
}

/**
 * 创建用户口令校验规则列表
 */
export function createPassphraseRules(t: TFunction<"translation", undefined>): Rule[] {
    return [
        {
            required: true,
            message: t("input.password.rules.required.message"),
        },
        {
            min: 8,
            message: t("input.password.rules.length.message"),
        },
    ];
}
