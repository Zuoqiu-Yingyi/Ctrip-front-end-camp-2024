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

import type { ImageLoader } from "next/image";
import imageCompression, { type Options } from "browser-image-compression";

import { origin } from "./env";
export const DEFAULT_AVATAR_PATH = "/static/avatar.png";

export function uid2path(uid: string): string {
    return `${origin}/assets/${uid}`;
}

/**
 * 资源加载
 * @see {@link https://nextjs.org/docs/app/api-reference/components/image#loader}
 */
export const assetsLoader: ImageLoader = function ({
    src,
    // width,
    // quality,
}) {
    return uid2path(src);
};

/**
 * 头像加载
 * @see {@link https://nextjs.org/docs/app/api-reference/components/image#loader}
 */
export const avatarLoader: ImageLoader = function ({
    src,
    // width,
    // quality,
}) {
    return /^[0-9a-z]{24}$/.test(src) ? `/assets/${src}` : DEFAULT_AVATAR_PATH;
};

/**
 * 图片优化
 */
export async function imageOptimizer(
    file: File,
    options: Options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1440,
    },
): Promise<File> {
    return imageCompression(file, options);
}
