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

import fs from "node:fs";
import crypto from "node:crypto";

const _TD_USER_KEY_SALT = crypto.randomBytes(32).toString("base64url");
const _TD_JWT_SECRET = crypto.randomBytes(32).toString("base64url");
const _TD_CHALLENGE_RESPONSE_JWT_SECRET = crypto.randomBytes(32).toString("base64url");

const ENV_DEV_LOCAL = `
# 运行环境
_TD_ENV="development"

# 日志打印级别
_TD_LOG_LEVEL="debug"

# 启动服务器时使用默认的工作人员账号重置数据库 Staff 表
_TD_DATABASE_RESET_STAFF="true"

# 用户密钥盐值
_TD_USER_KEY_SALT="salt"

# 用于用户登录状态的 JWT 密钥
_TD_JWT_SECRET="secret"
`;

const ENV_PROD_LOCAL = `
# 运行环境
_TD_ENV="production"

# 用户密钥盐值
_TD_USER_KEY_SALT="${_TD_USER_KEY_SALT}"

# 用于用户登录状态的 JWT 密钥
_TD_JWT_SECRET="${_TD_JWT_SECRET}"

# 用于挑战应答的 JWT 密钥
_TD_CHALLENGE_RESPONSE_JWT_SECRET="${_TD_CHALLENGE_RESPONSE_JWT_SECRET}"
`;

const ENV_TEST_LOCAL = `
# 运行环境
_TD_ENV="test"

# 用户密钥盐值
_TD_USER_KEY_SALT="salt"

# 服务 URL
_TD_TEST_SERVER_URL="http://localhost:3000"
`;

async function start() {
    /* 创建本地环境变量文件 */
    !fs.existsSync("./.env.development.local") && (await fs.promises.writeFile("./.env.development.local", ENV_DEV_LOCAL));
    !fs.existsSync("./.env.production.local") && (await fs.promises.writeFile("./.env.production.local", ENV_PROD_LOCAL));
    !fs.existsSync("./.env.test.local") && (await fs.promises.writeFile("./.env.test.local", ENV_TEST_LOCAL));
}

if (process.argv.includes(import.meta.filename)) {
    start();
}
