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

import path from "node:path";
import { fastifyStatic } from "@fastify/static";
import type { FastifyInstance } from "fastify";
import env from "./../configs/env";

export async function register(fastify: FastifyInstance) {
    // REF: https://www.npmjs.com/package/@fastify/static
    await fastify.register(fastifyStatic, {
        root: path.join(process.cwd(), env.STATIC_ROOT_DIRECTORY_PATH),
        prefix: "/",
    });
    await fastify.after();
}
export default register;
