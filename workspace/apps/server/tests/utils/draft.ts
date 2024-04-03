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

import cuid from "@paralleldrive/cuid2";

import trpc from "./../trpc";
import { upload } from "./assets";

export async function initDraft(t = trpc) {
    const formData = new FormData();
    formData.append("file[]", new File([cuid.createId()], cuid.createId() + ".txt", { type: "text/plain" }));
    formData.append("file[]", new File([cuid.createId()], cuid.createId() + ".txt", { type: "text/plain" }));
    const assets_upload1 = await upload(formData, t);

    const draft = {
        title: cuid.createId(),
        content: cuid.createId(),
        assets: assets_upload1.data.successes.map((success: { uid: string }) => success.uid),
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
    const response = await t.client.draft.create.mutate(draft);
    return {
        draft,
        response,
    };
}
