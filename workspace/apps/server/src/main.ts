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

import Fastify, { type FastifyInstance } from "fastify";

import { init as initRouters } from "./routers";
import { logger } from "./utils/logger";
import { options } from "./utils/server";

export async function init(fastify: FastifyInstance): Promise<FastifyInstance> {
    await initRouters(fastify);
    await fastify.ready();
    return fastify;
}

if (process.argv.at(-1) === import.meta.filename) {
    const fastify = Fastify({
        logger,
    });
    try {
        await init(fastify);
        const address = await fastify.listen(options);
        fastify.log.info(`Server is now listening on ${address}`);
    } catch (error) {
        fastify.log.error(error);
    }
}
