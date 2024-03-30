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

/* 默认的 JWT 配置 */
export const DEFAULT_SECRET: jwt.Secret = env.CHALLENGE_RESPONSE_JWT_SECRET;
export const DEFAULT_SIGN_OPTIONS = {
    algorithm: "HS256",
    issuer: env.CHALLENGE_RESPONSE_JWT_ISSUER,
    expiresIn: env.CHALLENGE_RESPONSE_JWT_EXPIRES_IN,
} as const satisfies jwt.SignOptions;
export const DEFAULT_VERIFY_OPTIONS = {
    algorithms: ["HS256"],
    issuer: env.CHALLENGE_RESPONSE_JWT_ISSUER,
} as const satisfies jwt.VerifyOptions;

export type TPayload = Parameters<typeof jwt.sign>[0];

export interface ISignOptions<P extends TPayload = TPayload> {
    payload: P;
    secret?: jwt.Secret;
    options?: jwt.SignOptions;
}

export interface IVerifyOptions {
    token: string;
    secret?: jwt.Secret;
    options?: jwt.VerifyOptions;
}

export interface IChallengeJwtPayload {
    data: IChallengeJwtPayloadData;
}

export interface IChallengeJwtPayloadData {
    username: string;
    role: Role;
}

export interface IAuthJwtPayload {
    data: IAuthJwtPayloadData;
}

export interface IAuthJwtPayloadData {
    account: IAuthJwtPayloadAccount;
    token: IAuthJwtPayloadToken;
}

export interface IAuthJwtPayloadAccount {
    id: number;
    role: Role;
    username: string;
}

export interface IAuthJwtPayloadToken {
    id: number;
    version: number;
}

/**
 * 签发 JWT 字符串
 * @param payload JWT 载荷
 * @param secret 密钥
 * @param options 选项
 * @returns JWT 字符串
 */
export function sign<P extends TPayload = TPayload>({
    //
    payload,
    secret = DEFAULT_SECRET,
    options = DEFAULT_SIGN_OPTIONS,
}: ISignOptions<P>): string {
    // REF: https://www.npmjs.com/package/jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
    return jwt.sign(payload, secret, options);
}

/**
 * 校验 JWT 字符串是否有效
 * @param token JWT 字符串
 * @param secret 密钥
 * @param options 选项
 * @param throwError 是否抛出异常
 * @returns
 * - 若 `throwError` 为 `false` 则返回校验是否成功
 * - 若 `throwError` 为 `true` 则在校验成功后返回载荷 (校验不成功抛出异常)
 */
export function verify<P>(options: IVerifyOptions, throwError: true): P;
export function verify(options: IVerifyOptions, throwError?: false): boolean;
export function verify(
    {
        //
        token,
        secret = DEFAULT_SECRET,
        options = DEFAULT_VERIFY_OPTIONS,
    }: IVerifyOptions,
    throwError: boolean = false,
) {
    if (throwError) {
        // REF: https://www.npmjs.com/package/jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
        return jwt.verify(token, secret, options);
    } else {
        try {
            jwt.verify(token, secret, options);
            return true;
        } catch (err) {
            return false;
        }
    }
}

/**
 * 解析 JWT 载荷
 * @param token JWT 字符串
 * @returns JWT 载荷
 */
export function decode(token: string) {
    return jwt.decode(token);
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
        return decoded.data?.username === payload.data.username && decoded.data?.role === payload.data.role;
    } catch (err) {
        return false;
    }
}
