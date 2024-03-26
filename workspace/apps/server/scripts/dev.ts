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

import chokidar from "chokidar";
import Fastify, { type FastifyInstance } from "fastify";

import { main } from "./../src/main";
import { logger as fastifyLogger } from "./../src/utils/logger";
import { options as fastifyOptions } from "./../src/utils/server";

class DevServer {
    private _fastify?: FastifyInstance;

    constructor(
        private readonly logger: typeof fastifyLogger = fastifyLogger, //
        private readonly options: typeof fastifyOptions = fastifyOptions, //
    ) {}

    public get fastify(): FastifyInstance | undefined {
        return this._fastify;
    }

    async start() {
        await this.stop();
        if (!this._fastify) {
            try {
                this._fastify = Fastify({
                    logger: this.logger,
                });
                await main(this._fastify);
                const address = await this._fastify.listen(this.options);
                this._fastify.log.info(`Server is now listening on ${address}`);
            } catch (error) {
                this._fastify?.log.error(error);
            }
        }
    }

    async stop() {
        if (this._fastify) {
            try {
                await this._fastify.close();
                this._fastify.log.info(`Server is now closed`);
            } catch (error) {
                this._fastify.log.error(error);
            } finally {
                this._fastify = undefined;
            }
        }
    }

    async restart() {
        await this.stop();
        await this.start();
    }
}


async function dev() {
    const devServer = new DevServer();

    /**
     * 监听 src 目录变化
     * REF: https://www.npmjs.com/package/chokidar
     */
    const src_watcher = chokidar.watch(
        "./src", //
        {
            ignored: /(^|[\/\\])\../, // ignore dotfiles
        },
    );
    src_watcher.on("ready", async () => {
        // console.log("ready");
        await devServer.start();
        src_watcher.on(
            "all", //
            async (
                eventName, //
                path,
                stats,
            ) => {
                // console.log(eventName);
                await devServer.restart();
            },
        );
    });
}

if (process.argv.at(-1) === import.meta.filename) {
    dev();
}
