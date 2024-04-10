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

import cors from "@fastify/cors";

import type { FastifyInstance } from "fastify";

export async function register(fastify: FastifyInstance) {

    await fastify.register(cors, {
        origin: "*", // 允许所有域名访问
        // methods: ["GET", "PUT", "POST", "PATCH", "DELETE"], // 允许的 HTTP 方法
        // allowedHeaders: ["Content-Type", "Authorization"], // 允许的请求头
        // exposedHeaders: [], // 可以访问的响应头
        credentials: true, // 允许发送 Cookie
        // maxAge: 86400, // 预检请求的有效期
    });

    await fastify.after();
}
export default register;
