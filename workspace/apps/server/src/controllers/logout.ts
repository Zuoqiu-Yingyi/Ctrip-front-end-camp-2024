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

import { procedure } from ".";
import { tokens } from "../utils/store";
import { accountPermissionMiddleware } from "./../middlewares/permission";

/**
 * 用户注销登录
 */
export const logoutMutation = procedure //
    .use(accountPermissionMiddleware) // 验证用户权限
    .query(async (options) => {
        try {
            /* 清除 Cookie */
            options.ctx.res.clearCookie(options.ctx.S.jwt.cookie!.cookieName);

            /* 获取 Token 版本号并更新 */
            const { id, version } = options.ctx.session.data.token;
            tokens.set(id, version + 1);
            await options.ctx.DB.token.update({
                where: {
                    id,
                },
                data: {
                    version: version + 1,
                },
            });
            return {
                code: 0,
                message: "",
                data: null,
            };
        } catch (error) {
            options.ctx.S.log.error(error);
            return {
                code: -1,
                message: String(error),
                data: null,
            };
        }
    });
