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

"use client";

import Link from "next/link";
import { useState } from "react";
import trpc from "@/utils/trpc";
import {
    //
    passphrase2key,
    challenge2response,
    String2ArrayBuffer,
    ArrayBuffer2HexString,
} from "@repo/utils/crypto";

type TRole = "staff" | "user";

export default function Login() {
    const [username, setUsername] = useState("admin");
    const [passphrase, setPassphrase] = useState("admin");
    const [stay, setStay] = useState(false);
    const [role, setRole] = useState<TRole>("staff");

    async function getChallenge(): Promise<string> {
        const response_challenge = await trpc.auth.challenge.query({
            username,
            role,
        });
        console.debug(response_challenge.data);

        const challenge = response_challenge.data.challenge;
        return challenge;
    }

    async function sighup() {
        const key = await passphrase2key(username, passphrase, "salt");
        const response_sighup = await trpc.account.signup.mutate({
            username,
            password: ArrayBuffer2HexString(key),
        });
        console.debug(response_sighup.data);
    }

    async function login() {
        const challenge = await getChallenge();
        const key = await passphrase2key(username, passphrase, "salt");
        const response = await challenge2response(String2ArrayBuffer(challenge), key);
        const response_hex = ArrayBuffer2HexString(response);

        const response_login = await trpc.account.login.mutate({
            challenge,
            response: response_hex,
            stay,
        });
        console.debug(response_login.data);
    }

    async function logout() {
        try {
            const response_logout = await trpc.account.logout.query();
            console.debug(response_logout);
        } catch (error) {
            console.warn(error);
        }
    }

    return (
        <>
            <h1>Account</h1>
            <div>
                Back to <Link href="/test">/test</Link>
            </div>
            <ul>
                <li>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                </li>
                <li>
                    <label>Passphrase:</label>
                    <input
                        type="text"
                        value={passphrase}
                        onChange={(event) => setPassphrase(event.target.value)}
                    />
                </li>
                <li>
                    <label>Role:</label>
                    <select
                        value={role}
                        onChange={(event) => setRole(event.target.value as TRole)}
                    >
                        <option value="staff">Staff</option>
                        <option value="user">User</option>
                    </select>
                </li>
                <li>
                    <label>Stay:</label>
                    <input
                        type="checkbox"
                        checked={stay}
                        onChange={(event) => setStay(event.target.checked)}
                    />
                </li>
                <li>
                    <button onClick={getChallenge}>Challenge</button>
                    <button onClick={sighup}>Sighup</button>
                    <button onClick={login}>Login</button>
                    <button onClick={logout}>Logout</button>
                </li>
            </ul>
        </>
    );
}
