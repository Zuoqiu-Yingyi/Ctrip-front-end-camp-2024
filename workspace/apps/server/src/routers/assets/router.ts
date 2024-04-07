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

import { uploadHandler } from "./upload";
import { getHandler } from "./get";
import { AccessorRole } from "./../../utils/role";
import { DB } from "./../../models/client";

import type { FastifyPluginCallback } from "fastify";
import type { IAuthJwtPayload } from "@/utils/jwt";

export interface IAssetsRequest {
    DB: typeof DB.p;
    role: AccessorRole;
    session: IAuthJwtPayload | null;
}

// REF: https://fastify.dev/docs/latest/Reference/TypeScript/#request
declare module "fastify" {
    interface FastifyRequest extends IAssetsRequest {}
}

/**
 * @see {@link https://fastify.dev/docs/latest/Reference/Plugins/ Fastify Plugins}
 */
export const assetsFastifyPlugin: FastifyPluginCallback = async function (fastify, options) {
    // fastify.log.debug(options);
    /**
     * 注入上下文
     * @see {@link https://fastify.dev/docs/latest/Reference/Decorators/ Decorators}
     * @see {@link https://fastify.dev/docs/latest/Reference/Hooks/#prehandler preHandler}
     */
    fastify
        // REF: https://fastify.dev/docs/latest/Reference/Decorators/#usage
        .decorateRequest("DB", DB.p)
        .decorateRequest("role", AccessorRole.Visitor)
        .decorateRequest<IAuthJwtPayload | null>("session", null)
        .addHook("preHandler", async (request, reply) => {
            // 解析会话信息
            try {
                // 失效的令牌也能解码, 且不会抛出异常
                request.session = await request.jwtVerify<IAuthJwtPayload>();
                request.role = request.session.data.account.role;
            } catch (error) {
                // No Authorization was found in request.cookies
                request.session = null;
                request.role = AccessorRole.Visitor;
            }
        });

    /**
     * 文件上传
     * REF: https://www.npmjs.com/package/@fastify/multipart
     */
    fastify.post("/upload", uploadHandler);

    /**
     * 文件获取
     * REF: https://fastify.dev/docs/latest/Reference/Routes/
     */
    fastify.get("/:uid", getHandler);

    await fastify.after();
};
export default assetsFastifyPlugin;
