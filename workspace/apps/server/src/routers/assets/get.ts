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
import path from "node:path";

import { ASSETS_PATH } from ".";
import { AccessorRole } from "./../../utils/role";
import { assets } from "./../../utils/store";

import type {
    //
    RouteHandlerMethod,
    FastifyRequest,
} from "fastify";
import type { IAssetsRequest } from "./router";

export interface IParams {
    uid: string;
}

/**
 * 资源文件获取
 * @param request Fastify 请求对象
 * @param reply Fastify 响应对象
 */
export const getHandler: RouteHandlerMethod = async function (request: IAssetsRequest & FastifyRequest, reply) {
    try {
        const { uid } = request.params as IParams;
        const asset = await (async () => {
            const asset = assets.get(uid);
            if (asset) {
                return asset;
            } else {
                const asset = await request.DB.asset.findUnique({
                    where: {
                        uid,
                        deleted: false,
                    },
                    select: {
                        path: true,
                        mime: true,
                        permission: true,
                        uploader_id: true,
                    },
                });
                if (asset) {
                    assets.set(uid, asset);
                }
                return asset;
            }
        })();
        if (asset) {
            // request.server.log.debug(asset);
            const asset_path = path.join(ASSETS_PATH, asset.path);
            try {
                let accessible = false;
                await fs.promises.access(asset_path, fs.constants.R_OK);
                switch (request.role) {
                    case AccessorRole.Visitor:
                        if (asset.permission & 0b1000) {
                            accessible = true;
                        }
                        break;
                    case AccessorRole.Administrator:
                        if (asset.permission & 0b0100) {
                            accessible = true;
                        }
                        break;
                    case AccessorRole.Reviewer:
                        if (asset.permission & 0b0010) {
                            accessible = true;
                        }
                        break;
                    case AccessorRole.User:
                        if (asset.permission & 0b0001 && asset.uploader_id === request.session?.data.account.id) {
                            accessible = true;
                        }
                        break;
                    default:
                        break;
                }
                if (accessible) {
                    const file = await fs.promises.readFile(asset_path);
                    reply.type(asset.mime);
                    return file;
                }
            } catch (error) {}
        }
        reply.status(404);
    } catch (error) {
        request.server.log.error(error);
        reply.status(500);
    }
};
export default getHandler;
