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

import type {
    //
    FastifyLoggerOptions,
    PinoLoggerOptions,
} from "fastify/types/logger";
import type { Prisma } from "@prisma/client";

import { merge } from "@repo/utils/modules/deepmerge";
import env from "./env";

//#region fastify-logger

export type TFastifyLoggerOptions = FastifyLoggerOptions & PinoLoggerOptions;

export const baseFastifyLoggerOptions: TFastifyLoggerOptions = {
    level: env.LOG_LEVEL,
    transport: {
        target: "pino-pretty",
        options: {
            // REF: https://www.npmjs.com/package/dateformat
            translateTime: "yyyy-mm-dd HH:MM:ss.l",
            ignore: "pid,hostname",
        },
    },
};

/**
 * @see {@link https://fastify.dev/docs/latest/Reference/Logging/ Fastify Logging}
 */
export const fastifyLoggers = {
    development: merge<TFastifyLoggerOptions>(baseFastifyLoggerOptions, {
        transport: {
            target: "pino-pretty",
            options: {
                colorize: true,
            },
        },
    }),
    production: merge<TFastifyLoggerOptions>(baseFastifyLoggerOptions, {
        file: env.LOG_FILE_PATH,
        transport: {
            target: "pino-pretty",
            options: {
                colorize: false,
            },
        },
    }),
} as const satisfies Record<typeof env.ENV, TFastifyLoggerOptions>;

export const fastifyLogger = fastifyLoggers[env.ENV];

//#endregion fastify-logger

//#region prisma-logger

export type TPrismaClientLoggerOptions = Prisma.PrismaClientOptions["log"];
export const basePrismaClientLoggerOptions: TPrismaClientLoggerOptions = (() => {
    const options: TPrismaClientLoggerOptions = [];
    switch (env.LOG_LEVEL) {
        case "trace":
        case "debug":
            options.push({
                level: "query",
                emit: "event",
            });
        default:
        case "info":
            options.push({
                level: "info",
                emit: "event",
            });
        case "warn":
            options.push({
                level: "warn",
                emit: "event",
            });
        case "error":
            options.push({
                level: "error",
                emit: "event",
            });
        case "fatal":
    }
    return options;
})();

/**
 * @see {@link https://www.prisma.io/docs/orm/prisma-client/observability-and-logging/logging Prisma Logging}
 */
export const prismaLoggers = {
    development: basePrismaClientLoggerOptions,
    production: basePrismaClientLoggerOptions,
} as const satisfies Record<typeof env.ENV, TPrismaClientLoggerOptions>;

export const prismaLogger = prismaLoggers[env.ENV];

//#endregion prisma-logger
