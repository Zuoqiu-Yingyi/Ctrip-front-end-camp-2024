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

import { fastifyMultipart } from "@fastify/multipart";

import type { FastifyInstance } from "fastify";

export async function register(fastify: FastifyInstance) {
    // REF: https://www.npmjs.com/package/@fastify/static
    await fastify.register(fastifyMultipart, {
        limits: {
            /**
             * Max field name size in bytes
             */
            // fieldNameSize: 100,

            /**
             * Max field value size in bytes
             */
            // fieldSize: 100,

            /**
             * Max number of non-file fields
             */
            // fields: 10,

            /**
             * For multipart forms, the max file size in bytes
             * @default 1048576
             */
            fileSize: 1024 ** 2 * 4,

            /**
             * Max number of file fields
             */
            files: 9,

            /**
             * Max number of header key=>value pairs
             */
            // headerPairs: 2000,

            /**
             * For multipart forms, the max number of parts (fields + files)
             * @default 1000
             */
            // parts: 1000,
        },
    });
    await fastify.after();
}
export default register;
