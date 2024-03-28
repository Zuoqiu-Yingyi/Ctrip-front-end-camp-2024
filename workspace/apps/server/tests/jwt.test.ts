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
    createChallengeString,
    verifyChallengeString,
    verifyChallengePayload,
    type IChallengeJwtPayload,
} from "./../src/utils/jwt";
import { Role } from "./../src/utils/role";

describe("JWT", () => {
    test(`create-verify`, async () => {
        const payload: IChallengeJwtPayload = {
            username: cuid.createId(),
            role: Role.Administrator,
        };
        const token = createChallengeString(payload);

        expect(verifyChallengeString(token)).toBeTruthy();
        expect(verifyChallengePayload(token, payload)).toBeTruthy();
    });
});
