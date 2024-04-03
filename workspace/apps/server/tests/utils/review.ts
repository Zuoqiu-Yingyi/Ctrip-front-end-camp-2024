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

import trpc from "./../trpc";
import { initDraft } from "./draft";

export async function initReview(
    {
        //
        user = trpc,
        reviewer = trpc,
    },
    approved?: boolean,
) {
    /* 创建草稿 */
    const { response } = await initDraft(user);
    const draft = response.data!.draft;
    const draft_id = draft.id;

    /* 提交审批 */
    const response_submit = await user.client.review.submit.mutate({ draft_id });
    const review = response_submit.data!.review;
    const review_id = review.id;

    if (approved !== undefined) {
        /* 进行审批 */
        const response_approve = await reviewer.client.review.approve.mutate({ id: review_id, approved });
        const review = response_approve.data!.review;
        const publish = response_approve.data!.publish;

        return {
            draft,
            review,
            publish,
        };
    } else {
        return {
            draft,
            review,
        };
    }
}
