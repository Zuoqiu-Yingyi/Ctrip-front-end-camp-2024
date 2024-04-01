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
    DIARY,
    DIARY_UPDATE,
} from "./../types/diary";
import { ID } from "./../types";

/**
 * 草稿管理控制器
 */
const draftProcedure = procedure.use(privatePermissionMiddleware);

export const createMutation = draftProcedure //
    .input(DIARY)
    .mutation(async (options) => {
        try {
            const draft = await options.ctx.DB.draft.create({
                data: {
                    title: options.input.title,
                    content: options.input.content,
                    author: {
                        // REF: https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#connect-a-single-record
                        connect: {
                            id: options.ctx.session.data.account.id,
                        },
                    },
                    assets:
                        (options.input.assets && {
                            // REF: https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#connect-multiple-records
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
                include: {
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
                },
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
                include: {
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
                },
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

export const infoQuery = draftProcedure //
    .input(ID.array().optional())
    .query(async (options) => {
        try {
            const author_id = options.ctx.session.data.account.id;
            const drafts = await options.ctx.DB.draft.findMany({
                where: {
                    id:
                        (Array.isArray(options.input) && {
                            in: options.input,
                        }) ||
                        undefined,
                    author_id,
                    deleted: false,
                },
                include: {
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
                },
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

export const deleteMutation = draftProcedure //
    .input(
        z.union([
            //
            ID,
            ID.array(),
        ]),
    )
    .mutation(async (options) => {
        try {
            const drafts = [];
            const ids = Array.isArray(options.input) ? options.input : [options.input];
            const author_id = options.ctx.session.data.account.id;
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
                        publish: {
                            update: {
                                deleted: true,
                            },
                        },
                    },
                    include: {
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
                    },
                });
                drafts.push(draft);
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
