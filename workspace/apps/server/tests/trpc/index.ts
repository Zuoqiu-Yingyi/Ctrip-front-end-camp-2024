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
import type { TTrpcRouter } from "@/routers/trpc/router";

var cookies: string[] = [];

// REF: https://trpc.io/docs/quickstart#using-your-new-backend-on-the-client
export const client = createTRPCClient<TTrpcRouter>({
    links: [
        httpBatchLink({
            url: `${process.env._TD_SERVER_URL}/trpc`,
            headers() {
                return {
                    Cookie: cookies,
                };
            },
            async fetch(input, init) {
                const response = await globalThis.fetch(input, init as RequestInit);
                const _cookies = response.headers.getSetCookie();
                if (_cookies.length) {
                    cookies = _cookies;
                }
                return response;
            },
        }),
    ],
});

export default client;
