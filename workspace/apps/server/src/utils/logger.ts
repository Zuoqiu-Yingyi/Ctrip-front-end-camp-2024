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

import env from "./env";

/**
 * @see {@link https://fastify.dev/docs/latest/Reference/Logging/ Fastify Logging}
 */
export const loggers = {
    development: {
        level: env.LOG_LEVEL,
        transport: {
            target: "pino-pretty",
            options: {
                colorize: true,
                // REF: https://www.npmjs.com/package/dateformat
                translateTime: "yyyy-mm-dd HH:MM:ss",
                ignore: "pid,hostname",
            },
        },
    } as const,
    production: {
        level: env.LOG_LEVEL,
        file: env.LOG_FILE_PATH,
        transport: {
            target: "pino-pretty",
            options: {
                // REF: https://www.npmjs.com/package/dateformat
                translateTime: "yyyy-mm-dd HH:MM:ss Z",
                ignore: "pid,hostname",
            },
        },
    } as const,
} as const satisfies Record<string, FastifyLoggerOptions & PinoLoggerOptions>;

export const logger = loggers[env.ENV as keyof typeof loggers];
export default logger;
