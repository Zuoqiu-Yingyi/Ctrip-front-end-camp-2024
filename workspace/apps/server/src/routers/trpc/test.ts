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


import { initTRPC } from "@trpc/server";
import { z } from "zod";

export const t = initTRPC.create();

export const router = t.router({
    _query: t.procedure //
        .input(z.string())
        .query((opts) => {
            return {
                input: opts.input,
            };
        }),

    _mutation: t.procedure
        .input(
            z.object({
                str: z.string().min(4),
                num: z.number().max(16).optional(),
            }),
        )
        .mutation((opts) => {
            return {
                input: opts.input,
            };
        }),
});

export default router;
export type TRouter = typeof router;
