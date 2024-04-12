// Copyright 2024 wu
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import { handleResponse } from "./help";
import { ReviewStatus } from "@repo/server/src/types/review";
import { TravelNote } from "../types/definitions";
import { TRPC } from "./trpc";

export async function getReviewCount(state: TravelNote["state"], trpc: TRPC) {
    let countRes = null;

    if (state === "waiting") {
        countRes = await trpc.client.review.count.query({ status: ReviewStatus.Pending });
    } else if (state === "success") {
        countRes = await trpc.client.review.count.query({ status: ReviewStatus.Approved });
    } else {
        countRes = await trpc.client.review.count.query({ status: ReviewStatus.Rejected });
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
        response = await trpc.client.review.paging.query({ skip: index, take: itemNumber, status: ReviewStatus.Pending });
    } else if (state === "success") {
        response = await trpc.client.review.paging.query({ skip: index, take: itemNumber, status: ReviewStatus.Approved });
    } else {
        response = await trpc.client.review.paging.query({ skip: index, take: itemNumber, status: ReviewStatus.Rejected });
    }

    const handledResponse = handleResponse(response);

    if (handledResponse.state === "success") {
        return handledResponse.data?.reviews.map((item) => ({
            id: item.id,
            href: "",
            title: item.title,
            content: item.content,
            image: item.assets[0].asset_uid,
            isChecked: false,
            state: state,
            submissionTime: item.submission_time,
            modificationTime: item.modification_time,
            approvalTime: item.approval_time ? item.approval_time : "",
        }));
    } else {
        throw Error("Error");
    }
}

export async function operateSingleReview(id: number, operate: "pass" | "reject", trpc: TRPC, rejectReason?: string) {
    const response_approve = await trpc.client.review.approve.mutate(operate === "pass" ? { id: id, approved: true } : { id: id, approved: false, comment: rejectReason });

    if (handleResponse(response_approve).state === "fail") {
        throw Error("Error");
    }
}
