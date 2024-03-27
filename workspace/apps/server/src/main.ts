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

import Fastify, { type FastifyInstance } from "fastify";

import { init as initRouters } from "./routers";
import { D } from "./models/client";
import {
    //
    fastifyOptions,
    fastifyListenOptions,
} from "./configs/server";

/**
 * 服务
 */
export class Server {
    /**
     * Fastify 实例
     */
    public readonly fastify: FastifyInstance;

    private _runing: boolean = false;

    /**
     * @param _fastifyOptions Fastify 选项
     * @param _fastifyListenOptions Fastify 监听选项
     */
    constructor(
        private readonly _fastifyOptions: typeof fastifyOptions = fastifyOptions,
        private readonly _fastifyListenOptions: typeof fastifyListenOptions = fastifyListenOptions,
    ) {
        this.fastify = Fastify(this._fastifyOptions);
    }

    public get runing(): boolean {
        return this._runing;
    }

    /**
     * 初始化 Fastify 服务
     */
    public async init() {
        D.init(this.fastify);
        await initRouters(this.fastify);
        await this.fastify.ready();
    }

    /**
     * 启动 Web 服务
     */
    public async start() {
        if (!this._runing) {
            this._runing = true;
            return this.fastify.listen(this._fastifyListenOptions);
        } else {
            this._runing = false;
            return this._runing;
        }
    }

    /**
     * 停止 Web 服务
     */
    public async stop() {
        if (this._runing) {
            this._runing = false;
            await this.fastify.close();
            return true;
        } else {
            return false;
        }
    }
}

if (process.argv.at(-1) === import.meta.filename) {
    const server = new Server();
    try {
        await server.init();
        await server.start();
    } catch (error) {
        server.fastify.log.error(error);
        await server.stop();
        process.exit(1);
    }
}
