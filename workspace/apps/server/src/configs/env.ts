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

import { randomString } from "@repo/utils/node/crypto";

export interface IEnv {
    /* 运行环境 */
    ENV: "development" | "production";

    /* Web 服务 */
    PORT: number;
    HOST: string;
    TLS: boolean;
    TLS_KEY_FILE_PATH: string;
    TLS_CER_FILE_PATH: string;

    /* 日志 */
    LOG_LEVEL: "fatal" | "error" | "warn" | "info" | "debug" | "trace";
    LOG_FILE_PATH: string;

    /* 数据库 */
    DATASOURCE_URL?: string;
    DATABASE_RESET_STAFF: boolean;
    STAFF_ACCOUNTS: string;

    /* 安全 */
    USER_KEY_SALT: string;
    JWT_SECRET: string;
    JWT_EXPRES_IN: string;
    CHALLENGE_RESPONSE_JWT_SECRET: string;
    CHALLENGE_RESPONSE_JWT_EXPRES_IN: string;
}

export const ENV_DEFAULT: IEnv = {
    /* 运行环境 */
    ENV: "production",

    /* Web 服务 */
    PORT: 3000,
    HOST: "::",
    TLS: false,
    TLS_KEY_FILE_PATH: "./keys/prod.pem.key",
    TLS_CER_FILE_PATH: "./keys/prod.pem.cer",

    /* 日志 */
    LOG_LEVEL: "info",
    LOG_FILE_PATH: "./logs/travels.log",

    /* 数据库 */
    DATASOURCE_URL: undefined,
    DATABASE_RESET_STAFF: true,
    STAFF_ACCOUNTS: ["0:admin:admin", "1:reviewer:reviewer"].join("\n"),

    /* 安全 */
    USER_KEY_SALT: "mbn8MtY7K8tRvsi8Qz3aXyM3vi1AW2FZ5GPtsfTnR9xWUME1",
    JWT_SECRET: randomString(32),
    JWT_EXPRES_IN: "7d",
    CHALLENGE_RESPONSE_JWT_SECRET: randomString(32),
    CHALLENGE_RESPONSE_JWT_EXPRES_IN: "5m",
} as const;

export const env: IEnv = {
    /* 运行环境 */
    ENV:
        (process.env._TD_ENV as IEnv["ENV"]) || //
        ENV_DEFAULT.ENV,

    /* Web 服务 */
    PORT:
        parseInt(process.env._TD_PORT!) || //
        ENV_DEFAULT.PORT,
    HOST:
        process.env._TD_HOST || //
        ENV_DEFAULT.HOST,
    TLS:
        process.env._TD_TLS === "true" || //
        ENV_DEFAULT.TLS,
    TLS_KEY_FILE_PATH:
        process.env._TD_TLS_KEY_FILE_PATH || //
        ENV_DEFAULT.TLS_KEY_FILE_PATH,
    TLS_CER_FILE_PATH:
        process.env._TD_TLS_CER_FILE_PATH || //
        ENV_DEFAULT.TLS_CER_FILE_PATH,

    /* 日志 */
    LOG_LEVEL:
        (process.env._TD_LOG_LEVEL as IEnv["LOG_LEVEL"]) || //
        ENV_DEFAULT.LOG_LEVEL,
    LOG_FILE_PATH:
        process.env._TD_LOG_FILE_PATH || //
        ENV_DEFAULT.LOG_FILE_PATH,

    /* 数据库 */
    DATASOURCE_URL:
        process.env._TD_DATASOURCE_URL || //
        process.env._TD_PRISMA_DATABASE_URL ||
        ENV_DEFAULT.DATASOURCE_URL,
    DATABASE_RESET_STAFF:
        process.env._TD_DATABASE_RESET_STAFF === "true" || //
        ENV_DEFAULT.DATABASE_RESET_STAFF,
    STAFF_ACCOUNTS:
        process.env._TD_STAFF_ACCOUNTS || //
        ENV_DEFAULT.STAFF_ACCOUNTS,

    /* 安全 */
    USER_KEY_SALT:
        process.env._TD_USER_KEY_SALT || //
        ENV_DEFAULT.USER_KEY_SALT,
    JWT_SECRET:
        process.env._TD_JWT_SECRET || //
        ENV_DEFAULT.JWT_SECRET,
    JWT_EXPRES_IN:
        process.env._TD_JWT_EXPRES_IN || //
        ENV_DEFAULT.JWT_EXPRES_IN,
    CHALLENGE_RESPONSE_JWT_SECRET:
        process.env._TD_CHALLENGE_RESPONSE_JWT_SECRET || //
        ENV_DEFAULT.CHALLENGE_RESPONSE_JWT_SECRET,
    CHALLENGE_RESPONSE_JWT_EXPRES_IN:
        process.env._TD_CHALLENGE_RESPONSE_JWT_EXPRES_IN || //
        ENV_DEFAULT.CHALLENGE_RESPONSE_JWT_EXPRES_IN,
} as const;

switch (env.ENV) {
    case "development":
        console.log(env);
        break;

    default:
        break;
}
export default env;
