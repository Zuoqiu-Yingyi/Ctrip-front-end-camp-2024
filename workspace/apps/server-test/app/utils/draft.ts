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

import trpc from "./trpc";
import { handleResponse } from "./help";

export async function uploadDraft(draft: any, t = trpc) {
    const response = await t.client.draft.create.mutate(draft);

    if (handleResponse(response).state === "fail") {
        throw Error("Error");
    }

    return response.data!.draft.id;
}

export async function uploadSubmit(draftId: number, t = trpc) {
    const response = await t.client.review.submit.mutate({ draft_id: draftId });

    if (handleResponse(response).state === "fail") {
        throw Error("Error");
    }
}
