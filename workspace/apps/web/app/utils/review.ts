/**
 * Copyright (C) 2024 wu
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

import { handleResponse } from "./help";
import { ReviewStatus } from "@repo/server/src/types/review";
import { TravelNote } from "../types/definitions";
import { TRPC } from "./trpc";

export async function getReviewCount(state: TravelNote["state"], trpc: TRPC) {
    let countRes = null;

    if (state === "waiting") {
        countRes = await trpc.review.count.query({ status: ReviewStatus.Pending });
    } else if (state === "success") {
        countRes = await trpc.review.count.query({ status: ReviewStatus.Approved });
    } else {
        countRes = await trpc.review.count.query({ status: ReviewStatus.Rejected });
    }

    const handledResponse = handleResponse(countRes);

    if (handledResponse.state === "success") {
        return handledResponse.data?.count;
    } else {
        throw Error("Error");
    }
}

export async function getReviews(index: number, itemNumber: number, state: TravelNote["state"], trpc: TRPC): Promise<TravelNote[]> {
    let response = null;

    if (state === "waiting") {
        response = await trpc.review.paging.query({ skip: index, take: itemNumber, status: ReviewStatus.Pending });
    } else if (state === "success") {
        response = await trpc.review.paging.query({ skip: index, take: itemNumber, status: ReviewStatus.Approved });
    } else {
        response = await trpc.review.paging.query({ skip: index, take: itemNumber, status: ReviewStatus.Rejected });
    }

    const handledResponse = handleResponse(response);

    if (handledResponse.state === "success") {
        return response.data?.reviews.map((item) => ({
            id: item.id,
            href: `/mobile/detail/?id=${item.id}&type=review `,
            title: item.title,
            content: item.content,
            image: item.assets.map((item) => (item.asset_uid)),
            isChecked: false,
            state: state,
            submissionTime: item.submission_time,
            modificationTime: item.modification_time,
            approvalTime: item.approval_time ? item.approval_time : "",
            comment: item.comment ? item.comment : "",
            publishUId: item.publish?.uid ? item.publish!.uid : "",
        }));
    } else {
        throw Error("Error");
    }
}

export async function operateSingleReview(id: number, operate: "pass" | "reject", trpc: TRPC, rejectReason?: string) {
    const response_approve = await trpc.review.approve.mutate(operate === "pass" ? { id: id, approved: true } : { id: id, approved: false, comment: rejectReason });

    console.log(response_approve);

    if (handleResponse(response_approve).state === "fail") {
        throw Error("Error");
    }
}
