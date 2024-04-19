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
import { privatePermissionMiddleware } from "./../middlewares/permission";
import {
    //
    DIARY_CREATE,
    DIARY_UPDATE,
} from "./../types/diary";
import { ID } from "./../types";

import type { Prisma } from "~/prisma/client";

/**
 * 草稿管理控制器
 */
const draftProcedure = procedure.use(privatePermissionMiddleware);

/**
 * 草稿查询内容
 */
const DRAFT_SELECT: Prisma.DraftSelect = {
    id: true,
    title: true,
    content: true,

    creation_time: true,
    modification_time: true,

    status: true,
    author_id: true,

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

    publish: {
        select: {
            uid: true,
        },
    },
};

/**
 * 创建草稿
 */
export const createMutation = draftProcedure //
    .input(DIARY_CREATE)
    .mutation(async (options) => {
        try {
            const author_id = options.ctx.session.data.account.id;
            const draft = await options.ctx.DB.draft.create({
                data: {
                    title: options.input.title,
                    content: options.input.content,
                    author: {
                        // REF: https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#connect-a-single-record
                        connect: {
                            id: author_id,
                            assets: {},
                        },
                    },
                    assets: {
                        // REF: https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#connect-multiple-records
                        create: options.input.assets.map((uid, index) => ({
                            index,
                            asset_uid: uid,
                        })),
                    },
                    coordinate:
                        (options.input.coordinate && {
                            create: {
                                ...options.input.coordinate,
                                uploader: {
                                    connect: {
                                        id: author_id,
                                    },
                                },
                            },
                        }) ||
                        undefined,
                },
                select: DRAFT_SELECT,
            });
            return {
                code: 0,
                message: "",
                data: {
                    draft,
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
 * 更新草稿
 */
export const updateMutation = draftProcedure //
    .input(DIARY_UPDATE)
    .mutation(async (options) => {
        try {
            const draft = await options.ctx.DB.draft.update({
                where: {
                    id: options.input.id,
                    deleted: false,
                },
                data: {
                    modification_time: new Date(),
                    title: options.input.title,
                    content: options.input.content,
                    assets:
                        (options.input.assets && {
                            // REF: https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#delete-all-related-records
                            deleteMany: {},
                            create: options.input.assets.map((uid, index) => ({
                                index,
                                asset_uid: uid,
                            })),
                        }) ||
                        undefined,
                    coordinate:
                        (options.input.coordinate && {
                            create: {
                                ...options.input.coordinate,
                                uploader: {
                                    connect: {
                                        id: options.ctx.session.data.account.id,
                                    },
                                },
                            },
                        }) ||
                        undefined,
                },
                select: DRAFT_SELECT,
            });
            return {
                code: 0,
                message: "",
                data: {
                    draft,
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
 * 当前用户草稿总数
 */
export const countQuery = draftProcedure //
    .query(async (options) => {
        try {
            const author_id = options.ctx.session.data.account.id;
            const count = await options.ctx.DB.draft.count({
                where: {
                    author_id,
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
 * 查询指定 ID 的草稿内容
 */
export const listQuery = draftProcedure //
    .input(
        z.object({
            ids: ID.array().optional(), // 发布 UID 列表, 未设置则查询全部发布内容
        }),
    )
    .query(async (options) => {
        try {
            const author_id = options.ctx.session.data.account.id;
            const drafts = await options.ctx.DB.draft.findMany({
                where: {
                    id:
                        (Array.isArray(options.input.ids) && {
                            in: options.input.ids,
                        }) ||
                        undefined,
                    author_id,
                    deleted: false,
                },
                select: DRAFT_SELECT,
            });
            return {
                code: 0,
                message: "",
                data: {
                    drafts,
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
 * 分页查询当前用户的草稿
 */
export const pagingQuery = draftProcedure //
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
            cursor: ID.optional(),
        }),
    )
    .query(async (options) => {
        try {
            const { skip, take, cursor } = options.input;
            const author_id = options.ctx.session.data.account.id;
            const drafts = await options.ctx.DB.draft.findMany({
                where: {
                    author_id,
                    deleted: false,
                },
                select: DRAFT_SELECT,
                orderBy: {
                    id: "desc",
                },
                // REF: https://www.prisma.io/docs/orm/prisma-client/queries/pagination
                skip,
                take,
                cursor:
                    (cursor && {
                        id: cursor,
                    }) ||
                    undefined,
            });
            return {
                code: 0,
                message: "",
                data: {
                    drafts,
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
 * 删除草稿
 */
export const deleteMutation = draftProcedure //
    .input(
        z.object({
            /**
             * 待删除的发布内容 UID 列表
             */
            ids: ID.array(),
        }),
    )
    .mutation(async (options) => {
        try {
            const author_id = options.ctx.session.data.account.id;
            const { ids } = options.input;
            const drafts = [];

            if (ids.length > 0) {
                /* 逻辑删除草稿与关联的审批项 */
                for (const id of ids) {
                    // 删除单个
                    const draft = await options.ctx.DB.draft.update({
                        where: {
                            id,
                            author_id,
                            deleted: false,
                        },
                        data: {
                            deleted: true,
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
                            // !若没有关联的 publish 记录则会抛出异常
                            // publish: {
                            //     // REF: https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#update-a-specific-related-record
                            //     update: {
                            //         deleted: true,
                            //     },
                            // },
                        },
                        select: DRAFT_SELECT,
                    });
                    drafts.push(draft);
                }

                /* 逻辑删除关联的发布内容 */
                await options.ctx.DB.publish.updateMany({
                    where: {
                        id: {
                            in: ids,
                        },
                        deleted: false,
                    },
                    data: {
                        deleted: true,
                    },
                });
            }

            return {
                code: 0,
                message: "",
                data: {
                    drafts,
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
