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
import { MutableRefObject, createContext, useRef } from "react";
import { AccessorRole } from "@repo/server/src/utils/role";
import { TRPC } from "@/utils/trpc";

export const AuthContext = createContext<{
    user: MutableRefObject<TRPC>;
    userInfo: MutableRefObject<{ username: string | undefined; accessRole: AccessorRole | undefined; avatar?: string | null | undefined; id?: number } | null>;
}>({
    user: { current: new TRPC() },
    userInfo: { current: null },
});

export default function AuthContextProvider({ children }: { children: React.ReactElement<any, any> }): JSX.Element {
    const user = useRef(new TRPC());

    const userInfo = useRef<{ username: string | undefined; accessRole: AccessorRole | undefined; avatar?: string | null | undefined; id?: number }>(null);

    return <AuthContext.Provider value={{ user, userInfo }}>{children}</AuthContext.Provider>;
}
