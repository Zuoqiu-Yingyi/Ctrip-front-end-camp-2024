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
    spawn, //
    type ChildProcessWithoutNullStreams,
} from "node:child_process";
import chokidar from "chokidar";

class DevSubProcess {
    private _subprocess?: ChildProcessWithoutNullStreams;

    constructor() {}

    public get subprocess(): ChildProcessWithoutNullStreams | undefined {
        return this._subprocess;
    }

    async start() {
        await this.stop();
        if (!this._subprocess) {
            try {
                this._subprocess = spawn(
                    "node", //
                    [
                        "--import=@repo/utils/registers/ts-node.js", //
                        "./src/main.ts",
                    ],
                    {
                        env: process.env,
                    },
                );
                this._subprocess.stdout?.on("data", (chunk) => console.log(chunk.toString()));
                this._subprocess.stderr?.on("data", (chunk) => console.warn(chunk.toString()));
                this._subprocess.on("error", (chunk) => console.error(chunk.toString()));

                console.info(`Subprocess run at PID: ${this._subprocess.pid}`);
            } catch (error) {
                console.error(error);
                this._subprocess = undefined;
            }
        }
    }

    async stop() {
        if (this._subprocess) {
            try {
                const killed = new Promise((resolve) => {
                    if (this._subprocess) {
                        this._subprocess.on("exit", (code) => {
                            console.info(`Subprocess exit with code: ${code}`);
                            resolve(undefined);
                        });
                    } else {
                        resolve(undefined);
                    }
                });
                this._subprocess.kill();
                await killed;
            } catch (error) {
                console.error(error);
            } finally {
                this._subprocess = undefined;
            }
        }
    }

    async restart() {
        await this.stop();
        await this.start();
    }
}

async function dev() {
    const devSubProcess = new DevSubProcess();

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
        await devSubProcess.start();
        src_watcher.on(
            "all", //
            async (
                eventName, //
                path,
                stats,
            ) => {
                // console.log(eventName);
                await devSubProcess.restart();
            },
        );
    });
}

if (process.argv.at(-1) === import.meta.filename) {
    dev();
}
