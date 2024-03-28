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
import {
    //
    passphrase2key as passphrase2key_node,
    challenge2response as challenge2response_node,
    string2Buffer,
} from "@repo/utils/node/crypto";
import {
    //
    passphrase2key as passphrase2key_browserify,
    challenge2response as challenge2response_browserify,
    string2ArrayBuffer,
} from "@repo/utils/crypto";

describe("crypto", () => {
    const username = "username";
    const passphrase = "passphrase";
    const salt = "salt";
    const challenge = "challenge";

    test("passphrase2key", async () => {
        const key_node = passphrase2key_node(username, passphrase, salt);
        const key_browserify = await passphrase2key_browserify(username, passphrase, salt);

        expect(key_node.toString("hex")).toEqual(Buffer.from(key_browserify).toString("hex"));
    });

    test("passphrase2key", async () => {
        const key_node = passphrase2key_node(username, passphrase, salt);
        const key_browserify = await passphrase2key_browserify(username, passphrase, salt);

        const answer_node = challenge2response_node(string2Buffer(challenge), key_node);
        const answer_browserify = await challenge2response_browserify(string2ArrayBuffer(challenge), key_browserify);

        expect(answer_node.toString("hex")).toEqual(Buffer.from(answer_browserify).toString("hex"));
    });
});
