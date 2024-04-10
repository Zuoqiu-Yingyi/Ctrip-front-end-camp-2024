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
    publicPermissionMiddleware,
    deletePermissionMiddleware,
} from "./../middlewares/permission";
import { CUID } from "./../types";
import { AccessorRole } from "./../utils/role";

import type { Prisma } from "~/prisma/client";

/**
 * 未找到草稿
 */
export class PublishNotFoundError extends Error {
    constructor(uid: string) {
        super(`Publish [${uid}] not found`);
    }
}

/**
 * 发布内容
 */
const PUBLISH_SELECT: Prisma.PublishSelect = {
    uid: true,
    title: true,
    content: true,
    publication_time: true,
    modification_time: true,

    draft_id: true,

    publisher: {
        select: {
            name: true,
            profile: {
                select: {
                    avatar: true,
                },
            },
        },
    },
    coordinate: {
        select: {
            latitude: true,
            longitude: true,
            accuracy: true,
            altitude: true,
            altitude_accuracy: true,
            heading: true,
            speed: true,
        },
    },
    assets: {
        select: {
            index: true,
            asset_uid: true,
        },
        orderBy: {
            index: "asc",
        },
    },
};

/**
 * 获取发布内容总数
 */
export const countQuery = procedure //
    .use(publicPermissionMiddleware)
    .query(async (options) => {
        try {
            const count = await options.ctx.DB.publish.count({
                where: {
                    deleted: false,
                },
            });
            return {
                code: 0,
                message: "",
                data: {
                    count,
                },
            };
        } catch (error) {
            // options.ctx.S.log.debug(error);
            switch (true) {
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
 * 查询指定 ID 的发布内容
 */
export const listQuery = procedure //
    .use(publicPermissionMiddleware)
    .input(
        z.object({
            uids: CUID.array().optional(), // 发布 UID 列表, 未设置则查询全部发布内容
        }),
    )
    .query(async (options) => {
        try {
            const publishs = await options.ctx.DB.publish.findMany({
                where: {
                    uid:
                        (Array.isArray(options.input.uids) && {
                            in: options.input.uids,
                        }) ||
                        undefined,
                    deleted: false,
                },
                select: PUBLISH_SELECT,
                orderBy: {
                    publication_time: "desc",
                },
            });
            return {
                code: 0,
                message: "",
                data: {
                    publishs,
                },
            };
        } catch (error) {
            // options.ctx.S.log.debug(error);
            switch (true) {
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
 * 分页查询发布内容
 */
export const pagingQuery = procedure //
    .use(publicPermissionMiddleware)
    .input(
        z.object({
            /**
             * 偏移量与查询数
             * @see {@link https://www.prisma.io/docs/orm/prisma-client/queries/pagination#offset-pagination Offset pagination}
             */
            skip: z.number().default(0),
            take: z.number().default(8),
            /**
             * 基于游标的分页
             * @see {@link https://www.prisma.io/docs/orm/prisma-client/queries/pagination#cursor-based-pagination Cursor-based pagination}
             */
            cursor: CUID.optional(),
        }),
    )
    .query(async (options) => {
        try {
            const { skip, take, cursor } = options.input;
            const publishs = await options.ctx.DB.publish.findMany({
                where: {
                    deleted: false,
                },
                select: PUBLISH_SELECT,
                orderBy: {
                    id: "desc",
                },
                // REF: https://www.prisma.io/docs/orm/prisma-client/queries/pagination
                skip,
                take,
                cursor:
                    (cursor && {
                        uid: cursor,
                    }) ||
                    undefined,
            });
            return {
                code: 0,
                message: "",
                data: {
                    publishs,
                },
            };
        } catch (error) {
            // options.ctx.S.log.debug(error);
            switch (true) {
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
 * 删除发布内容
 */
export const deleteMutation = procedure //
    .use(deletePermissionMiddleware)
    .input(
        z.object({
            /**
             * 待删除的发布内容 UID 列表
             */
            uids: CUID.array(),
        }),
    )
    .mutation(async (options) => {
        try {
            const publisher_id =
                options.ctx.session.data.account.role === AccessorRole.User //
                    ? options.ctx.session.data.account.id
                    : undefined;
            const { uids } = options.input;
            const publishs = [];

            if (uids.length > 0) {
                for (const uid of uids) {
                    const publish = await options.ctx.DB.publish.update({
                        where: {
                            uid,
                            publisher_id,
                            deleted: false,
                        },
                        data: {
                            deleted: true,
                            // draft_id: null,
                            // REF: https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#disconnect-a-related-record
                            draft: {
                                disconnect: true,
                            },
                        },
                        select: PUBLISH_SELECT,
                    });
                    publishs.push(publish);
                }
            }
            return {
                code: 0,
                message: "",
                data: {
                    publishs,
                },
            };
        } catch (error) {
            // options.ctx.S.log.debug(error);
            switch (true) {
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
