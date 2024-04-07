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
import {
    fastifyTRPCPlugin, //
    type FastifyTRPCPluginOptions,
} from "@trpc/server/adapters/fastify";

import trpcRouter from "./router";
import { createSessionContext } from "./../../contexts";

import type { RegisterOptions } from "fastify";

export interface ITrpcFastifyPluginOptions {}

/**
 * tRPC Fastify 插件
 * @see {@link https://www.npmjs.com/package/fastify-plugin fastify-plugin}
 */
export const trpcFastifyPlugin = fastifyPlugin<RegisterOptions>(async function (fastify, options) {
    // fastify.log.debug(options);

    // REF: https://trpc.io/docs/server/adapters/fastify
    await fastify.register(fastifyTRPCPlugin, {
        /**
         * REF: https://fastify.dev/docs/latest/Reference/Routes/#route-prefixing-and-fastify-plugin
         * 使用 {@link fastifyPlugin} 包装的插件, 不能在外部注册时使用 prefix 前缀指定路径前缀
         */
        prefix: options.prefix,
        useWSS: true,
        trpcOptions: {
            router: trpcRouter,
            createContext: createSessionContext,
            onError({ path, error }) {
                // report to error monitoring
                console.error(`Error in tRPC handler on path '${path}':`, error);
            },
        } satisfies FastifyTRPCPluginOptions<typeof trpcRouter>["trpcOptions"],
    });
    // await fastify.after();
});
export default trpcFastifyPlugin;
