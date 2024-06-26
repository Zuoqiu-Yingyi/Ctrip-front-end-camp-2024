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
import jwt from "jsonwebtoken";

import {
    //
    verifyChallengeResponse,
    string2Buffer,
} from "@repo/utils/node/crypto";

import { procedure } from ".";
import {
    //
    AUTH_CHALLENGE,
    AUTH_RESPONSE,
    AUTH_STAY,
} from "./../types/auth";
import {
    //
    verify,
    type IAuthJwtPayload,
    type IChallengeJwtPayload,
} from "./../utils/jwt";
import {
    //
    AccessorRole,
    AccountRole,
} from "./../utils/role";
import { tokens } from "./../utils/store";
import env from "./../configs/env";

export interface IAccount {
    id: number; // 账户 ID
    name: string; // 账户名
    role: AccessorRole; // 用户角色
    password: string; // 账户密钥
    createdAt: Date; // 账户创建时间
    profile?: {
        id: number;
        avatar: string | null; // 用户头像
    }; // 用户资料
    token: {
        id: number;
        version: number;
    }; // 令牌信息
}

/**
 * 用户名或密码错误
 */
export class UsernameOrPasswordError extends Error {
    constructor() {
        super("Wrong username or password");
    }
}

/**
 * 用户登录
 */
export const loginMutation = procedure
    .input(
        z.object({
            challenge: AUTH_CHALLENGE,
            response: AUTH_RESPONSE,
            stay: AUTH_STAY,
        }),
    )
    .mutation(async (options) => {
        try {
            /* 校验挑战字符串是否有效 */
            const payload = verify<IChallengeJwtPayload>({ token: options.input.challenge }, true);

            /* 校验用户名是否有效 */
            const account: IAccount | null = await (async () => {
                switch (payload.data.role) {
                    case AccountRole.Staff: {
                        const staff = await options.ctx.DB.staff.findUnique({
                            where: {
                                name: payload.data.username,
                                deleted: false,
                            },
                            select: {
                                id: true,
                                name: true,
                                role: true,
                                password: true,
                                createdAt: true,
                                token: {
                                    select: {
                                        id: true,
                                        version: true,
                                    },
                                },
                            },
                        });
                        if (!staff) {
                            return null;
                        }
                        return {
                            id: staff.id,
                            name: staff.name,
                            role: staff.role,
                            password: staff.password,
                            createdAt: staff.createdAt,
                            token: staff.token,
                        };
                    }

                    case AccountRole.User:
                    default: {
                        const user = await options.ctx.DB.user.findUnique({
                            where: {
                                name: payload.data.username,
                                deleted: false,
                            },
                            select: {
                                id: true,
                                name: true,
                                password: true,
                                role: true,
                                createdAt: true,
                                token: {
                                    select: {
                                        id: true,
                                        version: true,
                                    },
                                },
                                profile: {
                                    select: {
                                        id: true,
                                        avatar: true,
                                    },
                                },
                            },
                        });
                        if (!user) {
                            return null;
                        }
                        return {
                            id: user.id,
                            name: user.name,
                            role: user.role,
                            password: user.password,
                            createdAt: user.createdAt,
                            token: user.token,
                            profile: user.profile,
                        };
                    }
                }
            })();
            if (!account) {
                // 用户不存在
                throw new UsernameOrPasswordError();
            }

            /* 校验应答结果是否正确 */
            if (
                verifyChallengeResponse(
                    //
                    string2Buffer(options.input.challenge),
                    Buffer.from(options.input.response, "hex"),
                    Buffer.from(account.password, "hex"),
                )
            ) {
                // 密码正确

                /* 更新令牌版本 */
                account.token.version++;
                tokens.set(account.token.id, account.token.version);
                await options.ctx.DB.token.update({
                    where: {
                        id: account.token.id,
                        deleted: false,
                    },
                    data: {
                        version: account.token.version,
                    },
                });

                /* 签发新令牌 */
                const payload: IAuthJwtPayload = {
                    data: {
                        account: {
                            id: account.id,
                            role: account.role,
                            username: account.name,
                        },
                        profile: {
                            id: account.profile?.id,
                        },
                        token: {
                            id: account.token.id,
                            version: account.token.version,
                        },
                    },
                    jti: account.token.id,
                };
                // REF: https://www.npmjs.com/package/@fastify/jwt?activeTab=readme#example-using-cookie
                const token = options.ctx.S.jwt.sign(payload);
                options.ctx.res.setCookie(
                    //
                    options.ctx.S.jwt.cookie!.cookieName,
                    token,
                    {
                        // REF: https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Cookies
                        // domain: "your.domain", // 默认为同站 (不包括子域名), 设置后将包含子域名
                        // secure: true, // 通过被 HTTPS 协议加密过的请求发送
                        path: "/", // 将在指定路径下发送该 Cookie
                        domain: env.JWT_COOKIE_DOMAIN || undefined, // Cookie 有效域名
                        secure: env.JWT_COOKIE_SECURE, // 指定是否仅于 HTTPS 协议加密过的连接中请求发送
                        sameSite: env.JWT_COOKIE_SAMESITE, // 指定是否/何时通过跨站点请求发送
                        httpOnly: true, // 阻止通过 document.cookie 访问该 Cookie
                        expires: options.input.stay // Cookie 有效期
                            ? new Date(options.ctx.S.jwt.decode<any>(token).exp * 1_000) // Cookie 有效期与 JWT 一致
                            : undefined, // 会话 Cookie (关闭会话时失效)
                    },
                );
                return {
                    code: 0,
                    message: "",
                    data: {
                        account: {
                            id: account.id,
                            role: account.role,
                            name: account.name,
                            avatar: account.profile?.avatar ?? null,
                            createdAt: account.createdAt,
                        },
                    },
                };
            } else {
                // 密码错误
                throw new UsernameOrPasswordError();
            }
        } catch (error) {
            // options.ctx.S.log.debug(error);
            switch (true) {
                // JWT 未生效
                case error instanceof jwt.NotBeforeError:
                    return {
                        code: 11,
                        message: error.message,
                        data: null,
                    };
                // JWT 已过期
                case error instanceof jwt.TokenExpiredError:
                    return {
                        code: 12,
                        message: error.message,
                        data: null,
                    };
                // 其他 JWT 问题
                case error instanceof jwt.JsonWebTokenError:
                    return {
                        code: 10,
                        message: error.message,
                        data: null,
                    };

                // 用户名或密码错误
                case error instanceof UsernameOrPasswordError:
                    return {
                        code: 20,
                        message: error.message,
                        data: null,
                    };

                default:
                    options.ctx.S.log.error(error);
                    return {
                        code: -1,
                        message: String(error),
                        data: null,
                    };
            }
        }
    });
