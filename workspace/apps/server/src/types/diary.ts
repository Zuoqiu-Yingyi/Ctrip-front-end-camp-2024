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

import {
    //
    CUID,
    ID,
} from ".";
import { COORDINATE } from "./coordinate";

/**
 * 旅游日记标题
 */
export const DIARY_TITLE = z //
    .string({ description: "Diary title" })
    .min(1)
    .max(32);

/**
 * 旅游日记内容
 */
export const DIARY_CONTENT = z //
    .string({ description: "Diary content" })
    .min(1);

/**
 * 旅游日记资源文件引用列表
 */
export const DIARY_ASSETS = z //
    .array(CUID, { description: "Diary assets IDs" })
    .min(1);

export const DIARY_CREATE = z //
    .object({
        title: DIARY_TITLE,
        content: DIARY_CONTENT,
        assets: DIARY_ASSETS,
        coordinate: COORDINATE.optional(),
    });

export const DIARY_UPDATE = z //
    .object({
        id: ID,
        title: DIARY_TITLE.optional(),
        content: DIARY_CONTENT.optional(),
        assets: DIARY_ASSETS.optional(),
        coordinate: COORDINATE.optional(),
    });
