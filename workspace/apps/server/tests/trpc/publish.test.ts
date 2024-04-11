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
import {
    //
    login,
    initAccount,
} from "./../utils/account";
import { initReview } from "./../utils/review";
import { get } from "./../utils/assets";

const user = new TRPC();
const administrator = new TRPC();
const visitor = new TRPC();

describe("/trpc/publish", () => {
    test(`Publish process`, async () => {
        /* 初始化账户 */
        const account = {
            username: cuid.createId(),
            passphrase: cuid.createId(),
            role: "user",
        };
        await initAccount(account, user);
        await login({ username: "admin", passphrase: "admin", role: "staff" }, administrator);

        /* 创建审批项并审批 */
        const { draft, review, publish } = await initReview({ user, reviewer: administrator }, true);
        const title = draft.title;

        /* 查询发布数 */
        const response_count1 = await visitor.client.publish.count.query();
        expect(response_count1.code).toEqual(0);
        expect(response_count1.data?.count).toBeGreaterThanOrEqual(1);

        /* 批量查询 */
        const response_list1 = await visitor.client.publish.list.query({});
        expect(response_list1.code).toEqual(0);
        expect(response_list1.data?.publishs[0].draft_id).toEqual(draft.id);
        expect(response_list1.data?.publishs[0].publisher.name).toEqual(account.username);
        // @ts-ignore
        expect(response_list1.data?.publishs[0].publisher.profile.avatar).toEqual(null);

        /* 指定 ID 查询 */
        const response_list2 = await visitor.client.publish.list.query({ uids: [publish!.uid] });
        expect(response_list2.code).toEqual(0);
        expect(response_list2.data?.publishs).toHaveLength(1);
        expect(response_list2.data?.publishs[0].draft_id).toEqual(draft.id);


        /* 分页查询 */
        const response_paging1 = await visitor.client.publish.paging.query({ skip: 0, take: 1 });
        expect(response_paging1.code).toEqual(0);
        expect(response_paging1.data?.publishs).toHaveLength(1);
        expect(response_paging1.data?.publishs[0].draft_id).toEqual(draft.id);

        /* 游标分页查询 */
        const response_paging2 = await visitor.client.publish.paging.query({ skip: 0, take: 1, cursor: publish!.uid });
        expect(response_paging2.code).toEqual(0);
        expect(response_paging2.data?.publishs).toHaveLength(1);
        expect(response_paging2.data?.publishs[0].draft_id).toEqual(draft.id);

        /* 资源文件获取 */
        const response_asset = await get(draft.assets[0].asset_uid, visitor);
        expect(response_asset.ok).toBeTruthy();

        /* 搜索发布内容 */
        const keys = [
            //
            `@${account.username}`, // 用户名
            title.substring(0, 4), // 标题首部
            title.substring(10, 4), // 标题中部
            title.substring(20), // 标题尾部
        ];
        // 搜索用户名
        const response_search1 = await visitor.client.publish.search.query({ key: keys[0] });
        expect(response_search1.code).toEqual(0);
        expect(response_search1.data?.publishs).toHaveLength(1);

        // 搜索标题关键词
        const response_search2 = await visitor.client.publish.search.query({ key: keys[1] });
        expect(response_search2.code).toEqual(0);
        expect(response_search2.data?.publishs).toHaveLength(1);

        const response_search3 = await visitor.client.publish.search.query({ key: keys[2] });
        expect(response_search3.code).toEqual(0);
        expect(response_search3.data?.publishs).toHaveLength(1);

        const response_search4 = await visitor.client.publish.search.query({ key: keys[3] });
        expect(response_search4.code).toEqual(0);
        expect(response_search4.data?.publishs).toHaveLength(1);

        // 搜索多个标题关键词
        const response_search5 = await visitor.client.publish.search.query({ key: keys.slice(1, 2).join(" ") });
        expect(response_search5.code).toEqual(0);
        expect(response_search5.data?.publishs).toHaveLength(1);

        const response_search6 = await visitor.client.publish.search.query({ key: keys.slice(1, 3).join(" ") });
        expect(response_search6.code).toEqual(0);
        expect(response_search6.data?.publishs).toHaveLength(1);

        // 同时搜索用户名与标题
        const response_search7 = await visitor.client.publish.search.query({ key: keys.slice(0, 2).join(" ") });
        expect(response_search7.code).toEqual(0);
        expect(response_search7.data?.publishs).toHaveLength(1);

        const response_search8 = await visitor.client.publish.search.query({ key: keys.slice(0, 3).join(" ") });
        expect(response_search8.code).toEqual(0);
        expect(response_search8.data?.publishs).toHaveLength(1);

        const response_search9 = await visitor.client.publish.search.query({ key: keys.slice(0, 4).join(" ") });
        expect(response_search9.code).toEqual(0);
        expect(response_search9.data?.publishs).toHaveLength(1);

        // 搜索不存在的关键词
        const keys_ = [
            //
            `@${cuid.createId()}`, // 不存在的用户名
            cuid.createId(), // 不存在的关键词
        ];
        const response_search10 = await visitor.client.publish.search.query({ key: keys_[0] });
        expect(response_search10.code).toEqual(0);
        expect(response_search10.data?.publishs).toHaveLength(0);

        const response_search11 = await visitor.client.publish.search.query({ key: keys_[1] });
        expect(response_search11.code).toEqual(0);
        expect(response_search11.data?.publishs).toHaveLength(0);

        const response_search12 = await visitor.client.publish.search.query({ key: keys_.join(" ") });
        expect(response_search12.code).toEqual(0);
        expect(response_search12.data?.publishs).toHaveLength(0);

        /* 删除发布内容 */
        const response_delete1 = await administrator.client.publish.delete.mutate({ uids: [publish!.uid] });
        expect(response_delete1.code).toEqual(0);
        expect(response_paging2.data?.publishs).toHaveLength(1);
        expect(response_paging2.data?.publishs[0].draft_id).toEqual(draft.id);
    });
});
