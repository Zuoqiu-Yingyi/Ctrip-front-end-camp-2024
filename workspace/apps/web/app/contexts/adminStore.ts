/**
 * Copyright (C) 2024 fenduf
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

import { create } from "zustand";
import {
    createJSONStorage,
    //
    persist,
    type StorageValue,
} from "zustand/middleware";
import { AccessorRole } from "@repo/server/src/utils/role";
import { trpc } from "@/utils/trpc";
import { Locale } from "@/utils/locale";
import { changeLocale } from "@/utils/l10n";
import { IUserState, ILocaleState } from "./store";

interface IAdminInfo //
    extends IUserState,
        ILocaleState {}

export const useStore = create<IUserState>()(
    persist(
        (set, get) =>
            ({
                user: {
                    loggedIn: false,
                },
                updateUser: (user) => set({ user }),
            }) satisfies IUserState,
        {
            name: "tdiary-admin-store",
            storage: createJSONStorage(() => sessionStorage),
        },
    ),
);

export const useLocalStore = create<ILocaleState>()(
    persist(
        (set, get) =>
            ({
                locale: Locale.auto,
                setLocale: (locale) => {
                    changeLocale(locale);
                    set({ locale });
                },
            }) satisfies ILocaleState,
        {
            name: "tdiary-admin-lan-store",
            storage: createJSONStorage(() => localStorage),
        },
    ),
);