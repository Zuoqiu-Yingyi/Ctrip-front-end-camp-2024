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
 * 令牌状态
 * 令牌 ID -> 令牌版本号
 * 当令牌的版本号小于该值时，表示令牌已过期
 * 若对应的令牌不存在则需要从数据库中加载
 */
export const tokens = new Map<number, number>();

export interface IAsset {
    path: string; // 资源文件路径
    mime: string; // 资源文件 MIME 类型
    uploader_id: number; // 上传者 ID
    permission: number; // 权限
}

/**
 * 资源文件权限状态
 * 资源文件 UID -> 资源文件权限
 * 当令牌的版本号小于该值时，表示令牌已过期
 * 若对应的令牌不存在则需要从数据库中加载
 */
export const assets = new Map<string, IAsset>();
