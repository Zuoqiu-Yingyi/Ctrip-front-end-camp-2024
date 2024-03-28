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
import crypto from "node:crypto";
import trpc from ".";

type TPayload = Parameters<typeof trpc.account.signup.mutate>[0];

describe("/trpc/account/signup", () => {
    const payload: TPayload = {
        username: cuid.createId(),
        password: crypto.randomBytes(32).toString("hex"),
    };
    test(`signup: ${payload.username}`, async () => {
        const response1 = await trpc.account.signup.mutate(payload);
        const response2 = await trpc.account.signup.mutate(payload);

        /* 成功注册 */
        expect(response1.code).toEqual(0);
        expect(response1.data!.user.name).toEqual(payload.username);

        /* 用户名重复 */
        expect(response2.code).toEqual(-1);
        expect(response2.data).toBeNull();
    });
});
