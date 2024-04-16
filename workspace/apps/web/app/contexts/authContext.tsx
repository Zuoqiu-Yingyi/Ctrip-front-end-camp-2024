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

import {
    //
    MutableRefObject,
    createContext,
    useRef,
} from "react";
import { AccessorRole } from "@repo/server/src/utils/role";
import { trpc } from "@/utils/trpc";

export interface IUserInfo {
    username?: string;
    accessRole?: AccessorRole;
    avatar?: string | null;
    id?: number;
}

export const AuthContext = createContext<{
    user: MutableRefObject<typeof trpc>;
    userInfo: MutableRefObject<IUserInfo | null>;
}>({
    user: { current: trpc },
    userInfo: { current: null },
});

export function AuthContextProvider({ children }: { children: React.ReactElement }): JSX.Element {
    const user = useRef(trpc);
    const userInfo = useRef<IUserInfo>(null);

    return <AuthContext.Provider value={{ user, userInfo }}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
