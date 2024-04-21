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

import { TCuid } from "@/types/response";
import { origin } from "./env";

export interface IFailure {
    filename: string; // 文件名
    fieldname: string; // 字段名
    mimetype: string; // 文件 MIME 类型
}

export interface ISuccess extends IFailure {
    id: number; // ID
    uid: TCuid; // CUID
}

export interface IAssetsUploadResponse {
    code: number;
    message: string;
    data: {
        successes: ISuccess[];
        failures: ISuccess[];
    };
}

export async function upload(formData: FormData): Promise<IAssetsUploadResponse> {
    const response = await fetch(`${origin}/assets/upload`, {
        method: "POST",
        body: formData,
        credentials: "include",
    });

    return response.json();
}
