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
    Staff = 3, // 员工
    User = 10, // 用户
    Visitor = 100, // 游客
}

/**
 * 账户角色
 * 用于登录账户时选择的角色
 */
export enum AccountRole {
    Staff = Role.Staff, // 员工
    User = Role.User, // 用户
}

/**
 * 访问者角色
 * 用于访问者权限控制
 */
export enum AccessorRole {
    Administrator = Role.Administrator, // 管理员
    Reviewer = Role.Reviewer, // 审核员
    User = Role.User, // 用户
    Visitor = Role.Visitor, // 游客
}


/**
 * 将角色字符串转换为角色枚举
 * @param role 角色字符串
 * @returns 角色枚举
 */
export function str2role(role?: string): Role {
    switch (role) {
        case "administrator":
            return Role.Administrator;
        case "reviewer":
            return Role.Reviewer;
        case "staff":
            return Role.Staff;
        case "user":
            return Role.User;
        case "visitor":
        default:
            return Role.Visitor;
    }
}

/**
 * 将角色字符串转换为角色枚举
 * @param role 账户角色字符串
 * @returns 账户角色枚举
 */
export function str2accountRole(role?: string): AccountRole {
    switch (role) {
        case "staff":
            return AccountRole.Staff;
        case "user":
        default:
            return AccountRole.User;
    }
}
