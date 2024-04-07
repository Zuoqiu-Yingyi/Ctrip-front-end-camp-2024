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

/**
 * 挑战字符串
 * - 格式: JWT
 */
export const AUTH_CHALLENGE = z //
    .string({ description: "Challenge string" });

/**
 * 应答字符串
 * - 格式: hex 十六进制字符串
 * - 64 个字符 `0~f` (256 位, 32 字节)
 */
export const AUTH_RESPONSE = z //
    .string({ description: "Response string" })
    .length(64)
    .toLowerCase()
    .regex(/^[0-9a-f]{64}$/);

/**
 * 是否保持登录状态
 */
export const AUTH_STAY = z //
    .boolean({ description: "Stay signed in" });
