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
import type { TTrpcRouter } from "@repo/server/src/routers/trpc/router";

export const origin = "http://localhost:3000";

export class TRPC {
    public readonly cookies: string[] = [];
    public readonly client: ReturnType<typeof createTRPCClient<TTrpcRouter>>;

    constructor(url = `${origin}/trpc`) {
        const that = this;
        this.client = createTRPCClient<TTrpcRouter>({
            links: [
                httpBatchLink({
                    url,
                    headers() {
                        return {
                            Cookie: that.cookies,
                        };
                    },
                    async fetch(input: string | URL | Request, init: RequestInit) {
                        const response = await fetch(input, {...init as RequestInit, credentials: 'include'});
                        // const response = await fetch(input, init as RequestInit);
                        const _cookies = response.headers.getSetCookie();
                        // console.debug(_cookies);
                        if (_cookies.length) {
                            that.cookies.length = 0;
                            that.cookies.push(..._cookies);
                        }
                        return response;
                    },
                }),
            ],
        });
    }
}

export const trpc = new TRPC();
export default trpc;


// import {
//     //
//     createTRPCClient,
//     httpBatchLink,
// } from "@trpc/client";
// import type { TTrpcRouter } from "@repo/server/src/routers/trpc/router";

// export const trpc = createTRPCClient<TTrpcRouter>({
//     links: [
//         httpBatchLink({
//             url: `/trpc`,
//         }),
//     ],
// });
// export default trpc;
