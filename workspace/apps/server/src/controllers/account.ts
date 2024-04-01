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

import { procedure } from ".";
import { tokens } from "../utils/store";
import { AccessorRole } from "./../utils/role";
import { accountPermissionMiddleware } from "./../middlewares/permission";

export interface IInfo {
    account: IAccount; // 账户信息
    token: IToken; // 令牌信息
}

export interface IAccount {
    id: number; // 账户 ID
    name: string; // 账户名
    role: AccessorRole; // 用户角色
    avatar: string | null; // 用户头像
}

export interface IToken {
    id: number;
    version: number;
}

/**
 * 查询账户信息
 */
export const infoQuery = procedure //
    .use(accountPermissionMiddleware) // 验证用户权限
    .query(async (options) => {
        try {
            const info: IInfo = await (async () => {
                switch (options.ctx.role) {
                    case AccessorRole.User:
                    default: {
                        const user = await options.ctx.DB.user.findUniqueOrThrow({
                            where: {
                                id: options.ctx.session.data.account.id,
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
                        return {
                            account: {
                                id: user.id,
                                name: user.name,
                                role: options.ctx.session.data.account.role,
                                avatar: user.avatar,
                                createdAt: user.createdAt,
                            },
                            token: {
                                id: user.token!.id,
                                version: user.token!.version,
                            },
                        };
                    }
                    case AccessorRole.Administrator:
                    case AccessorRole.Reviewer: {
                        const user = await options.ctx.DB.staff.findUniqueOrThrow({
                            where: {
                                id: options.ctx.session.data.account.id,
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
                        return {
                            account: {
                                id: user.id,
                                name: user.name,
                                role: options.ctx.session.data.account.role,
                                avatar: null,
                                createdAt: user.createdAt,
                            },
                            token: {
                                id: user.token!.id,
                                version: user.token!.version,
                            },
                        };
                    }
                }
            })();
            return {
                code: 0,
                message: "",
                data: info,
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
