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

import trpc from ".";
import { verifyChallengePayload, verifyChallengeString } from "./../../src/utils/jwt";
import { str2role } from "./../../src/utils/role";

type TRole = Parameters<typeof trpc.auth.challenge.query>[0]["role"];

describe("/trpc/auth", () => {
    const roles: TRole[] = [
        //
        "administrator",
        "reviewer",
        "user",
    ];

    roles.forEach((role) => {
        test(`challenge: ${role}`, async () => {
            const payload = {
                username: `username-${role}`,
                role,
            } satisfies Parameters<typeof trpc.auth.challenge.query>[0];
            const response = await trpc.auth.challenge.query(payload);

            expect(response.input).toEqual(payload);
            // expect(verifyChallengeString(response.challenge)).toBeTruthy();
            expect(
                verifyChallengePayload(response.challenge, {
                    username: payload.username,
                    role: str2role(payload.role),
                }),
            ).toBeTruthy();
        });
    });
});
