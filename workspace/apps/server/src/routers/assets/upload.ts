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
import fs from "node:fs";
import util from "node:util";
import path from "node:path";
import stream from "node:stream";
import crypto from "node:crypto";

import cuid2 from "@paralleldrive/cuid2";

import { ASSETS_PATH } from ".";
import { AccessorRole } from "./../../utils/role";

import type {
    //
    RouteHandlerMethod,
    FastifyRequest,
} from "fastify";
import type { IAssetsRequest } from "./router";

export interface IAsset {
    uid: string; // CUID
    filename: string; // 原文件名
    fieldname: string; // 字段名
    mimetype: string; // 文件 MIME 类型
    path: string; // 文件在 assets 目录下的路径
    hash: string; // 文件 SHA256 哈希值
    size: number; // 文件大小
}

export interface IFailure {
    filename: string; // 文件名
    fieldname: string; // 字段名
    mimetype: string; // 文件 MIME 类型
}

export interface ISuccess extends IFailure {
    id: number; // ID
    uid: string; // CUID
}

/**
 * 未认证的访问者
 */
export class UnauthorizedError extends Error {
    constructor() {
        super(`Unauthorized`);
    }
}

/**
 * 未授权的访问者
 */
export class ForbiddenError extends Error {
    constructor() {
        super(`Forbidden`);
    }
}

const pump = util.promisify(stream.pipeline);

/**
 * 资源文件上传
 * @param request Fastify
 */
export const uploadHandler: RouteHandlerMethod = async function (request: IAssetsRequest & FastifyRequest, reply) {
    try {
        switch (request.role) {
            case AccessorRole.User: {
                // REF: https://www.npmjs.com/package/@fastify/multipart
                const promises: Array<Promise<IAsset>> = [];
                const failures: IFailure[] = []; // 文件上传失败的列表
                const successes: ISuccess[] = []; // 文件上传成功的列表

                const parts = request.files();
                for await (const part of parts) {
                    if (part.type === "file") {
                        promises.push(
                            new Promise(async (resolve, reject) => {
                                try {
                                    /* 文件重命名 */
                                    const uid = cuid2.createId(); // 文件 UID
                                    const parsed_filename = path.parse(part.filename); // 解析后的原文件名
                                    const filename = path.format({
                                        name: uid,
                                        ext: parsed_filename.ext,
                                    }); // 重命名的文件名

                                    const file_path = path.join(ASSETS_PATH, filename); // 文件写入路径
                                    const sha256 = crypto.createHash("sha256");
                                    const file = fs.createWriteStream(file_path);
                                    let size = 0;
                                    await pump(
                                        part.file,
                                        new stream.Writable({
                                            write(chunk, encoding, callback) {
                                                sha256.write(chunk);
                                                file.write(chunk);
                                                size += chunk.length;
                                                callback();
                                            },
                                            final(callback) {
                                                sha256.end();
                                                file.end();
                                                callback();
                                            },
                                        }),
                                    );
                                    const hash = sha256.digest("hex");

                                    resolve({
                                        uid,
                                        filename: parsed_filename.base,
                                        fieldname: part.fieldname,
                                        mimetype: part.mimetype,
                                        path: filename,
                                        hash,
                                        size,
                                    });
                                } catch (error) {
                                    failures.push({
                                        filename: part.filename,
                                        mimetype: part.mimetype,
                                        fieldname: part.fieldname,
                                    });
                                    reject(error);
                                }
                            }),
                        );
                    }
                }

                const results = await Promise.allSettled(promises);
                const results_success = results.filter((result) => result.status === "fulfilled");

                for (let i = 0; i < results.length; ++i) {
                    const result = results[i];
                    if (result.status === "fulfilled") {
                        // 文件写入目录成功
                        try {
                            const asset = await request.DB.asset.create({
                                data: {
                                    uid: result.value.uid,
                                    filename: result.value.filename,
                                    path: result.value.path,
                                    size: result.value.size,
                                    mime: result.value.mimetype,
                                    hash: result.value.hash,
                                    uploader_id: request.session!.data.account.id,
                                },
                            });
                            successes.push({
                                id: asset.id,
                                uid: result.value.uid,
                                filename: result.value.filename,
                                mimetype: result.value.mimetype,
                                fieldname: result.value.fieldname,
                            });
                        } catch (error) {
                            request.server.log.warn(error);
                            failures.push({
                                filename: result.value.filename,
                                mimetype: result.value.mimetype,
                                fieldname: result.value.fieldname,
                            });
                        }
                    }
                }
                return {
                    code: 0,
                    message: "",
                    data: {
                        successes,
                        failures,
                    },
                };
            }

            case AccessorRole.Visitor:
                throw new UnauthorizedError();

            default:
                throw new ForbiddenError();
        }
    } catch (error) {
        switch (true) {
            // 未认证
            case error instanceof UnauthorizedError:
                reply.status(401);
                return {
                    code: 10,
                    message: error.message,
                    data: null,
                };

            // 未授权
            case error instanceof ForbiddenError:
                reply.status(403);
                return {
                    code: 20,
                    message: error.message,
                    data: null,
                };

            default:
                request.server.log.error(error);
                reply.status(500);
                return {
                    code: -1,
                    message: error,
                    data: null,
                };
        }
    }
};
export default uploadHandler;
