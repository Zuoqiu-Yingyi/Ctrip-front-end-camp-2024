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

import type { FastifyInstance } from "fastify";

import { trpcFastifyPlugin } from "./trpc/fastify";
import { assetsFastifyPlugin } from "./assets/router";

export async function init(fastify: FastifyInstance) {
    // REF: https://fastify.dev/docs/latest/Reference/Routes/#route-prefixing
    await fastify.register(trpcFastifyPlugin, { prefix: "/trpc" });
    await fastify.register(assetsFastifyPlugin, { prefix: "/assets" });
    await fastify.after();
}
