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
import { WordArray2ArrayBuffer } from "./converter";

/**
 * 通过密钥生成 挑战-应答 结果
 * @param challenge 挑战内容
 * @param key 密钥
 * @returns 应答结果
 */
export async function challenge2answer(
    //
    challenge: ArrayBuffer,
    key: ArrayBuffer,
): Promise<ArrayBuffer> {
    // @ts-ignore
    if (globalThis.isSecureContext) {
        // 使用 Web Crypto API
        // REF: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/sign
        const crypto_key = await globalThis.crypto.subtle.importKey(
            //
            "raw",
            key,
            {
                name: "HMAC",
                hash: "SHA-256",
            },
            false,
            ["sign"],
        );
        const answer = await globalThis.crypto.subtle.sign("HMAC", crypto_key, challenge);
        return answer;
    } else {
        // 使用 crypto-js
        // REF: https://cryptojs.gitbook.io/docs#hmac
        const answer = await CryptoJS.HmacSHA256(
            //
            CryptoJS.lib.WordArray.create(challenge),
            CryptoJS.lib.WordArray.create(key),
        );
        return WordArray2ArrayBuffer(answer);
    }
}
