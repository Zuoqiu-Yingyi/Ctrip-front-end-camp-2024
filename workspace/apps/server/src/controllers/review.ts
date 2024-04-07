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
import cuid2 from "@paralleldrive/cuid2";

import { procedure } from ".";
import {
    //
    privatePermissionMiddleware,
    approvePermissionMiddleware,
} from "./../middlewares/permission";
import { ID } from "./../types";
import { ReviewStatus } from "./../types/review";

import type { Prisma } from "~/prisma/client";

/**
 * 未找到草稿
 */
export class DraftNotFoundError extends Error {
    constructor(id: number) {
        super(`Draft [${id}] not found`);
    }
}

/**
 * 草稿查询内容
 */
const DRAFT_SELECT: Prisma.DraftSelect = {
    id: true,
    title: true,
    content: true,
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
};

/**
 * 审批项查询内容
 */
const REVIEW_SELECT: Prisma.ReviewSelect = {
    id: true,
    title: true,
    content: true,
    submission_time: true,
    modification_time: true,
    status: true,
    comment: true,
    approval_time: true,

    submitter_id: true,
    draft_id: true,

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
 * 用户提交审批项
 */
export const submitMutation = procedure //
    .use(privatePermissionMiddleware)
    .input(
        z.object({
            //
            draft_id: ID, // 草稿 ID
        }),
    )
    .mutation(async (options) => {
        try {
            /* 查询提交的草稿 */
            const author_id = options.ctx.session.data.account.id;
            const draft = await options.ctx.DB.draft.findUnique({
                where: {
                    id: options.input.draft_id,
                    author_id,
                    deleted: false,
                },
                select: {
                    id: true,
                    title: true,
                    content: true,
                    author_id: true,
                    coordinate_id: true,
                    assets: {
                        select: {
                            index: true,
                            asset_uid: true,
                        },
                        orderBy: {
                            index: "asc",
                        },
                    },
                },
            });
            if (!draft) {
                // 提交的草稿不存在
                throw new DraftNotFoundError(options.input.draft_id);
            }

            /* 查询该草稿是否有待审批项 */
            const reviews = await options.ctx.DB.review.findMany({
                where: {
                    status: ReviewStatus.Pending,
                    draft_id: draft.id,
                    submitter_id: draft.author_id,
                    deleted: false,
                },
                select: {
                    id: true,
                },
                orderBy: {
                    modification_time: "desc",
                },
            });

            /* 更新/创建审批项 */
            const review = await (async () => {
                if (reviews.length > 0) {
                    // 有待审批项, 覆盖最新的待审批项并取消其他待审批项
                    const review_latest = reviews.shift()!;
                    await options.ctx.DB.review.updateMany({
                        where: {
                            id: {
                                in: reviews.map((review) => review.id),
                            },
                            deleted: false,
                        },
                        data: {
                            status: ReviewStatus.Canceled,
                        },
                    });
                    const review = await options.ctx.DB.review.update({
                        where: {
                            id: review_latest.id,
                            deleted: false,
                        },
                        data: {
                            title: draft.title,
                            content: draft.content,
                            modification_time: new Date(),
                            status: ReviewStatus.Pending,

                            submitter: {
                                connect: {
                                    id: draft.author_id,
                                },
                            },
                            draft: {
                                connect: {
                                    id: draft.id,
                                },
                            },
                            coordinate:
                                (draft.coordinate_id && {
                                    connect: {
                                        id: draft.coordinate_id,
                                    },
                                }) ||
                                undefined,
                            assets:
                                (draft.assets && {
                                    // REF: https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#delete-all-related-records
                                    deleteMany: {},
                                    create: draft.assets.map(({ index, asset_uid }) => ({
                                        index,
                                        asset_uid,
                                    })),
                                }) ||
                                undefined,
                        },
                        select: REVIEW_SELECT,
                    });
                    return review;
                } else {
                    // 无待审批项, 创建新的审批项
                    const review = await options.ctx.DB.review.create({
                        data: {
                            title: draft.title,
                            content: draft.content,

                            submitter: {
                                connect: {
                                    id: draft.author_id,
                                },
                            },
                            draft: {
                                connect: {
                                    id: draft.id,
                                },
                            },
                            coordinate:
                                (draft.coordinate_id && {
                                    connect: {
                                        id: draft.coordinate_id,
                                    },
                                }) ||
                                undefined,
                            assets:
                                (draft.assets && {
                                    // REF: https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#connect-multiple-records
                                    create: draft.assets.map(({ index, asset_uid }) => ({
                                        index,
                                        asset_uid,
                                    })),
                                }) ||
                                undefined,
                        },
                        select: REVIEW_SELECT,
                    });
                    return review;
                }
            })();

            /* 更新关联的资源文件访问权限 */
            if (review.assets.length > 0) {
                await options.ctx.DB.asset.updateMany({
                    where: {
                        uid: {
                            in: review.assets.map((asset) => asset.asset_uid),
                        },
                        permission: {
                            lte: 0b0001, // 仅文件上传者可访问
                        },
                        deleted: false,
                    },
                    data: {
                        permission: 0b0111, // 管理员-审核者-上传者 可访问
                    },
                });
            }

            return {
                code: 0,
                message: "",
                data: {
                    review,
                },
            };
        } catch (error) {
            // options.ctx.S.log.debug(error);
            switch (true) {
                // 未找到草稿
                case error instanceof DraftNotFoundError:
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
 * 用户取消审批
 */
export const cancelMutation = procedure //
    .use(privatePermissionMiddleware)
    .input(
        z.object({
            //
            draft_id: ID, // 草稿 ID
        }),
    )
    .mutation(async (options) => {
        try {
            const submitter_id = options.ctx.session.data.account.id;
            const { draft_id } = options.input;
            const payload = await options.ctx.DB.review.updateMany({
                where: {
                    submitter_id,
                    draft_id,
                    status: ReviewStatus.Pending,
                    deleted: false,
                },
                data: {
                    status: ReviewStatus.Canceled,
                },
            });
            return {
                code: 0,
                message: "",
                data: {
                    count: payload.count,
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
 * 用户查询 (关联某份草稿的) 已提交的审批项
 */
export const submittedQuery = procedure //
    .use(privatePermissionMiddleware)
    .input(
        z.object({
            //
            draft_id: ID, // 草稿 ID
        }),
    )
    .query(async (options) => {
        try {
            /* 查询由该草稿创建的审批项列表 */
            const submitter_id = options.ctx.session.data.account.id;
            const reviews = await options.ctx.DB.review.findMany({
                where: {
                    draft_id: options.input.draft_id,
                    submitter_id,
                    deleted: false,
                },
                select: REVIEW_SELECT,
                orderBy: {
                    modification_time: "desc",
                },
            });
            return {
                code: 0,
                message: "",
                data: {
                    reviews,
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
 * 获取审批项总数
 */
export const countQuery = procedure //
    .use(approvePermissionMiddleware)
    .input(
        z.object({
            status: z.nativeEnum(ReviewStatus).optional(),
        }),
    )
    .query(async (options) => {
        try {
            const { status } = options.input;
            const count = await options.ctx.DB.review.count({
                where: {
                    status,
                    deleted: false,
                },
            });
            return {
                code: 0,
                message: "",
                data: {
                    status,
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
 * 查询指定 ID 的审批项内容
 */
export const listQuery = procedure //
    .use(approvePermissionMiddleware)
    .input(
        z.object({
            ids: ID.array().optional(), // 审批项 ID 列表, 未设置则查询全部审批项
            status: z.nativeEnum(ReviewStatus).optional(), // 审批状态, 未设置则查询全部状态的审批项
        }),
    )
    .query(async (options) => {
        try {
            const { ids, status } = options.input;
            const reviews = await options.ctx.DB.review.findMany({
                where: {
                    id:
                        (ids && {
                            in: ids,
                        }) ||
                        undefined,
                    status,
                    deleted: false,
                },
                select: REVIEW_SELECT,
            });
            return {
                code: 0,
                message: "",
                data: {
                    status,
                    reviews,
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
 * 分页查询审批项
 */
export const pagingQuery = procedure //
    .use(approvePermissionMiddleware)
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
            status: z.nativeEnum(ReviewStatus).optional(), // 审批状态, 未设置则查询全部状态的审批项
        }),
    )
    .query(async (options) => {
        try {
            const { skip, take, cursor, status } = options.input;
            const reviews = await options.ctx.DB.review.findMany({
                where: {
                    status,
                    deleted: false,
                },
                select: REVIEW_SELECT,
                orderBy: {
                    id: "asc",
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
                    reviews,
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
 * 员工批准审批项
 */
export const approveMutation = procedure //
    .use(approvePermissionMiddleware)
    .input(
        z.object({
            /**
             * 审批项 ID
             */
            id: ID,
            /**
             * 是否批准
             */
            approved: z.boolean(),
            /**
             * 批准意见
             */
            comment: z.string().default(""),
        }),
    )
    .mutation(async (options) => {
        try {
            const reviewer_id = options.ctx.session.data.account.id;
            const { id, approved, comment } = options.input;

            /* 更新审批项 */
            const review = await options.ctx.DB.review.update({
                where: {
                    id,
                    deleted: false,
                },
                data: {
                    comment,
                    status: approved ? ReviewStatus.Approved : ReviewStatus.Rejected,
                    approval_time: new Date(),
                    reviewer_id,
                },
                select: REVIEW_SELECT,
            });

            /* 若通过审批则更新对应的发布内容 */
            const publish = await (async () => {
                if (approved) {
                    return await options.ctx.DB.publish.upsert({
                        where: {
                            draft_id: review.draft_id,
                            deleted: false,
                        },
                        update: {
                            title: review.title,
                            content: review.content,
                            modification_time: new Date(),
                            review: {
                                connect: {
                                    id: review.id,
                                },
                            },
                            coordinate:
                                (review.coordinate_id && {
                                    connect: {
                                        id: review.coordinate_id,
                                    },
                                }) ||
                                undefined,
                            assets:
                                (review.assets && {
                                    // REF: https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#delete-all-related-records
                                    deleteMany: {},
                                    create: review.assets.map(({ index, asset_uid }) => ({
                                        index,
                                        asset_uid,
                                    })),
                                }) ||
                                undefined,
                        },
                        create: {
                            uid: cuid2.createId(),
                            title: review.title,
                            content: review.content,
                            publisher: {
                                connect: {
                                    id: review.submitter_id,
                                },
                            },
                            draft: {
                                connect: {
                                    id: review.draft_id,
                                },
                            },
                            review: {
                                connect: {
                                    id: review.id,
                                },
                            },
                            coordinate:
                                (review.coordinate_id && {
                                    connect: {
                                        id: review.coordinate_id,
                                    },
                                }) ||
                                undefined,
                            assets:
                                (review.assets && {
                                    // REF: https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#delete-all-related-records
                                    create: review.assets.map(({ index, asset_uid }) => ({
                                        index,
                                        asset_uid,
                                    })),
                                }) ||
                                undefined,
                        },
                        select: {
                            uid: true,
                        },
                    });
                } else {
                    return undefined;
                }
            })();

            /* 更新关联的资源文件访问权限 */
            if (review.assets.length > 0) {
                await options.ctx.DB.asset.updateMany({
                    where: {
                        uid: {
                            in: review.assets.map((asset) => asset.asset_uid),
                        },
                        permission: {
                            lte: 0b0111, // 管理员-审核者-上传者 可访问
                        },
                        deleted: false,
                    },
                    data: {
                        permission: 0b1111, // 公众-管理员-审核者-上传者 可访问
                    },
                });
            }

            return {
                code: 0,
                message: "",
                data: {
                    review,
                    publish,
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
