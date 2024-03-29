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

import {
    fastifyTRPCPlugin, //
    type FastifyTRPCPluginOptions,
} from "@trpc/server/adapters/fastify";
import type {
    //
    FastifyPluginCallback,
    FastifyPluginOptions,
} from "fastify";

import trpcRouter from "./router";
import { createSessionContext } from "./../../contexts/session";

export interface ITrpcFastifyPluginOptions extends FastifyPluginOptions {}

/**
 * @see {@link https://fastify.dev/docs/latest/Reference/Routes/#route-prefixing Route Prefixing}
 */
export const trpcFastifyPlugin: FastifyPluginCallback<ITrpcFastifyPluginOptions> = async function (fastify, opts) {
    // fastify.log.debug(opts);

    // REF: https://trpc.io/docs/server/adapters/fastify
    await fastify.register(fastifyTRPCPlugin, {
        // prefix: "/",
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
};
export default trpcFastifyPlugin;
