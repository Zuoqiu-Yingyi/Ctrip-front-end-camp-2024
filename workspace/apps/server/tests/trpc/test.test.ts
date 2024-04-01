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

import { TRPC } from ".";

const trpc = new TRPC();

describe("/trpc/test", () => {
    test("_query", async () => {
        const query_input = "test-query";
        const query_output = await trpc.client.test._query.query(query_input);

        // console.log(query_output);
        expect(query_output.input).toEqual(query_input);
    });

    test("_mutation", async () => {
        const mutation_input = {
            str: "test-mutation-str",
            num: 8,
        };
        const mutation_output = await trpc.client.test._mutation.mutate(mutation_input);

        // console.log(mutation_output);
        expect(mutation_output.input).toEqual(mutation_input);
    });
});
