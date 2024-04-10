// Copyright 2024 wu
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import {
    //
    createTRPCClient,
    httpBatchLink,
} from "@trpc/client";
import type { TTrpcRouter } from "@repo/server/src/routers/trpc/router";

export class TRPC {
    public readonly cookies: string[] = [];
    public readonly client: ReturnType<typeof createTRPCClient<TTrpcRouter>>;

    constructor(url = `http://localhost:3000/trpc`) {
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
                    async fetch(input, init) {
                        // const response = await fetch(input, {...init as RequestInit, credentials: 'include'});
                        const response = await fetch(input, init as RequestInit);
                        const _cookies = response.headers.getSetCookie();
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
