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

import trpc from ".";
import { AccessorRole } from "./../../src/utils/role";
import {
    //
    login,
    signup,
} from "./../utils/account";

type TRole = Parameters<typeof trpc.auth.challenge.query>[0]["role"];

interface IAccount {
    username: string;
    passphrase: string;
    role: TRole;
    _role: AccessorRole;
}

describe("/trpc/account/logout", () => {
    const accounts: IAccount[] = [
        {
            username: "admin",
            passphrase: "admin",
            role: "staff",
            _role: AccessorRole.Administrator,
        },
        {
            username: "reviewer",
            passphrase: "reviewer",
            role: "staff",
            _role: AccessorRole.Reviewer,
        },
        {
            username: cuid.createId(),
            passphrase: cuid.createId(),
            role: "user",
            _role: AccessorRole.User,
        },
        {
            username: cuid.createId(),
            passphrase: cuid.createId(),
            role: undefined,
            _role: AccessorRole.User,
        },
    ];
    accounts.forEach((account) => {
        test(`logout: ${account.role}`, async () => {
            /* 普通用户先注册 */
            if (["user", undefined].includes(account.role)) {
                await signup(account, trpc);
            }
            await login(account, trpc);

            const response_logout = await trpc.account.logout.query();
            expect(response_logout.code).toEqual(0);
            expect(trpc.account.logout.query()).rejects.toThrowError();
        });
    });
});
