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

import {
    //
    PrismaClient,
    type Prisma,
} from "@prisma/client";
import type { FastifyInstance } from "fastify";

import { reset as resetStaffTable } from "./staff";
import env from "./../configs/env";
import { prismaClientOptions } from "./../configs/database";

// REF: https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections

export class DatabaseClient {
    public readonly p: InstanceType<typeof PrismaClient>;
    private _f?: FastifyInstance;

    /**
     * @param _prismaClientOptions Prisma 客户端选项
     */
    constructor(
        //
        private readonly _prismaClientOptions: typeof prismaClientOptions = prismaClientOptions,
    ) {
        this.p = new PrismaClient(this._prismaClientOptions);
    }

    /**
     * 转发 Prisma 查询日志
     * @param e Prisma 查询事件
     */
    private readonly queryLogHandler = (e: Prisma.QueryEvent) => {
        // REF: https://www.prisma.io/docs/orm/prisma-client/observability-and-logging/logging#event-based-logging
        this._f?.log.debug(
            [
                //
                "[prisma client query]",
                `Target:   ${e.target}`,
                `Query:    ${e.query}`,
                `Params:   ${e.params}`,
                `Duration: ${e.duration} ms`,
            ].join("\n    "),
        );
    };

    /**
     * 转发 Prisma 消息日志
     * @param logFn Fastify 日志函数
     * @param eventType 时间类型
     * @param e Prisma 消息事件
     */
    private readonly messageLogHandler = (
        //
        logFn: FastifyInstance["log"]["silent"] | undefined,
        eventType: string,
        e: Prisma.LogEvent,
    ) => {
        logFn?.(
            [
                //
                `[prisma client ${eventType}]`,
                `Target:  ${e.target}`,
                `Message: ${e.message}`,
            ].join("\n    "),
        );
    };

    /**
     * 初始化数据库客户端
     */
    public async init(fastify: FastifyInstance): Promise<void> {
        this._f = fastify;
        this.p.$on<"query">("query", this.queryLogHandler);
        this.p.$on("info", this.messageLogHandler.bind(this, fastify.log.info.bind(fastify.log), "info"));
        this.p.$on("warn", this.messageLogHandler.bind(this, fastify.log.warn.bind(fastify.log), "warn"));
        this.p.$on("error", this.messageLogHandler.bind(this, fastify.log.error.bind(fastify.log), "error"));
    }

    /**
     * 连接数据库
     */
    public async connect(): Promise<void> {
        await this.p.$connect();
    }

    /**
     * 数据库预处理
     */
    public async pretreat() {
        if (env.DATABASE_RESET_STAFF) {
            await resetStaffTable.call(this);
        }
    }

    /**
     * 断开数据库
     */
    public async disconnect(): Promise<void> {
        await this.p.$disconnect();
    }
}

export const DB = new DatabaseClient();

export default DB;
