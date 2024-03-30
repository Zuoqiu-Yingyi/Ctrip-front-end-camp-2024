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

import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { DB } from "./../models/client";
import { IAuthJwtPayload } from "@/utils/jwt";

/**
 * @see {@link https://trpc.io/docs/server/adapters/fastify#create-the-context Create the context}
 */
export async function createSessionContext(options: CreateFastifyContextOptions) {
    let session: IAuthJwtPayload | null;
    try {
        // 失效的令牌也能解码, 且不会抛出异常
        session = await options.req.jwtDecode<IAuthJwtPayload>();
    } catch (error) {
        // No Authorization was found in request.cookies
        session = null;
    }
    return {
        ...options,
        session,
        S: options.req.server,
        DB: DB.p,
    };
}

export type TSessionContext = Awaited<ReturnType<typeof createSessionContext>>;
