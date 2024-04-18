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

import parser from "parse-data-url";

/**
 * Convert a Blob to a data URL.
 */
export async function blob2dataURL(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        // REF: https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader
        const reader = new FileReader();

        reader.addEventListener("load", (e) => resolve(reader.result as string), {
            once: true,
            passive: true,
        });
        reader.addEventListener("error", (e) => reject(e), {
            once: true,
            passive: true,
        });
        // REF: https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader/readAsDataURL
        reader.readAsDataURL(blob);
    });
}

/**
 * Convert a data URL to a Blob.
 */
export function dataURL2blob(dataURL: string): Blob | null {
    const result = parser(dataURL);
    if (result) {
        return new Blob([result.toBuffer()], { type: result.contentType });
    }
    return null;
}

/**
 * Convert a canvas to a Blob.
 */
export async function canvas2blob(
    //
    canvas: HTMLCanvasElement,
    type = "image/webp",
    quality = 1,
): Promise<Blob | null> {
    // REF: https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/toBlob
    const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(
            //
            resolve,
            type,
            quality,
        ),
    );
    return blob;
}
