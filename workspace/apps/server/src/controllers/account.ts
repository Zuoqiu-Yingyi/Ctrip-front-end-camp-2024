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
    AccessorRole,
    AccountRole,
} from "./../utils/role";
import { tokens } from "./../utils/store";
import {
    //
    verify,
    type IChallengeJwtPayload,
} from "./../utils/jwt";
import {
    //
    accountPermissionMiddleware,
    privatePermissionMiddleware,
} from "./../middlewares/permission";
import { ACCOUNT_AVATAR, ACCOUNT_PASSWORD } from "./../types/account";
import {
    //
    AUTH_CHALLENGE,
    AUTH_RESPONSE,
} from "./../types/auth";

import type { DB as TDatabaseClient } from "@/models/client";

export interface IInfo {
    account: IAccount; // 账户信息
    token: IToken; // 令牌信息
    profile?: IProfile; // 用户信息
}

export interface IAccount {
    id: number; // 账户 ID
    name: string; // 账户名
    role: AccessorRole; // 用户角色
    createdAt: Date; // 账户创建时间
}

export interface IToken {
    id: number;
    version: number;
}

export interface IProfile {
    id: number; // 用户 ID
    avatar: string | null; // 用户头像
}

/**
 * 账户不存在错误
 */
export class AccountNotFoundError extends Error {
    constructor() {
        super(`Account not found`);
    }
}

/**
 * 账户信息不存在错误
 */
export class ProfileNotFoundError extends Error {
    constructor() {
        super(`Account profile not found`);
    }
}

/**
 * 资源文件不存在错误
 */
export class AssetFileNotFoundError extends Error {
    constructor(uid: string) {
        super(`Asset file [${uid}] not found`);
    }
}

/**
 * 原密码错误
 */
export class OriginalPasswordIncorrectError extends Error {
    constructor() {
        super("The original password is incorrect");
    }
}

/**
 * 用户名错误
 */
export class UsernameIncorrectError extends Error {
    constructor() {
        super("The username is incorrect");
    }
}

/**
 * 密码错误
 */
