// Copyright 2024 fenduf
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
        ILocaleState{}


export const useStore = create<IUserState>()(
    persist(
        (set, get) =>
            ({
                user: {
                    loggedIn: false,
                },
                updateUser: (user) => set({ user })

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
