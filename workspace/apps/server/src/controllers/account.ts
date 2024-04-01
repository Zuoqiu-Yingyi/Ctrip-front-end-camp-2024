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
import { AccessorRole } from "./../utils/role";
import {
    //
    accountPermissionMiddleware,
    privatePermissionMiddleware,
} from "./../middlewares/permission";
import { ACCOUNT_AVATAR } from "./../types/account";

import type { DB as TDatabaseClient } from "@/models/client";

export interface IInfo {
    account: IAccount; // 账户信息
    token: IToken; // 令牌信息
}

export interface IAccount {
    id: number; // 账户 ID
    name: string; // 账户名
    role: AccessorRole; // 用户角色
    avatar: string | null; // 用户头像
    createdAt: Date; // 账户创建时间
}

export interface IToken {
    id: number;
    version: number;
}

/**
 * 查询账户信息
 * @param id 账户 ID
 * @param role 账户角色
 * @param DB 数据库客户端
 * @returns 账户信息
 * - `null`: 未找到对应的账户账户
 */
export async function queryAccountInfo(
    //
    id: number,
    role: AccessorRole,
    DB: typeof TDatabaseClient.p,
): Promise<IInfo | null> {
    switch (role) {
        case AccessorRole.User:
        default: {
            const user = await DB.user.findUnique({
                where: {
                    id,
                    deleted: false,
                },
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                    createdAt: true,
                    token: {
                        select: {
                            id: true,
                            version: true,
                        },
                    },
                },
            });
            if (user) {
                return {
                    account: {
                        id: user.id,
                        name: user.name,
                        role,
                        avatar: user.avatar,
                        createdAt: user.createdAt,
                    },
                    token: {
                        id: user.token!.id,
                        version: user.token!.version,
                    },
                };
            }
        }
        case AccessorRole.Administrator:
        case AccessorRole.Reviewer: {
            const staff = await DB.staff.findUnique({
                where: {
                    id,
                    deleted: false,
                },
                select: {
                    id: true,
                    name: true,
                    createdAt: true,
                    token: {
                        select: {
                            id: true,
                            version: true,
                        },
                    },
                },
            });
            if (staff) {
                return {
                    account: {
                        id: staff.id,
                        name: staff.name,
                        role: role,
                        avatar: null,
                        createdAt: staff.createdAt,
                    },
                    token: {
                        id: staff.token!.id,
                        version: staff.token!.version,
                    },
                };
            }
        }
    }
    return null;
}

/**
 * 查询账户信息
 */
export const infoQuery = procedure //
    .use(accountPermissionMiddleware) // 验证用户权限
    .query(async (options) => {
        try {
            const info = await queryAccountInfo(
                //
                options.ctx.session.data.account.id,
                options.ctx.role,
                options.ctx.DB,
            );
            if (info) {
                return {
                    code: 0,
                    message: "",
                    data: info,
                };
            } else {
                return {
                    code: 1,
                    message: "Account not found",
                    data: null,
                };
            }
        } catch (error) {
            options.ctx.S.log.error(error);
            return {
                code: -1,
                message: String(error),
                data: null,
            };
        }
    });

/**
 * 更改v账户信息
 */
export const updateInfoMutation = procedure //
    .use(privatePermissionMiddleware) // 验证用户权限
    .input(
        z.object({
            avatar: ACCOUNT_AVATAR.optional(),
        }),
    )
    .mutation(async (options) => {
        try {
            const { session, role, DB } = options.ctx;
            const { id } = session.data.account;
            const user = await options.ctx.DB.user.update({
                where: {
                    id,
                    deleted: false,
                },
                data: {
                    avatar: options.input.avatar !== undefined ? options.input.avatar : null,
                },
            });
            return {
                code: 0,
                message: "",
                data: {
                    account: {
                        id: user.id,
                        name: user.name,
                        avatar: user.avatar,
                        createdAt: user.createdAt,
                        updatedAt: user.updatedAt,
                    },
                },
            };
        } catch (error) {
            options.ctx.S.log.error(error);
            return {
                code: -1,
                message: String(error),
                data: null,
            };
        }
    });
