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

import jwt from "jsonwebtoken";
import { Role } from "./role";
import env from "./../configs/env";

export interface IChallengeJwtPayload {
    username: string;
    role: Role;
}

/**
 * 创建挑战-应答用的 JWT 字符串
 * @param payload 挑战-应答用的 JWT 载荷
 * @param secret 密钥
 * @param options 选项
 * @returns JWT 字符串
 */
export function createChallengeString(
    //
    payload: IChallengeJwtPayload,
    secret: string = env.CHALLENGE_RESPONSE_JWT_SECRET,
    options: jwt.SignOptions = {
        algorithm: "HS256",
        issuer: env.CHALLENGE_RESPONSE_JWT_ISSUER,
        expiresIn: env.CHALLENGE_RESPONSE_JWT_EXPIRES_IN,
    },
): string {
    // REF: https://www.npmjs.com/package/jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
    return jwt.sign(payload, secret, options);
}

/**
 * 校验挑战-应答用的 JWT 字符串是否有效
 * @param token JWT 字符串
 * @param secret 密钥
 * @param options 选项
 */
export function verifyChallengeString(
    //
    token: string,
    secret: string = env.CHALLENGE_RESPONSE_JWT_SECRET,
    options: jwt.VerifyOptions = {
        algorithms: ["HS256"],
        issuer: env.CHALLENGE_RESPONSE_JWT_ISSUER,
    },
): boolean {
    try {
        // REF: https://www.npmjs.com/package/jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
        jwt.verify(token, secret, options);
        return true;
    } catch (err) {
        return false;
    }
}

/**
 * 校验挑战-应答用的 JWT 载荷是否有效
 */
export function verifyChallengePayload(
    //
    token: string,
    payload: IChallengeJwtPayload,
): boolean {
    try {
        const decoded = jwt.decode(token) as IChallengeJwtPayload;
        return decoded.username === payload.username && decoded.role === payload.role;
    } catch (err) {
        return false;
    }
}
