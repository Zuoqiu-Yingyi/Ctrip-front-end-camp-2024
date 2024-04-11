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

// REF: https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#using-context-providers
"use client";

import { createContext } from "react";
import trpc from "@/utils/trpc";

export interface IStoreContext {
    trpc: typeof trpc;
}

export const StoreValue = { trpc } satisfies IStoreContext;

export const StoreContext = createContext<IStoreContext>(StoreValue);

export function StoreProvider({ children }: { children: React.ReactNode }) {
    return <StoreContext.Provider value={StoreValue}>{children}</StoreContext.Provider>;
}
export default StoreProvider;
