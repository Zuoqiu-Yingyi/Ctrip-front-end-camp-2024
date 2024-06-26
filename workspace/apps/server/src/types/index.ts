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
 * CUID 字符串
 * - 格式: 24 个字符 `[0-9a-z]{24}`
 */
export const CUID = z
    .string({ description: "CUID (Collision Resistant Unique Identifier)" })
    .length(24)
    .toLowerCase()
    .regex(/^[0-9a-z]{24}$/);

/**
 * 数据库 ID 字段
 */
export const ID = z //
    .number({ description: "Database ID" })
    .int()
    .min(1);
