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

import { z } from "zod";

import { CUID } from ".";

/**
 * 账户名
 * - 2 ~ 32 位字符
 * - 仅支持数字 `0~9`、大小写字母 `a~z`, `A-Z`、短横线 `-`、下划线 `_`
 */
export const ACCOUNT_NAME = z
    .string({ description: "Account name" })
    .min(2)
    .max(32)
    .regex(/^[0-9a-zA-Z\-\_]{2,32}$/);

/**
 * 账户密码
 * - 格式: hex 十六进制字符串
 * - 64 个字符 `0~f` (256 位, 32 字节)
 */
export const ACCOUNT_PASSWORD = z
    .string({ description: "Account login key" })
    .length(64)
    .toLowerCase()
    .regex(/^[0-9a-f]{64}$/);

/**
 * 账户头像
 * - 格式: CUID 字符串或 null
 * - 24 个字符 `[0-9a-z]{24}`
 */
export const ACCOUNT_AVATAR = z //
    .nullable(CUID, { description: "Account avatar" });

/**
 * 账户角色
 */
export const ACCOUNT_ROLE = z // 账户角色
    .enum(
        [
            "staff", // 职员
            "user", // 用户
        ],
        { description: "Account role" },
    )
    .optional();
