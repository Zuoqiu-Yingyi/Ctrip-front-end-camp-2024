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
import chalk from "chalk";
import deshake from "@repo/utils/misc/deshake";

/**
 * 开发服务子进程
 */
class DevSubProcess {
    /**
     * 服务子进程
     */
    private _subprocess?: ChildProcessWithoutNullStreams;

    /**
     * 延时重启服务子进程 (消抖)
     */
    public readonly delayedRestart!: typeof this.restart;

    /**
     * @param _restart_delay_time 重启服务的延时时间 (单位: 毫秒 ms)
     */
    constructor(
        private readonly _restart_delay_time = 1_000, //
    ) {
        this.delayedRestart = deshake(this.restart.bind(this), this._restart_delay_time);
    }

    public get subprocess(): ChildProcessWithoutNullStreams | undefined {
        return this._subprocess;
    }

    /**
     * 启动服务子进程
     */
    public async start() {
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
                this._subprocess.stdout?.on("data", process.stdout.write.bind(process.stdout));
                this._subprocess.stderr?.on("data", process.stderr.write.bind(process.stderr));
                this._subprocess.on("error", process.stderr.write.bind(process.stderr));

                console.info(`Subprocess run at PID: ${chalk.blue(this._subprocess.pid)}\n`);
            } catch (error) {
                console.error(error);
                this._subprocess = undefined;
            }
        }
    }

    /**
     * 终止服务子进程
     */
    public async stop() {
        if (this._subprocess) {
            try {
                const killed = new Promise((resolve) => {
                    if (this._subprocess) {
                        this._subprocess.on("exit", (code) => {
                            console.info(`\nSubprocess exit with code: ${chalk.bgCyan(code)}`);
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

    /**
     * 重启服务子进程
     */
    public async restart() {
        await this.stop();
        await this.start();
    }
}

/**
 * 开发服务
 */
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
                devSubProcess.delayedRestart();
            },
        );
    });
}

if (process.argv.at(-1) === import.meta.filename) {
    dev();
}
