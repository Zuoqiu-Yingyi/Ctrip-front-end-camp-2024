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
import ms from "ms";

import {
    //
    challenge2response,
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
    IChallengeJwtPayload,
    verify,
    type IAuthJwtPayload,
} from "./../utils/jwt";
import { Role } from "./../utils/role";
export interface IAccount {
    id: number; // 账户 ID
    name: string; // 账户名
    role: Role; // 账户权限
    password: string; // 账户密钥
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
            /* 校验挑战字符串是否已过期 */
            let payload: IChallengeJwtPayload;
            try {
                // 校验并解析 challenge
                payload = verify<IChallengeJwtPayload>({ token: options.input.challenge }, true);
            } catch (error) {
                // 校验 challenge 失败
                options.ctx.S.log.debug(error);
                return {
                    code: 1,
                    message: String(error),
                    data: null,
                };
            }

            /* 校验用户名称与应答 */
            try {
                const error = new Error("Wrong username or password");

                /* 校验用户名是否有效 */
                const account: IAccount = await (async () => {
                    switch (payload.data.role) {
                        case Role.Administrator:
                        case Role.Reviewer:
                        case Role.Staff: {
                            const staff = await options.ctx.DB.staff.findUniqueOrThrow({
                                where: {
                                    name: payload.data.username,
                                    deleted: false,
                                },
                            });
                            return {
                                id: staff.id,
                                name: staff.name,
                                role: staff.role,
                                password: staff.password,
                            };
                        }

                        case Role.User:
                        case Role.Visitor:
                        default: {
                            const user = await options.ctx.DB.user.findUniqueOrThrow({
                                where: {
                                    name: payload.data.username,
                                    deleted: false,
                                },
                            });
                            return {
                                id: user.id,
                                name: user.name,
                                role: Role.User,
                                password: user.password,
                            };
                        }
                    }
                })();
                if (!account) {
                    // 用户名存在
                    throw error;
                }

                /* 校验应答结果是否正确 */
                const response = challenge2response(
                    //
                    string2Buffer(options.input.challenge),
                    Buffer.from(account.password, "hex"),
                );
                if (response.toString("hex") === options.input.response) {
                    const payload: IAuthJwtPayload = {
                        data: {
                            account: {
                                id: account.id,
                                role: account.role,
                                username: account.name,
                            },
                        },
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
                            // path: "/", // 将在指定路径下发送该 Cookie
                            // secure: true, // 通过被 HTTPS 协议加密过的请求发送
                            sameSite: "lax", // 用户从其他站点导航到 Cookie 的源站点时也发送 Cookie
                            httpOnly: true, // 阻止通过 document.cookie 访问该 Cookie
                            expires: options.input.stay // Cookie 有效期
                                ? new Date(options.ctx.S.jwt.decode<any>(token).exp) // Cookie 有效期与 JWT 一致
                                : undefined, // 会话 Cookie (关闭会话时失效)
                        },
                    );
                    return {
                        code: 0,
                        message: "",
                        data: {
                            ...payload.data,
                        },
                    };
                } else {
                    throw error;
                }
            } catch (error) {
                // 用户名或密码错误
                // options.ctx.S.log.debug(error);
                return {
                    code: 2,
                    message: String(error),
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