export class PasswordIncorrectError extends Error {
    constructor() {
        super("The password is incorrect");
    }
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
            if (user) {
                return {
                    account: {
                        id: user.id,
                        name: user.name,
                        role,
                        createdAt: user.createdAt,
                    },
                    token: {
                        id: user.token!.id,
                        version: user.token!.version,
                    },
                    profile:
                        (user.profile && {
                            id: user.profile.id,
                            avatar: user.profile.avatar,
                        }) ||
                        undefined,
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
                throw new AccountNotFoundError();
            }
        } catch (error) {
            // options.ctx.S.log.debug(error);
            switch (true) {
                // 账户未找到错误
                case error instanceof AccountNotFoundError:
                    return {
                        code: 10,
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

/**
 * 更改账户信息
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
            if (session.data.profile) {
                /* 获取原头像 */
                const profile_ = await DB.profile.findUnique({
                    where: {
                        id: session.data.profile.id,
                        deleted: false,
                    },
                    select: {
                        avatar: true,
                    },
                });
                if (!profile_) {
                    throw new ProfileNotFoundError();
                }

                /* 删除原头像 */
                if (!!profile_.avatar && options.input.avatar !== profile_.avatar) {
                    await DB.asset.update({
                        where: {
                            uid: profile_.avatar,
                            deleted: false,
                        },
                        data: {
                            deleted: true,
                        },
                    });
                }

                /* 校验头像 uid 对应的文件有效性 */
                if (options.input.avatar) {
                    const asset = await DB.asset.findUnique({
                        where: {
                            uid: options.input.avatar,
                            uploader_id: session.data.account.id,
                            deleted: false,
                        },
                        select: {
                            id: true,
                            uid: true,
                            permission: true,
                        },
                    });
                    if (asset) {
                        /* 新头像访问权限设置为公开 */
                        if (asset.permission < 0b1111) {
                            await DB.asset.update({
                                where: {
                                    id: asset.id,
                                    deleted: false,
                                },
                                data: {
                                    permission: 0b1111,
                                },
                            });
                        }
                    } else {
                        throw new AssetFileNotFoundError(options.input.avatar);
                    }
                }

                /* 更新用户头像信息 */
                const profile = await DB.profile.update({
                    where: {
                        id: session.data.profile.id,
                        deleted: false,
                    },
                    data: {
                        avatar:
                            options.input.avatar !== undefined //
                                ? options.input.avatar
                                : undefined,
                    },
                });

                return {
                    code: 0,
                    message: "",
                    data: {
                        profile: {
                            id: profile.id,
                            avatar: profile.avatar,
                            updatedAt: profile.updatedAt,
                        },
                    },
                };
            } else {
                throw new AccountNotFoundError();
            }
        } catch (error) {
            switch (true) {
                // 账户未找到错误
                case error instanceof AccountNotFoundError:
                    return {
                        code: 10,
                        message: error.message,
                        data: null,
                    };

                // 账户信息未找到错误
                case error instanceof ProfileNotFoundError:
                    return {
                        code: 20,
                        message: error.message,
                        data: null,
                    };

                // 资源文件未找到错误
                case error instanceof AssetFileNotFoundError:
                    return {
                        code: 30,
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

/**
 * 更改账户密码
 */
export const changePasswordMutation = procedure //
    .use(accountPermissionMiddleware) // 验证用户权限
    .input(
        z.object({
            challenge: AUTH_CHALLENGE,
            response: AUTH_RESPONSE,
            password: ACCOUNT_PASSWORD,
        }),
    )
    .mutation(async (options) => {
        try {
            /* 校验挑战字符串是否有效 */
            const payload = verify<IChallengeJwtPayload>({ token: options.input.challenge }, true);

            /* 校验用户名是否一致 */
            if (payload.data.username !== options.ctx.session.data.account.username) {
                throw new UsernameIncorrectError();
            }

            /* 获取原密码 */
            const account: {
                id: number;
                role: AccessorRole;
                password: string;
                token: {
                    id: number;
                    version: number;
                };
            } = await (async () => {
                switch (payload.data.role) {
                    /* 用户 */
                    case AccountRole.User:
                    default: {
                        const user = await options.ctx.DB.user.findUniqueOrThrow({
                            where: {
                                name: payload.data.username,
                                deleted: false,
                            },
                            select: {
                                id: true,
                                role: true,
                                password: true,
                                token: {
                                    select: {
                                        id: true,
                                        version: true,
                                    },
                                },
                            },
                        });
                        return user;
                    }

                    /* 员工 */
                    case AccountRole.Staff: {
                        const staff = await options.ctx.DB.staff.findUniqueOrThrow({
                            where: {
                                name: payload.data.username,
                                deleted: false,
                            },
                            select: {
                                id: true,
                                role: true,
                                password: true,
                                token: {
                                    select: {
                                        id: true,
                                        version: true,
                                    },
                                },
                            },
                        });
                        return staff;
                    }
                }
            })();

            /* 校验原密码是否正确 (通过挑战/应答) */
            if (
                verifyChallengeResponse(
                    //
                    string2Buffer(options.input.challenge),
                    Buffer.from(options.input.response, "hex"),
                    Buffer.from(account.password, "hex"),
                )
            ) {
                /* 更新密码 */
                switch (account.role) {
                    case AccessorRole.User:
                        await options.ctx.DB.user.update({
                            where: {
                                id: account.id,
                                deleted: false,
                            },
                            data: {
                                password: options.input.password,
                            },
                        });
                        break;
                    case AccessorRole.Administrator:
                    case AccessorRole.Reviewer:
                        await options.ctx.DB.staff.update({
                            where: {
                                id: account.id,
                                deleted: false,
                            },
                            data: {
                                password: options.input.password,
                            },
                        });
                        break;
                }

                /* 吊销令牌 */
                account.token.version++;
                tokens.set(account.token.id, account.token.version);
                await options.ctx.DB.token.update({
                    where: {
                        id: account.token.id,
                    },
                    data: {
                        version: account.token.version,
                    },
                });

                /* 清除 Cookie */
                options.ctx.res.clearCookie(options.ctx.S.jwt.cookie!.cookieName);
                return {
                    code: 0,
                    message: "",
                    data: null,
                };
            } else {
                // 原密码错误
                throw new OriginalPasswordIncorrectError();
            }
        } catch (error) {
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

                // 用户名错误
                case error instanceof UsernameIncorrectError:
                    return {
                        code: 20,
                        message: error.message,
                        data: null,
                    };

                // 原密码错误
                case error instanceof OriginalPasswordIncorrectError:
                    return {
                        code: 30,
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

/**
 * 关闭账户
 */
export const closeMutation = procedure //
    .use(privatePermissionMiddleware) // 验证用户权限
    .input(
        z.object({
            challenge: AUTH_CHALLENGE,
            response: AUTH_RESPONSE,
        }),
    )
    .mutation(async (options) => {
        try {
            const { challenge, response } = options.input;
            /* 校验挑战字符串是否有效 */
            const payload = verify<IChallengeJwtPayload>({ token: challenge }, true);

            /* 校验用户名是否一致 */
            if (payload.data.username !== options.ctx.session.data.account.username) {
                throw new UsernameIncorrectError();
            }

            /* 获取密码 */
            const user = await options.ctx.DB.user.findUniqueOrThrow({
                where: {
                    name: payload.data.username,
                    deleted: false,
                },
                select: {
                    id: true,
                    password: true,
                    token: {
                        select: {
                            id: true,
                            version: true,
                        },
                    },
                },
            });

            /* 校验密码是否正确 (通过挑战/应答) */
            if (
                verifyChallengeResponse(
                    //
                    string2Buffer(challenge),
                    Buffer.from(response, "hex"),
                    Buffer.from(user.password, "hex"),
                )
            ) {
                /* 吊销令牌 */
                user.token.version++;
                tokens.set(user.token.id, user.token.version);

                /* 更新用户信息 */
                await options.ctx.DB.user.update({
                    where: {
                        id: user.id,
                        deleted: false,
                    },
                    data: {
                        deleted: true,
                        password: "",
                        name: `[${user.id}]`,
                        token: {
                            update: {
                                version: user.token.version,
                                deleted: true,
                            },
                        },
                        profile: {
                            update: {
                                deleted: true,
                            },
                        },
                        assets: {
                            updateMany: {
                                where: {
                                    deleted: false,
                                },
                                data: {
                                    deleted: true,
                                },
                            },
                        },
                        coordinates: {
                            updateMany: {
                                where: {
                                    deleted: false,
                                },
                                data: {
                                    deleted: true,
                                },
                            },
                        },
                        drafts: {
                            updateMany: {
                                where: {
                                    deleted: false,
                                },
                                data: {
                                    deleted: true,
                                },
                            },
                        },
                        reviews: {
                            updateMany: {
                                where: {
                                    deleted: false,
                                },
                                data: {
                                    deleted: true,
                                },
                            },
                        },
                        publishs: {
                            updateMany: {
                                where: {
                                    deleted: false,
                                },
                                data: {
                                    deleted: true,
                                },
                            },
                        },
                    },
                });

                /* 清除 Cookie */
                options.ctx.res.clearCookie(options.ctx.S.jwt.cookie!.cookieName);
                return {
                    code: 0,
                    message: "",
                    data: null,
                };
            } else {
                // 密码错误
                throw new PasswordIncorrectError();
            }
        } catch (error) {
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

                // 用户名错误
                case error instanceof UsernameIncorrectError:
                    return {
                        code: 20,
                        message: error.message,
                        data: null,
                    };

                // 密码错误
                case error instanceof PasswordIncorrectError:
                    return {
                        code: 30,
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
