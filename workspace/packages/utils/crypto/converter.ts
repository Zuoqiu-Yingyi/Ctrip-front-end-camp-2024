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

import CryptoJS from "crypto-js";

/**
 * Converts a cryptjs WordArray to native ArrayBuffer
 * REF: https://github.com/brix/crypto-js/issues/274#issuecomment-600039187
 * @param wordArray 每个字的大小为 32 位的字数组
 */
export function WordArray2ArrayBuffer(wordArray: CryptoJS.lib.WordArray): ArrayBuffer {
    const { words, sigBytes: length } = wordArray;
    const bytes = new Uint8Array(length);
    let byte_i = 0,
        word_i = 0;

    while (true) {
        // here byte_i is a multiple of 4
        const word = words[word_i++]!;
        if (byte_i + 4 <= length) {
            bytes[byte_i++] = (word & 0xff_00_00_00) >>> 24;
            bytes[byte_i++] = (word & 0x00_ff_00_00) >>> 16;
            bytes[byte_i++] = (word & 0x00_00_ff_00) >>> 8;
            bytes[byte_i++] = word & 0x00_00_00_ff;
        } else {
            if (byte_i == length) break;
            bytes[byte_i++] = (word & 0xff_00_00_00) >>> 24;
            if (byte_i == length) break;
            bytes[byte_i++] = (word & 0x00_ff_00_00) >>> 16;
            if (byte_i == length) break;
            bytes[byte_i++] = (word & 0x00_00_ff_00) >>> 8;
            if (byte_i == length) break;
            bytes[byte_i++] = word & 0x00_00_00_ff;
        }
    }
    return bytes.buffer;
}

/**
 * 普通字符串转换为 ArrayBuffer
 * @param str 字符串
 * @returns ArrayBuffer
 */
export function string2ArrayBuffer(str: string): ArrayBuffer {
    const encoder = new TextEncoder();
    return encoder.encode(str).buffer;
}

/**
 * ArrayBuffer 转换为普通字符串
 */
export function ArrayBuffer2String(arrayBuffer: ArrayBuffer): string {
    const decoder = new TextDecoder();
    return decoder.decode(arrayBuffer);
}

/**
 * ArrayBuffer 转换为 Hex 字符串
 * @param arrayBuffer ArrayBuffer
 * @returns Hex 字符串
 */
export function ArrayBuffer2HexString(arrayBuffer: ArrayBuffer): string {
    const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
    const hexString = CryptoJS.enc.Hex.stringify(wordArray);
    return hexString;
}

/**
 * Hex 字符串 转换为 ArrayBuffer
 * @param hexString Hex 字符串
 * @returns ArrayBuffer
 */
export function HexString2ArrayBuffer(hexString: string): ArrayBuffer {
    const wordArray = CryptoJS.enc.Hex.parse(hexString);
    const arrayBuffer = WordArray2ArrayBuffer(wordArray);
    return arrayBuffer;
}
