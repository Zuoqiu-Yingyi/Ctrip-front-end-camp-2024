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

import { z } from "zod";
import {
    //
    router,
    procedure,
} from ".";

export const testRouter = router({
    _query: procedure //
        .input(z.string())
        .query((opts) => {
            return {
                input: opts.input,
            };
        }),

    _mutation: procedure
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

export type TTestRouter = typeof testRouter;
export default testRouter;
