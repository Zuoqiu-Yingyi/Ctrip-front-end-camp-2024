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
    ACCOUNT_PASSWORD,
    ACCOUNT_NAME,
} from "./../types/account";

/**
 * 用户名已存在错误
 */
export class UsernameExistsError extends Error {
    /**
     * @param username 用户名
     */
    constructor(username: string) {
        super(`Username ${username} already exists`);
    }
}

/**
 * 获取认证用的挑战字符串
 */
export const signupMutation = procedure
    .input(
        z.object({
            username: ACCOUNT_NAME,
            password: ACCOUNT_PASSWORD,
        }),
    )
    .mutation(async (options) => {
        try {
            // 判断用户名是否重复
            const user = await options.ctx.DB.user.findUnique({
                where: {
                    name: options.input.username,
                    deleted: false,
                },
            });
            if (user) {
                // 用户名已存在
                throw new UsernameExistsError(options.input.username);
            } else {
                // 创建用户
                const user = await options.ctx.DB.user.create({
                    data: {
                        name: options.input.username,
                        password: options.input.password,
                    },
                });
                return {
                    code: 0,
                    message: "",
                    data: {
                        user: {
                            id: user.id,
                            name: user.name,
                        },
                    },
                };
            }
        } catch (error) {
            switch (true) {
                case error instanceof UsernameExistsError:
                    return {
                        code: 10,
                        message: error.message,
                        data: null,
                    };

                default:
                    options.ctx.S.log.error(error);
                    return {
                        code: -1,
                        message: error,
                        data: null,
                    };
            }
        }
    });
