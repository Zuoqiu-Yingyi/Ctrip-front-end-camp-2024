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

import { TRPCError } from "@trpc/server";
import { t } from ".";
import { AccessorRole } from "../utils/role";
import type { IAuthJwtPayload } from "@/utils/jwt";
import type { TSessionContext } from "@/contexts";

/**
 * 401 Unauthorized
 * REF: https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/401
 * REF: https://trpc.io/docs/server/error-handling
 */
const STATUS_UNAUTHORIZED = new TRPCError({ code: "UNAUTHORIZED" });

/**
 * 403 Forbidden
 * REF: https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/403
 * REF: https://trpc.io/docs/server/error-handling
 */
const STATUS_FORBIDDEN = new TRPCError({ code: "FORBIDDEN" });

/**
 * 通过上下文判断访问者角色
 * @param context 上下文
 * @returns 访问者角色
 */
export async function context2role(context: TSessionContext): Promise<AccessorRole> {
    /* 校验令牌是否有效 */
    try {
        const session = await context.req.jwtDecode<IAuthJwtPayload>();
        return session.data.account.role;
    } catch (error) {
        // 无效的令牌视为游客
        return AccessorRole.Visitor;
    }
}

/**
 * 访问控制中间件构造器
 */
export function permissionMiddlewareFactory(roles: Iterable<AccessorRole>) {
    // REF: https://trpc.io/docs/server/middlewares#extending-middlewares
    const roleSet = new Set(roles);
    return t.middleware(async (options) => {
        const role = await context2role(options.ctx);
        if (roleSet.has(role)) {
            return options.next({
                ctx: {
                    role,
                    session: options.ctx.session!,
                },
            });
        } else {
            if (role === AccessorRole.Visitor) {
                throw STATUS_UNAUTHORIZED;
            } else {
                throw STATUS_FORBIDDEN;
            }
        }
    });
}

// REF: https://github.com/Zuoqiu-Yingyi/Ctrip-front-end-camp-2024/issues/31
/**
 * 管理权限中间件
 */
export const adminPermissionMiddleware = permissionMiddlewareFactory([
    //
    AccessorRole.Administrator,
    // AccessorRole.Reviewer,
    // AccessorRole.User,
    // AccessorRole.Visitor,
]);

/**
 * 审批权限中间件
 */
export const approvePermissionMiddleware = permissionMiddlewareFactory([
    //
    AccessorRole.Administrator,
    AccessorRole.Reviewer,
    // AccessorRole.User,
    // AccessorRole.Visitor,
]);

/**
 * 审阅权限中间件
 */
export const reviewPermissionMiddleware = permissionMiddlewareFactory([
    //
    AccessorRole.Administrator,
    AccessorRole.Reviewer,
    AccessorRole.User,
    // AccessorRole.Visitor,
]);

/**
 * 账户权限中间件
 */
export const accountPermissionMiddleware = permissionMiddlewareFactory([
    //
    AccessorRole.Administrator,
    AccessorRole.Reviewer,
    AccessorRole.User,
    // AccessorRole.Visitor,
]);

/**
 * 私有权限中间件
 */
export const privatePermissionMiddleware = permissionMiddlewareFactory([
    //
    // AccessorRole.Administrator,
    // AccessorRole.Reviewer,
    AccessorRole.User,
    // AccessorRole.Visitor,
]);

/**
 * 公开权限中间件
 */
export const publicPermissionMiddleware = permissionMiddlewareFactory([
    //
    AccessorRole.Administrator,
    AccessorRole.Reviewer,
    AccessorRole.User,
    AccessorRole.Visitor,
]);

/**
 * 删除权限中间件
 */
export const deletePermissionMiddleware = permissionMiddlewareFactory([
    //
    AccessorRole.Administrator,
    // AccessorRole.Reviewer,
    AccessorRole.User,
    // AccessorRole.Visitor,
]);
