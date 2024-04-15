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

import { Toast } from "antd-mobile";

export interface IResponse<T extends number> {
    code: T;
    message: string;
    data: unknown;
}

export function handleResponse<T extends number>(response: IResponse<T>) {
    switch (response.code) {
        case 0:
            return true;

        default:
            throw new Error(response.message);
    }
}

export function handleError(error: unknown) {
    switch (true) {
        case error instanceof Error:
            Toast.show({
                icon: "fail",
                content: error.message,
            });
            break;

        default:
            Toast.show({
                icon: "fail",
                content: String(error),
            });
            break;
    }
}
