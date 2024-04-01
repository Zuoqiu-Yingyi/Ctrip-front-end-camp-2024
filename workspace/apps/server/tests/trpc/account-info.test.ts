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
} from "./../utils/account";

describe("/trpc/account/update", () => {
    test(`update: avatar`, async () => {
        const account = {
            username: cuid.createId(),
            passphrase: cuid.createId(),
        };
        await signup(account, trpc);
        await login(account, trpc);

        const avatars = [cuid.createId(), null];
        for (const avatar of avatars) {
            const response_update_info = await trpc.account.update_info.mutate({
                avatar,
            });
            expect(response_update_info.code).toEqual(0);
            expect(response_update_info.data?.profile.avatar).toEqual(avatar);

            const response_info = await trpc.account.info.query();
            expect(response_info.code).toEqual(0);
            expect(response_info.data?.profile?.avatar).toEqual(avatar);
        }
    });
});
