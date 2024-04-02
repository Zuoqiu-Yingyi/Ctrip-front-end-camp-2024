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

import { TRPC } from ".";
import { initAccount } from "../utils/account";
import { upload } from "./../utils/assets";

const trpc = new TRPC();

export interface IDraft extends Record<string, any> {
    id?: number;
    title: string;
    content: string;
    assets: string[];
    coordinate: {
        latitude: number;
        longitude: number;
        accuracy: number;
        altitude: number;
        altitude_accuracy: number;
        heading: number;
        speed: number;
    };
}

describe("/trpc/draft", () => {
    test(`create-info-update-info-delete-info`, async () => {
        await initAccount(undefined, trpc);

        const formData = new FormData();
        formData.append("file[]", new File([cuid.createId()], cuid.createId() + ".txt", { type: "text/plain" }));
        formData.append("file[]", new File([cuid.createId()], cuid.createId() + ".txt", { type: "text/plain" }));
        const assets_upload1 = await upload(formData, trpc);

        /* 测试草稿创建 */
        const draft1: IDraft = {
            title: cuid.createId(),
            content: cuid.createId(),
            assets: [],
            coordinate: {
                latitude: 0,
                longitude: 1,
                accuracy: 2,
                altitude: 3,
                altitude_accuracy: 4,
                heading: 5,
                speed: 6,
            },
        };
        const response_create = await trpc.client.draft.create.mutate(draft1);
    });
});
