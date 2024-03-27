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

/**
 * @see {@link https://trpc.io/docs/server/adapters/fastify#create-the-context Create the context}
 */
export function createTestContext(options: CreateFastifyContextOptions) {
    return options;
}

export type TTestContext = Awaited<ReturnType<typeof createTestContext>>;
