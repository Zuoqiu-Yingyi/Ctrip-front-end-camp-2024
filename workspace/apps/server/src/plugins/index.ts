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

import { register as registerJwtPlugin } from "./jwt";
import { register as registerCookiePlugin } from "./cookie";
import { register as registerStaticPlugin } from "./static";
import { register as registerMultipartPlugin } from "./multipart";

import type { FastifyInstance } from "fastify";

export async function init(fastify: FastifyInstance) {
    await registerMultipartPlugin(fastify); // 注册 multipart 解析插件

    await registerJwtPlugin(fastify); // 注册 JWT 插件
    await registerCookiePlugin(fastify); // 注册 Cookie 插件
    await registerStaticPlugin(fastify); // 注册静态文件插件
    await fastify.after();
}
