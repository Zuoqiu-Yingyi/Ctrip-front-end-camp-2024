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
import { initDraft } from "./../utils/draft";
import { get } from "./../utils/assets";
import { ReviewStatus } from "./../../src/types/review";

const user = new TRPC();
const reviewer = new TRPC();

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

describe("/trpc/review", () => {
    test(`Approval process`, async () => {
        /* 初始化账户 */
        await initAccount(undefined, user);
        await login({ username: "reviewer", passphrase: "reviewer", role: "staff" }, reviewer);

        /* 创建草稿 (用户) */
        const { draft, response } = await initDraft(user);
        const draft_id = response.data!.draft.id;
        const user_id = response.data!.draft.author_id;

        /* 提交审批 (用户) */
        const response_summit1 = await user.client.review.submit.mutate({ draft_id });
        const review_id = response_summit1.data!.review.id;
        expect(response_summit1.code).toEqual(0);
        expect(response_summit1.data?.review.title).toEqual(draft.title);
        expect(response_summit1.data?.review.content).toEqual(draft.content);
        expect(response_summit1.data?.review.status).toEqual(ReviewStatus.Pending);
        expect(response_summit1.data?.review.submitter_id).toEqual(user_id);
        expect(response_summit1.data?.review.assets.map((asset) => asset.asset_uid)).toEqual(draft.assets);
        expect(response_summit1.data?.review.coordinate).toMatchObject(draft.coordinate);
        expect(response_summit1.data?.review.draft_id).toEqual(draft_id);

        /* 重复提交审批 (用户) */
        const draft2 = {
            ...draft,
            id: draft_id,
            title: cuid.createId(),
            content: cuid.createId(),
            coordinate: {
                latitude: (Math.random() * (1 << 6)) | 0,
                longitude: (Math.random() * (1 << 6)) | 0,
                accuracy: (Math.random() * (1 << 6)) | 0,
                altitude: (Math.random() * (1 << 6)) | 0,
                altitude_accuracy: (Math.random() * (1 << 6)) | 0,
                heading: (Math.random() * (1 << 6)) | 0,
                speed: (Math.random() * (1 << 6)) | 0,
            },
        };
        // 更新草稿
        const response_update1 = await user.client.draft.update.mutate(draft2);
        expect(response_update1.code).toEqual(0);

        // 重新提交审批
        const response_summit2 = await user.client.review.submit.mutate({ draft_id });
        expect(response_summit2.code).toEqual(0);
        expect(response_summit2.data?.review.id).toEqual(review_id);
        expect(response_summit2.data?.review.title).toEqual(draft2.title);
        expect(response_summit2.data?.review.content).toEqual(draft2.content);
        expect(response_summit2.data?.review.coordinate).toMatchObject(draft2.coordinate);

        /* 测试审批项获取 (用户) */
        const response_submitted1 = await user.client.review.submitted.query({ draft_id });
        expect(response_submitted1.code).toEqual(0);
        expect(response_submitted1.data?.reviews[0].submission_time).toHaveLength(1);

        /* 测试审批项查询 (员工) */
        // 数量查询
        const response_count1 = await reviewer.client.review.count.query({ status: ReviewStatus.Pending });
        expect(response_count1.code).toEqual(0);
        expect(response_count1.data?.count).toBeGreaterThanOrEqual(1);
        const review_count_pending = response_count1.data!.count;

        const response_count2 = await reviewer.client.review.count.query({});
        expect(response_count2.code).toEqual(0);
        expect(response_count2.data?.count).toBeGreaterThanOrEqual(1);
        const review_count = response_count2.data!.count;

        // 批量查询
        const response_list1 = await reviewer.client.review.list.query({ status: ReviewStatus.Pending });
        expect(response_list1.code).toEqual(0);
        expect(response_list1.data?.reviews.at(-1)!.id).toEqual(review_id);

        const response_list2 = await reviewer.client.review.list.query({});
        expect(response_list2.code).toEqual(0);
        expect(response_list2.data?.reviews.at(-1)!.id).toEqual(review_id);

        // 指定 ID 查询
        const response_list3 = await reviewer.client.review.list.query({ ids: [review_id], status: ReviewStatus.Pending });
        expect(response_list3.code).toEqual(0);
        expect(response_list3.data?.reviews).toHaveLength(1);
        expect(response_list3.data?.reviews[0].id).toEqual(review_id);

        const response_list4 = await reviewer.client.review.list.query({ ids: [review_id] });
        expect(response_list4.code).toEqual(0);
        expect(response_list4.data?.reviews).toHaveLength(1);
        expect(response_list4.data?.reviews[0].id).toEqual(review_id);

        // 分页查询
        const response_paging1 = await reviewer.client.review.paging.query({ skip: 0, take: review_count_pending, status: ReviewStatus.Pending });
        expect(response_paging1.code).toEqual(0);
        expect(response_paging1.data?.reviews).toHaveLength(review_count_pending);
        let s = response_paging1.data?.reviews[0];
        expect(response_paging1.data?.reviews[review_count_pending - 1].id).toEqual(review_id);

        const response_paging2 = await reviewer.client.review.paging.query({ skip: 0, take: review_count });
        expect(response_paging2.code).toEqual(0);
        expect(response_paging2.data?.reviews).toHaveLength(review_count);
        expect(response_paging2.data?.reviews[review_count - 1].id).toEqual(review_id);

        const response_paging3 = await reviewer.client.review.paging.query({ skip: review_count_pending - 1, take: 1, status: ReviewStatus.Pending });
        expect(response_paging3.code).toEqual(0);
        expect(response_paging3.data?.reviews).toHaveLength(1);
        expect(response_paging3.data?.reviews[0].id).toEqual(review_id);

        const response_paging4 = await reviewer.client.review.paging.query({ skip: review_count - 1, take: 1 });
        expect(response_paging4.code).toEqual(0);
        expect(response_paging4.data?.reviews).toHaveLength(1);
        expect(response_paging4.data?.reviews[0].id).toEqual(review_id);

        // 游标分页查询
        const response_paging5 = await reviewer.client.review.paging.query({ skip: 0, take: 1, cursor: review_id, status: ReviewStatus.Pending });
        expect(response_paging5.code).toEqual(0);
        expect(response_paging5.data?.reviews).toHaveLength(1);
        expect(response_paging5.data?.reviews[0].id).toEqual(review_id);

        const response_paging6 = await reviewer.client.review.paging.query({ skip: 0, take: 1, cursor: review_id });
        expect(response_paging6.code).toEqual(0);
        expect(response_paging6.data?.reviews).toHaveLength(1);
        expect(response_paging6.data?.reviews[0].id).toEqual(review_id);

        /* 测试审批项资源文件获取 (员工) */
        const response_asset = await get(draft.assets[0], reviewer);
        expect(response_asset.ok).toBeTruthy();

        /* 拒绝审批项 (员工) */
        const comment = cuid.createId();
        const response_approve = await reviewer.client.review.approve.mutate({ id: review_id, approved: false, comment });
        expect(response_approve.code).toEqual(0);
        expect(response_approve.data?.review.status).toEqual(ReviewStatus.Rejected);
        expect(response_approve.data?.review.comment).toEqual(comment);

        const response_submitted3 = await user.client.review.submitted.query({ draft_id });
        expect(response_submitted3.code).toEqual(0);
        expect(response_submitted3.data?.reviews.at(-1)!.status).toEqual(ReviewStatus.Rejected);
        expect(response_submitted3.data?.reviews.at(-1)!.comment).toEqual(comment);

        /* 测试取消审批 (用户) */
        // 提交审批
        const response_summit3 = await user.client.review.submit.mutate({ draft_id });
        expect(response_summit3.code).toEqual(0);
        expect(response_summit3.data?.review.status).toEqual(ReviewStatus.Pending);

        // 取消审批
        const response_cancel1 = await user.client.review.cancel.mutate({ draft_id });
        expect(response_cancel1.code).toEqual(0);
        expect(response_cancel1.data?.count).toEqual(1);

        // 审批状态查询
        const response_submitted2 = await user.client.review.submitted.query({ draft_id });
        expect(response_submitted2.code).toEqual(0);
        expect(response_submitted2.data?.reviews).toHaveLength(2);
        expect(response_submitted2.data?.reviews.at(0)!.status).toEqual(ReviewStatus.Canceled);
    });
});
