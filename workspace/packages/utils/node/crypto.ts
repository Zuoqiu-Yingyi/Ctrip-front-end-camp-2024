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

import crypto from "node:crypto";

/**
 * 随机字符串生成器
 * @param space 字符串空间大小 (单位: Byte)
 * @returns 随机字符串
 */
export function randomString(space: number = 32): string {
    return crypto.randomBytes(space).toString("base64url");
}

/**
 * 普通字符串转换为 Buffer
 * @param str 字符串
 * @returns Buffer
 */
export function string2Buffer(str: string): Buffer {
    return Buffer.from(str, "utf-8");
}

/**
 * 通过用户名与用户口令派生用户密钥
 * @param username 用户名
 * @param passphrase 用户口令
 * @param salt 盐值
 * @returns 派生的用户密码
 */
export function passphrase2key(
    //
    username: string,
    passphrase: string,
    salt: string,
): Buffer {
    const message = `${username}:${salt}:${passphrase}`;
    return crypto //
        .createHash("sha256")
        .update(string2Buffer(message))
        .digest();
}

/**
 * 通过密钥生成 挑战-应答 结果
 * @param challenge 挑战内容
 * @param key 密钥
 * @returns 应答结果
 */
export function challenge2answer(
    //
    challenge: Buffer,
    key: Buffer,
): Buffer {
    return crypto //
        .createHmac("sha256", key)
        .update(challenge)
        .digest();
}
