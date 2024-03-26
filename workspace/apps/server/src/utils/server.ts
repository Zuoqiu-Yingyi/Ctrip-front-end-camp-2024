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

import fs from "node:fs";
import type { FastifyListenOptions } from "fastify";
import env from "./env";

export const options: FastifyListenOptions = {
    port: env.PORT,
    host: env.HOST,
    ...(env.TLS
        ? {
              /**
               * @see {@link https://fastify.dev/docs/latest/Reference/HTTP2/ Fastify HTTP2}
               */
              http2: true,
              /**
               * @see {@link https://nodejs.org/dist/latest-v14.x/docs/api/https.html#https_https_createserver_options_requestlistener https.createServer}
               */
              https: {
                  cert: fs.readFileSync(env.TLS_CER_FILE_PATH),
                  key: fs.readFileSync(env.TLS_KEY_FILE_PATH),
              },
          }
        : {}),
} as const;
