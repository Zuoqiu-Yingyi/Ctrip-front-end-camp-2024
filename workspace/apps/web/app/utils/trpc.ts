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
    createTRPCClient,
    httpBatchLink,
} from "@trpc/client";

import { origin } from "./env";
import type { TTrpcRouter } from "@repo/server/src/routers/trpc/router";

type THttpBatchLinkContext = Parameters<typeof httpBatchLink>[0];

const context: THttpBatchLinkContext = (() => {
    switch (process.env.NODE_ENV) {
        case "development":
            const context = {
                url: `${origin}/trpc`,
                // REF: https://trpc.io/docs/client/cors
                fetch(url, options) {
                    return fetch(url, {
                        ...options,
                        credentials: "include",
                    });
                },
            } satisfies THttpBatchLinkContext;
            console.debug(context);
            return context;
        default:
            return {
                url: `${origin}/trpc`,
            };
    }
})();

export const trpc = createTRPCClient<TTrpcRouter>({
    links: [httpBatchLink(context)],
});
export type TRPC = typeof trpc;
export default trpc;
