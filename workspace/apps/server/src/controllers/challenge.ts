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

import { z } from "zod";
import { procedure } from ".";

import {
    //
    sign,
    type IChallengeJwtPayload,
} from "./../utils/jwt";
import { str2accountRole } from "./../utils/role";
import {
    //
    USER_NAME,
    USER_ROLE,
} from "./../types/user";

export const challengeQuery = procedure // 获取认证用的挑战字符串
    .input(
        z.object({
            username: USER_NAME,
            role: USER_ROLE,
        }),
    )
    .query((options) => {
        const challenge = sign<IChallengeJwtPayload>({
            payload: {
                data: {
                    username: options.input.username,
                    role: str2accountRole(options.input.role),
                },
            },
        });
        return {
            code: 0,
            message: "",
            data: {
                challenge,
            },
        };
    });
