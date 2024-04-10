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
import { trpc } from "./trpc";
import { handleResponse } from "./help";
import { ReviewStatus } from "@repo/server/src/types/review";

export async function getReviewCount() {
    const count = await trpc.client.review.count.query({ status: ReviewStatus.Pending });

    const handledResponse = handleResponse(count);

    if (handledResponse.state === "success") {
        return handledResponse.data?.count;
    }
}

export async function getReviews(itemNumber: number) {

    const response = await trpc.client.review.paging.query({ skip: 0, take: itemNumber, status: ReviewStatus.Pending });

    const handledResponse = handleResponse(response);

    if (handledResponse.state === "success") {
        return handledResponse.data?.reviews.map((item) => ({
            id: item.id,
            href: "",
            title: item.title,
            content: item.content,
            image: "",
            state: "waiting",
        }));
    }
}

export async function passSingleReview(id: number) {

    const response_approve = await trpc.client.review.approve.mutate({ id: id, approved: true });

    
}
