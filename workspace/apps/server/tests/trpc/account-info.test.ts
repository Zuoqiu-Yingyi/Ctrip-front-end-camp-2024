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
import {
    //
    get,
    upload,
} from "./../utils/assets";

const user = new TRPC();
const visitor = new TRPC();

describe("/trpc/account/update", () => {
    test(`update: avatar`, async () => {
        await initAccount(undefined, user);

        const formData = new FormData();
        formData.append("file[]", new File([cuid.createId()], cuid.createId() + ".txt", { type: "text/plain" }));
        const assets_upload = await upload(formData, user);

        const avatars = [...assets_upload.data.successes.map((success: { uid: string }) => success.uid), null];
        for (const avatar of avatars) {
            const response_update_info = await user.client.account.update_info.mutate({
                avatar,
            });
            expect(response_update_info.code).toEqual(0);
            expect(response_update_info.data?.profile.avatar).toEqual(avatar);

            const response_info = await user.client.account.info.query();
            expect(response_info.code).toEqual(0);
            expect(response_info.data?.profile?.avatar).toEqual(avatar);

            if (avatar) {
                expect(get(avatar, visitor)).resolves.toMatchObject({ ok: true });
            }
        }
    });
});
