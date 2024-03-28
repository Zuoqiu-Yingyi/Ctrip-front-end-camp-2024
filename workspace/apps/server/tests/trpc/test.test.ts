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
    //
    describe,
    test,
    expect,
} from "@jest/globals";

import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { TTrpcRouter } from "@/routers/trpc/router";

describe("tRPC", () => {
    // REF: https://trpc.io/docs/quickstart#using-your-new-backend-on-the-client
    const trpc = createTRPCClient<TTrpcRouter>({
        links: [
            httpBatchLink({
                url: `${process.env._TD_SERVER_URL}/trpc`,
            }),
        ],
    });

    test("/trpc/test", async () => {
        const query_input = "test-query";
        const mutation_input = {
            str: "test-mutation-str",
            num: 8,
        };
        const [
            query_output, //
            mutation_output,
        ] = await Promise.all([
            trpc.test._query.query(query_input), //
            trpc.test._mutation.mutate(mutation_input),
        ]);

        // console.log(query_output);
        // console.log(mutation_output);

        expect(query_output.input).toEqual(query_input);
        expect(mutation_output.input).toEqual(mutation_input);
    });
});
