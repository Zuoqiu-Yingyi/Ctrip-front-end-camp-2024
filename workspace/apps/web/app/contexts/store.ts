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

import { create } from "zustand";
import {
    //
    persist,
    type StorageValue,
} from "zustand/middleware";

import { AccessorRole } from "@repo/server/src/utils/role";
import { trpc } from "@/utils/trpc";
import { Locale } from "@/utils/locale";
import { changeLocale } from "@/utils/l10n";
import {
    TThemeMode,
    //
    Theme,
    changeTheme,
    getThemeMode,
} from "@/utils/theme";
import { IDraft } from "@/types/response";

export interface IUserBase {
    loggedIn: boolean;
    id?: number;
    role?: AccessorRole;
    name?: string;
    avatar?: string | null;
    createdAt?: string; // ISO 8601 格式时间戳
}

export interface IUserLoggedIn extends Required<IUserBase> {}

export interface IUserNotLoggedIn extends IUserBase {
    loggedIn: false;
}

export type TUser = IUserLoggedIn | IUserNotLoggedIn;

export interface IUserState {
    user: TUser;
    updateUser: (user: TUser) => any;
}

export interface ILocaleState {
    locale: Locale;
    setLocale: (locale: Locale) => any;
}

export interface IThemeState {
    mode: TThemeMode;
    theme: Theme;
    setMode: (mode: TThemeMode) => any;
    setTheme: (theme: Theme) => any;
}

export interface ILineState {
    line: boolean;
    online: () => any;
    offline: () => any;
}

export interface IDraftData {
    drafts: IDraft[];
    setDrafts: (drafts: IDraft[]) => any;
}

export interface IStates //
    extends IUserState,
        ILocaleState,
        IThemeState,
        ILineState,
        IDraftData {}

// REF: https://www.npmjs.com/package/zustand#typescript-usage
export const useStore = create<IStates>()(
    persist(
        (set, get) =>
            ({
                user: {
                    loggedIn: false,
                },
                updateUser: (user) => set({ user }),

                locale: Locale.auto,
                setLocale: (locale) => {
                    changeLocale(locale);
                    set({ locale });
                },

                mode: getThemeMode(),
                theme: Theme.auto,
                setMode: (mode) => {
                    set({ mode });
                },
                setTheme: (theme) => {
                    const mode = changeTheme(theme);
                    set({ theme, mode });
                },

                line: true,
                online: () => {
                    console.debug("online");
                    set({ line: true });
                },
                offline: () => {
                    console.debug("offline");
                    set({ line: false });
                },

                drafts: [],
                setDrafts: (drafts: IDraft[]) => {
                    set({ drafts });
                },
            }) satisfies IStates,
        {
            name: "tdiary-store",
            storage: {
                /**
                 * 从 localStorage 中加载数据
                 */
                async getItem(name) {
                    const item = localStorage.getItem(name);
                    try {
                        const store = item ? (JSON.parse(item) as StorageValue<IStates>) : null;
                        // console.debug(store);
                        if (!store) return null;

                        try {
                            // 恢复语言设置
                            changeLocale(store.state.locale ?? Locale.auto);

                            // 恢复主题设置
                            const mode = changeTheme(store.state.theme ?? Theme.auto);
                            store.state.mode = mode;

                            const response = await trpc.account.info.query();

                            switch (response.code) {
                                case 0:
                                    store.state.user = {
                                        loggedIn: true,
                                        id: response.data!.account.id,
                                        role: response.data!.account.role,
                                        name: response.data!.account.name,
                                        avatar: response.data!.profile?.avatar ?? null,
                                        createdAt: response.data!.account.createdAt,
                                    };
                                    break;
                                default:
                                    break;
                            }
                        } catch (error: any) {
                            // console.debug(error.data);
                            switch (error?.data?.httpStatus) {
                                case 401:
                                case 403:
                                default:
                                    store.state.user = { loggedIn: false };
                                    store.state.drafts = [];
                                    break;
                            }
                        }

                        // console.debug(store);
                        return store;
                    } catch (error) {
                        return null;
                    }
                },
                async setItem(name, value) {
                    localStorage.setItem(name, JSON.stringify(value));
                },
                async removeItem(name) {
                    localStorage.removeItem(name);
                },
            },
        },
    ),
);

const {
    //
    online,
    offline,
} = useStore.getState();

globalThis.addEventListener?.("online", online);
globalThis.addEventListener?.("offline", offline);
