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

import {
    //
    passphrase2key,
    challenge2response,
    String2ArrayBuffer,
    ArrayBuffer2HexString,
} from "@repo/utils/crypto";
import CONSTANTS from "@/constants";
import type { TRPC } from "./trpc";

export type TRole = "user" | "staff" | undefined;

export interface ISignupOptions {
    username: string;
    passphrase: string;
}

/**
 * 注册新用户
 */
export async function signup(
    {
        //
        username,
        passphrase,
    }: ISignupOptions,
    t: TRPC,
) {
    const key = await passphrase2key(username, passphrase, "salt");
    const response_signup = await t.account.signup.mutate({
        username,
        password: ArrayBuffer2HexString(key),
    });
    return response_signup;
}

export interface ILoginOptions {
    username: string;
    passphrase: string;
    role?: TRole;
    keep?: boolean;
}

/**
 * 用户登录
 */
export async function login(
    {
        //
        username,
        passphrase,
        role = "user",
        keep = false,
    }: ILoginOptions,
    t: TRPC,
) {
    const key = await passphrase2key(username, passphrase, CONSTANTS.USER_KEY_SALT);

    const response_challenge = await t.auth.challenge.query({
        username: username,
        role: role as TRole,
    });
    const challenge = response_challenge.data.challenge;
    const response = await challenge2response(String2ArrayBuffer(challenge), key);
    const response_hex = ArrayBuffer2HexString(response);

    const response_login = await t.account.login.mutate({
        challenge,
        response: response_hex,
        stay: keep,
    });

    return response_login;
}

/**
 * 用户登出
 */
export async function logout(t: TRPC) {
    const response_logout = await t.account.logout.query();
    return response_logout;
}

export interface IChangePasswordOptions {
    username: string;
    passphrase1: string;
    passphrase2: string;
    role?: TRole;
}

/**
 * 用户更改密码
 */
export async function changePassword(
    {
        //
        username,
        passphrase1,
        passphrase2,
        role = "user",
    }: IChangePasswordOptions,
    t: TRPC,
) {
    const key1 = await passphrase2key(username, passphrase1, CONSTANTS.USER_KEY_SALT);
    const key2 = await passphrase2key(username, passphrase2, CONSTANTS.USER_KEY_SALT);

    const response_challenge = await t.auth.challenge.query({
        username: username,
        role: role as TRole,
    });
    const challenge = response_challenge.data.challenge;
    const response = await challenge2response(String2ArrayBuffer(challenge), key1);
    const response_hex = ArrayBuffer2HexString(response);

    const response_change_password = await t.account.change_password.mutate({
        challenge,
        response: response_hex,
        password: ArrayBuffer2HexString(key2),
    });
    return response_change_password;
}
