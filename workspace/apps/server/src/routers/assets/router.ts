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

import { fastifyPlugin } from "fastify-plugin";

import { uploadHandler } from "./upload";
import { getHandler } from "./get";

/**
 * @see {@link https://fastify.dev/docs/latest/Reference/Plugins/ Fastify Plugins}
 */
export const assetsFastifyPlugin = fastifyPlugin(async function (fastify, options) {
    // fastify.log.debug(options);
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
});
export default assetsFastifyPlugin;
