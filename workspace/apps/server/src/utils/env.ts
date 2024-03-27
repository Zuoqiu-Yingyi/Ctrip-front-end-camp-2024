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

export interface IEnv {
    ENV: "development" | "production";
    PORT: number;
    HOST: string;
    TLS: boolean;
    TLS_KEY_FILE_PATH: string;
    TLS_CER_FILE_PATH: string;
    LOG_LEVEL: "fatal" | "error" | "warn" | "info" | "debug" | "trace";
    LOG_FILE_PATH: string;
}

export const ENV_DEFAULT: IEnv = {
    ENV: "production",
    PORT: 3000,
    HOST: "::",
    TLS: false,
    TLS_KEY_FILE_PATH: "./keys/prod.pem.key",
    TLS_CER_FILE_PATH: "./keys/prod.pem.cer",
    LOG_LEVEL: "info",
    LOG_FILE_PATH: "./logs/travels.log",
} as const;

export const env: IEnv = {
    ENV: (process.env._TD_ENV || ENV_DEFAULT.ENV) as IEnv["ENV"],
    PORT: parseInt(process.env._TD_PORT!) || ENV_DEFAULT.PORT,
    HOST: process.env._TD_HOST || ENV_DEFAULT.HOST,
    TLS: process.env._TD_TLS === "true" || ENV_DEFAULT.TLS,
    TLS_KEY_FILE_PATH: process.env._TD_TLS_KEY_FILE_PATH || ENV_DEFAULT.TLS_KEY_FILE_PATH,
    TLS_CER_FILE_PATH: process.env._TD_TLS_CER_FILE_PATH || ENV_DEFAULT.TLS_CER_FILE_PATH,
    LOG_LEVEL: (process.env._TD_LOG_LEVEL || ENV_DEFAULT.LOG_LEVEL) as IEnv["LOG_LEVEL"],
    LOG_FILE_PATH: process.env._TD_LOG_FILE_PATH || ENV_DEFAULT.LOG_FILE_PATH,
} as const;

switch (env.ENV) {
    case "development":
        console.log(env);
        break;

    default:
        break;
}
export default env;
