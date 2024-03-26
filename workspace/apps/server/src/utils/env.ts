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

export const env = {
    ENV: (process.env._TD_ENV || "production") as "development" | "production",
    PORT: parseInt(process.env._TD_PORT!) || 3000,
    HOST: process.env._TD_HOST || "::",
    TLS: process.env._TD_TLS === "true" || false,
    TLS_KEY_FILE_PATH: process.env._TD_TLS_KEY_FILE_PATH || "./keys/prod.pem.key",
    TLS_CER_FILE_PATH: process.env._TD_TLS_CER_FILE_PATH || "./keys/prod.pem.cer",
    LOG_LEVEL: (process.env._TD_LOG_LEVEL || "info") as "fatal" | "error" | "warn" | "info" | "debug" | "trace",
    LOG_FILE_PATH: process.env._TD_LOG_FILE_PATH || "./logs/travels.log",
} as const;
export default env;
