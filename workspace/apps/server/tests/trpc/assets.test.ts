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
    describe,
    test,
    expect,
} from "@jest/globals";
import cuid from "@paralleldrive/cuid2";

import {
    //
    trpc,
    origin,
    cookies,
} from ".";
import { initAccount } from "./../utils/account";
import type { ISuccess } from "@/routers/assets/upload";

const fieldname = "file[]";
const mimetype = "text/plain";

export async function upload(strings: string[]): Promise<any> {
    const files = strings.map((str) => new File([str], str, { type: mimetype }));
    const formData = new FormData();
    for (const file of files) {
        formData.append(fieldname, file);
    }
    const response = await fetch(`${origin}/assets/upload`, {
        method: "POST",
        body: formData,
        headers: {
            Cookie: cookies,
        },
    });
    return response.json();
}

export async function get(uid: string): Promise<any> {
    const response = await fetch(`${origin}/assets/${uid}`, {
        headers: {
            Cookie: cookies,
        },
    });
    return response.text();
}

describe("/trpc/assets/upload", () => {
    test(`upload files`, async () => {
        await initAccount(undefined, trpc);

        const strings = [cuid.createId() + ".txt", cuid.createId() + ".txt"];
        const response = await upload(strings);

        expect(response.code).toEqual(0);
        expect(response.data.successes).toHaveLength(strings.length);
        expect(response.data.failures).toHaveLength(0);
        for (const success of response.data.successes as ISuccess[]) {
            expect(strings.includes(success.filename)).toBeTruthy();
            expect(success.fieldname).toEqual(fieldname);
            expect(success.mimetype).toEqual(mimetype);

            const response_get = await get(success.uid);
            expect(response_get).toEqual(success.filename);
        }
    });
});
