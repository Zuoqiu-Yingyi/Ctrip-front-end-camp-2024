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
import {
    //
    passphrase2key,
    challenge2response,
    String2ArrayBuffer,
    ArrayBuffer2HexString,
} from "@repo/utils/crypto";
import {trpc} from "./trpc"

type TRole = Parameters<typeof trpc.client.auth.challenge.query>[0]["role"];

export function handleResponse<T>(response: {code: number, message: string, data?: T}) : {state: "success" | "fail", data?: T}{

    if (response.code === 202) {
        return {state: "success", data: response.data}
    } else {
        return {state: "fail"}
    }
    
}

export async function login(
    {
        //
        username,
        passphrase,
        role = "staff",
        remember = false
    }:{
        username: string;
        passphrase: string;
        role?: "user" | "staff";
        remember?: boolean
    },
) {
    const key = await passphrase2key(username, passphrase, "salt");

    // console.log(key);

    const response_challenge = await trpc.client.auth.challenge.query({
        username: username,
        role: role as TRole,
    });

    console.log(response_challenge);

    const challenge = response_challenge.data.challenge;

    const response = await challenge2response(String2ArrayBuffer(challenge), key);

    const response_hex = ArrayBuffer2HexString(response);

    const response_login = await trpc.client.account.login.mutate({
        challenge,
        response: response_hex,
        stay: remember,
    });

    return response_login;
}
