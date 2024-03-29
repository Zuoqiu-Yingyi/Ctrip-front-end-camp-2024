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
import {
    //
    WordArray2ArrayBuffer,
    String2ArrayBuffer,
} from "./converter";

/**
 * 通过用户名与用户口令派生用户密钥
 * @param username 用户名
 * @param passphrase 用户口令
 * @param salt 盐值
 * @returns 派生的用户密码
 */
export async function passphrase2key(
    //
    username: string,
    passphrase: string,
    salt: string,
): Promise<ArrayBuffer> {
    const message = `${username}:${salt}:${passphrase}`;
    // @ts-ignore
    if (globalThis.isSecureContext) {
        // 使用 Web Crypto API
        // REF: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
        const password = await globalThis.crypto.subtle.digest("SHA-256", String2ArrayBuffer(message));
        return password;
    } else {
        // 使用 crypto-js
        // REF: https://cryptojs.gitbook.io/docs#hashing
        const password = CryptoJS.SHA256(message);
        return WordArray2ArrayBuffer(password);
    }
}
