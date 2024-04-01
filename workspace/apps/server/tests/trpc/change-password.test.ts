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
import {
    //
    login,
    signup,
    changePassword,
} from "./../utils/account";

describe("/trpc/account/update", () => {
    test(`update: avatar`, async () => {
        const username = cuid.createId();
        const passphrase1 = cuid.createId();
        const passphrase2 = cuid.createId();
        const account1 = { username, passphrase: passphrase1 };
        const account2 = { username, passphrase: passphrase2 };
        await signup(account1, trpc);
        await login(account1, trpc);

        const response_change_password = await changePassword(
            {
                username,
                passphrase1,
                passphrase2,
            },
            trpc,
        );
        expect(response_change_password.code).toEqual(0);
        expect(trpc.account.info.query()).rejects.toThrowError(); // 更改密码后会自动注销登录状态

        const response_login1 = await login(account1, trpc);
        expect(response_login1.code).toEqual(20); // 旧密码登录失败

        const response_login2 = await login(account2, trpc);
        expect(response_login2.code).toEqual(0); // 新密码登录成功
    });
});
