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
    test(`create ~> count ~> list ~> paging ~> update ~> delete`, async () => {
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
        expect(response_create.code).toEqual(0);
        expect(response_create.data?.draft).toMatchObject(draft1);
        draft1.id = response_create.data!.draft.id;

        /* 测试草稿数量查询 */
        const response_count1 = await trpc.client.draft.count.query();
        expect(response_count1.code).toEqual(0);
        expect(response_count1.data?.count).toEqual(1);

        /* 测试草稿批量查询 */
        const response_list1 = await trpc.client.draft.list.query();
        expect(response_list1.code).toEqual(0);
        expect(response_list1.data?.drafts).toHaveLength(1);
        expect(response_list1.data?.drafts[0]).toMatchObject(draft1);

        /* 测试草稿指定 ID 查询 */
        const response_list2 = await trpc.client.draft.list.query([response_create.data!.draft.id]);
        expect(response_list2.code).toEqual(0);
        expect(response_list2.data?.drafts).toHaveLength(1);
        expect(response_list2.data?.drafts[0]).toMatchObject(draft1);

        /* 测试草稿分页查询 */
        const response_list3 = await trpc.client.draft.paging.query({ skip: 0, take: 1 });
        expect(response_list3.code).toEqual(0);
        expect(response_list3.data?.drafts).toHaveLength(1);
        expect(response_list3.data?.drafts[0]).toMatchObject(draft1);

        const response_list4 = await trpc.client.draft.paging.query({ skip: 1, take: 1 });
        expect(response_list4.code).toEqual(0);
        expect(response_list4.data?.drafts).toHaveLength(0);

        /* 测试草稿游标分页查询 */
        const response_list5 = await trpc.client.draft.paging.query({ skip: 0, take: 1, cursor: response_create.data!.draft.id });
        expect(response_list5.code).toEqual(0);
        expect(response_list5.data?.drafts).toHaveLength(1);
        expect(response_list5.data?.drafts[0]).toMatchObject(draft1);

        /* 测试草稿信息更新 */
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

        /* 测试草稿资源文件列表更新 */
        const assets_upload2 = await upload(formData, trpc);
        // draft2.assets.push(...assets_upload2.data.successes.map((success: { uid: string }) => success.uid));
        draft2.assets = assets_upload2.data.successes.map((success: { uid: string }) => success.uid);

        const response_update2 = await trpc.client.draft.update.mutate(draft2);
        // console.log(response_update2.data?.draft);
        expect(response_update2.code).toEqual(0);
        expect(response_update2.data?.draft.assets.map((asset) => asset.asset_uid)).toMatchObject(draft2.assets);

        /* 测试草稿删除 */
        const response_delete = await trpc.client.draft.delete.mutate(draft2.id);
        expect(response_delete.code).toEqual(0);
        expect(response_delete.data?.drafts).toHaveLength(1);

        const response_count2 = await trpc.client.draft.count.query();
        expect(response_count2.code).toEqual(0);
        expect(response_count2.data?.count).toEqual(0);
    });
});
