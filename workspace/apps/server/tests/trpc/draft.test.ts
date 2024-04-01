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
import { initAccount } from "./../utils/account";
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
        expect(response_create.code).toEqual(0);
        expect(response_create.data?.draft).toMatchObject(draft1);
        draft1.id = response_create.data!.draft.id;

        const response_info1 = await trpc.client.draft.info.query([response_create.data!.draft.id]);
        expect(response_info1.code).toEqual(0);
        expect(response_info1.data?.drafts[0]).toMatchObject(draft1);

        const draft2 = {
            ...draft1,
            id: draft1.id,
            title: cuid.createId(),
            content: cuid.createId(),
            assets: assets_upload1.data.successes.map((success: { uid: string }) => success.uid),
            coordinate: {
                latitude: 1,
                longitude: 2,
                accuracy: 3,
                altitude: null,
                altitude_accuracy: null,
                heading: null,
                speed: null,
            },
        };
        const response_update1 = await trpc.client.draft.update.mutate(draft2);
        // console.log(response_update1.data?.draft);
        expect(response_update1.code).toEqual(0);
        expect(response_update1.data?.draft.title).toEqual(draft2.title);
        expect(response_update1.data?.draft.content).toEqual(draft2.content);
        expect(response_update1.data?.draft.assets.map((asset) => asset.asset_uid)).toMatchObject(draft2.assets);
        expect(response_update1.data?.draft.coordinate).toMatchObject(draft2.coordinate);

        const assets_upload2 = await upload(formData, trpc);
        // draft2.assets.push(...assets_upload2.data.successes.map((success: { uid: string }) => success.uid));
        draft2.assets = assets_upload2.data.successes.map((success: { uid: string }) => success.uid);

        const response_update2 = await trpc.client.draft.update.mutate(draft2);
        // console.log(response_update2.data?.draft);
        expect(response_update2.code).toEqual(0);
        expect(response_update2.data?.draft.assets.map((asset) => asset.asset_uid)).toMatchObject(draft2.assets);
    });
});
