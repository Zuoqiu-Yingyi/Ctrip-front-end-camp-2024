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

import { createChallengeString } from "./../utils/jwt";
import { str2role } from "./../utils/role";

export const challengeProcedure = procedure // 获取认证用的挑战字符串
    .input(
        z.object({
            username: z // 用户账户名
                .string({ description: "User account name" })
                .min(2)
                .max(32)
                .regex(/^[0-9a-zA-Z\-\_]{2,32}$/),
            role: z // 账户角色
                .enum(
                    [
                        "administrator", // 管理员
                        "reviewer", // 审核员
                        "user", // 用户
                    ],
                    { description: "Account role" },
                ),
        }),
    )
    .query((options) => {
        const challenge = createChallengeString({
            username: options.input.username,
            role: str2role(options.input.role),
        });
        return {
            input: options.input,
            challenge,
        };
    });
