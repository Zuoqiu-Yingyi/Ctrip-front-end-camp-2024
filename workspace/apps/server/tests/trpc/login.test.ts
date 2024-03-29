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

import trpc from ".";
import {
    //
    Role,
    str2role,
} from "./../../src/utils/role";

type TRole = Parameters<typeof trpc.auth.challenge.query>[0]["role"];

interface IUserAccount {
    username: string;
    passphrase: string;
    role: TRole;
    _role: Role;
}

describe("/trpc/account/login", () => {
    const accounts: IUserAccount[] = [
        {
            username: "admin",
            passphrase: "admin",
            role: "administrator",
            _role: Role.Administrator,
        },
        {
            username: "reviewer",
            passphrase: "reviewer",
            role: "reviewer",
            _role: Role.Reviewer,
        },
        {
            username: "reviewer",
            passphrase: "reviewer",
            role: "staff",
            _role: Role.Reviewer,
        },
        {
            username: cuid.createId(),
            passphrase: cuid.createId(),
            role: "user",
            _role: Role.User,
        },
        {
            username: cuid.createId(),
            passphrase: cuid.createId(),
            role: "visitor",
            _role: Role.User,
        },
        {
            username: cuid.createId(),
            passphrase: cuid.createId(),
            role: undefined,
            _role: Role.User,
        },
    ];
    accounts.forEach((account) => {
        test(`login: ${account.role}`, async () => {
            const key = await passphrase2key(account.username, account.passphrase, process.env._TD_USER_KEY_SALT!);

            const response_challenge = await trpc.auth.challenge.query({
                username: account.username,
                role: account.role,
            });
            const challenge = response_challenge.data.challenge;
            const response = await challenge2response(String2ArrayBuffer(challenge), key);
            const response_hex = ArrayBuffer2HexString(response);

            /* 普通用户先注册 */
            if (["user", "visitor", undefined].includes(account.role)) {
                await trpc.account.signup.mutate({
                    username: account.username,
                    password: ArrayBuffer2HexString(key),
                });
            }

            const response_login = await trpc.account.login.mutate({
                challenge,
                response: response_hex,
                stay: true,
            });

            expect(response_login.code).toEqual(0);
            expect(response_login.data?.account.username).toEqual(account.username);
            expect(response_login.data?.account.role).toEqual(account._role);
        });
    });
});
