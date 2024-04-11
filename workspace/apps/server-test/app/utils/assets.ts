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
    trpc,
    origin,
    TRPC,
} from "./trpc";

export async function upload<R = any>(
    //
    formData: FormData,
    t: TRPC,
) {
    console.debug({
        method: "POST",
        body: formData,
        headers: {
            Cookie: t.cookies,
        },
    });

    const response = await fetch(`${origin}/assets/upload`, {
        method: "POST",
        body: formData,
        headers: {
            Cookie: t.cookies,
        },
    });
    return response.json() as R;
}

export async function get(
    //
    uid: string,
    t = trpc,
): Promise<any> {
    const response = await fetch(`${origin}/assets/${uid}`, {
        headers: {
            Cookie: t.cookies,
        },
    });
    return response;
}
