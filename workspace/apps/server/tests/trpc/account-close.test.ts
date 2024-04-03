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
    describe,
    test,
    expect,
} from "@jest/globals";
import cuid from "@paralleldrive/cuid2";

import {
    //
    passphrase2key,
    challenge2response,
    String2ArrayBuffer,
    ArrayBuffer2HexString,
} from "@repo/utils/crypto";

import { TRPC } from ".";
import {
    //
    initAccount,
    login,
} from "./../utils/account";

type TRole = Parameters<typeof trpc.client.auth.challenge.query>[0]["role"];

const trpc = new TRPC();

describe("/trpc/account/close", () => {
    test(`close account`, async () => {
        const account = {
            username: cuid.createId(),
            passphrase: cuid.createId(),
            role: "user",
        };
        await initAccount(account, trpc);

        /* 注销账户 */
        const key = await passphrase2key(account.username, account.passphrase, process.env._TD_USER_KEY_SALT!);
        const response_challenge = await trpc.client.auth.challenge.query({
            username: account.username,
            role: account.role as TRole,
        });
        const challenge = response_challenge.data.challenge;
        const response = await challenge2response(String2ArrayBuffer(challenge), key);
        const response_hex = ArrayBuffer2HexString(response);

        const response_close = await trpc.client.account.close.mutate({
            challenge,
            response: response_hex,
        });
        expect(response_close.code).toEqual(0);

        /* 再次尝试登录账户 */
        const response_login = await login(account, trpc);
        expect(response_login.code).not.toEqual(0);
    });
});
