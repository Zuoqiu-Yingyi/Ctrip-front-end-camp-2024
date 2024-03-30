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
    fastifyJwt,
    type FastifyJWTOptions,
} from "@fastify/jwt";
import env from "./../configs/env";
import { DB } from "./../models/client";
import { tokens } from "../utils/store";

import type { FastifyInstance } from "fastify";
import type { IAuthJwtPayload } from "@/utils/jwt";

export async function register(fastify: FastifyInstance) {
    // REF: https://www.npmjs.com/package/@fastify/jwt
    await fastify.register(fastifyJwt, {
        secret: env.JWT_SECRET,
        sign: {
            expiresIn: env.JWT_EXPIRES_IN,
            iss: env.JWT_ISSUER,
        },
        // REF: https://www.npmjs.com/package/@fastify/jwt#cookie
        cookie: {
            cookieName: env.JWT_COOKIE_NAME,
            signed: false,
        },
        // REF: https://www.npmjs.com/package/@fastify/jwt#trusted
        trusted: validate,
    } satisfies FastifyJWTOptions);
    await fastify.after();
}

/**
 * 校验令牌是否可信
 */
const validate: FastifyJWTOptions["trusted"] = async function (request, payload) {
    // REF: https://www.npmjs.com/package/@fastify/jwt#trusted
    const data = (payload as IAuthJwtPayload).data;
    const version = tokens.get(data.token.id);
    if (version) {
        // 从临时存储中获取到该令牌的有效版本号
        return data.token.version >= version;
    } else {
        // 从临时存储中无该令牌, 从数据库中加载
        const token = await DB.p.token.findUnique({
            where: {
                id: data.token.id,
                deleted: false,
            },
            select: {
                id: true,
                version: true,
            },
        });
        if (token) {
            // 数据库中有该令牌的有效信息
            tokens.set(token.id, token.version);
            return data.token.version >= token.version;
        } else {
            // 数据库中无该令牌的有效信息
            tokens.set(data.token.id, Infinity);
            return false;
        }
    }
};
