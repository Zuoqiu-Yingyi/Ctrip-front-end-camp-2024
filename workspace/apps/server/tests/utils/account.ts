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

import cuid from "@paralleldrive/cuid2";
import {
    //
    passphrase2key,
    challenge2response,
    String2ArrayBuffer,
    ArrayBuffer2HexString,
} from "@repo/utils/crypto";
import trpc from "./../trpc";

type TRole = Parameters<typeof trpc.client.auth.challenge.query>[0]["role"];

/**
 * 注册新用户
 */
export async function signup(
    {
        //
        username = cuid.createId(),
        passphrase = cuid.createId(),
    },
    t = trpc,
) {
    const key = await passphrase2key(username, passphrase, process.env._TD_USER_KEY_SALT!);
    const response_signup = await t.client.account.signup.mutate({
        username,
        password: ArrayBuffer2HexString(key),
    });
    return response_signup;
}

/**
 * 用户登录
 */
export async function login(
    {
        //
        username = cuid.createId(),
        passphrase = cuid.createId(),
        role = "user",
    },
    t = trpc,
) {
    const key = await passphrase2key(username, passphrase, process.env._TD_USER_KEY_SALT!);

    const response_challenge = await t.client.auth.challenge.query({
        username: username,
        role: role as TRole,
    });
    const challenge = response_challenge.data.challenge;
    const response = await challenge2response(String2ArrayBuffer(challenge), key);
    const response_hex = ArrayBuffer2HexString(response);

    const response_login = await t.client.account.login.mutate({
        challenge,
        response: response_hex,
        stay: false,
    });
    return response_login;
}

/**
 * 更改密码
 */
export async function changePassword(
    {
        //
        username = cuid.createId(),
        passphrase1 = cuid.createId(),
        passphrase2 = cuid.createId(),
        role = "user",
    },
    t = trpc,
) {
    const key1 = await passphrase2key(username, passphrase1, process.env._TD_USER_KEY_SALT!);
    const key2 = await passphrase2key(username, passphrase2, process.env._TD_USER_KEY_SALT!);

    const response_challenge = await t.client.auth.challenge.query({
        username: username,
        role: role as TRole,
    });
    const challenge = response_challenge.data.challenge;
    const response = await challenge2response(String2ArrayBuffer(challenge), key1);
    const response_hex = ArrayBuffer2HexString(response);

    const response_change_password = await t.client.account.change_password.mutate({
        challenge,
        response: response_hex,
        password: ArrayBuffer2HexString(key2),
    });
    return response_change_password;
}

export async function initAccount(
    account = {
        //
        username: cuid.createId(),
        passphrase: cuid.createId(),
        role: "user",
    },
    t = trpc,
) {
    await signup(account, t);
    await login(account, t);
}
