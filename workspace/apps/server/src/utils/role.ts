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

/**
 * 用户角色
 */
export enum Role {
    Administrator = 1, // 管理员
    Reviewer = 2, // 审核员
    User = 10, // 用户
}

/**
 * 将角色字符串转换为角色枚举
 * @param role 角色字符串
 */
export function str2role(role: string): Role {
    switch (role) {
        case "administrator":
            return Role.Administrator;
        case "reviewer":
            return Role.Reviewer;
        case "user":
        default:
            return Role.User;
    }
}
