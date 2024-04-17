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

"use client";

import {
    //
    useContext,
    useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
    //
    NavBar,
    List,
    Avatar,
    ActionSheet,
    Toast,
    Picker,
    Mask,
    Image
} from "antd-mobile";
import type { Action } from "antd-mobile/es/components/action-sheet";

import LoginPopup from "./LoginPopup";
import ChangePasswordPopup from "./ChangePasswordPopup";
import { ClientContext } from "@/contexts/client";
import { useStore } from "@/contexts/store";
import { uid2path } from "@/utils/image";
import {
    //
    handleError,
    handleResponse,
} from "@/utils/message";
import { Locale } from "@/utils/locale";
import { Theme } from "@/utils/theme";
import AvaterEditor from "@/ui/AvaterEditor";
import DeleteAccountPopup from "./DeleteAccountPopup";

export default function InfoPage(): JSX.Element {
    const { t } = useTranslation();
    const { trpc } = useContext(ClientContext);
    const {
        //
        user,
        updateUser,
        locale,
        setLocale,
        theme,
        setTheme,
    } = useStore.getState();

    const language_labels = {
        get [Locale.auto]() {
            return t("auto");
        },
        get [Locale.zh_Hans]() {
            return "简体中文 (zh-Hans)";
        },
        get [Locale.zh_Hant]() {
            return "繁體中文 (zh-Hant)";
        },
        get [Locale.en]() {
            return "English (en)";
        },
    } as const;

    const theme_labels = {
        get [Theme.auto]() {
            return t("auto");
        },
        get [Theme.light]() {
            return t("theme.light.label");
        },
        get [Theme.dark]() {
            return t("theme.dark.label");
        },
    } as const;

    const [languageLabel, setLanguageLabel] = useState(language_labels[locale]);
    const [themeLabel, setThemeLabel] = useState(theme_labels[theme]);

    const [loginPopupVisible, setLoginPopupVisible] = useState(false);
    const [accountActionSheetVisible, setAccountActionSheetVisible] = useState(false);
    const [changePasswordPopupVisible, setChangePasswordPopupVisible] = useState(false);
    const [deleteAccountPopupVisible, setDeleteAccountPopupVisible] = useState(false);

    // REF: https://mobile.ant.design/zh/components/action-sheet#action
    const account_actions: Action[] = [
        {
            key: "change-password",
            text: t("actions.change-password.text"),
            onClick: () => {
                setChangePasswordPopupVisible(true);
                setAccountActionSheetVisible(false);
            },
        },
        {
            key: "logout",
            text: t("actions.logout.text"),
            onClick: async () => {
                try {
                    const response = await trpc.account.logout.query();
                    handleResponse(response);
                    Toast.show({
                        icon: "success",
                        content: t("actions.logout.prompt.success.content"),
                    });
                    clearUserData();
                } catch (error) {
                    handleError(error);
                } finally {
                    setAccountActionSheetVisible(false);
                }
            },
            bold: true,
        },
        {
            key: "delete-account",
            text: t("actions.delete-account.text"),
            description: t("actions.delete-account.description"),
            onClick: () => {
                setDeleteAccountPopupVisible(true);
                setAccountActionSheetVisible(false);
            },
            bold: true,
            danger: true,
        },
    ];

    /**
     * 界面语言设置
     */
    async function languageSettings() {
        // REF: https://mobile.ant.design/zh/components/picker
        const value = (await Picker.prompt({
            columns: [
                Object.values(Locale).map((locale) => {
                    return { label: language_labels[locale], value: locale, key: locale };
                }),
            ],
            confirmText: t("confirm"),
            cancelText: t("cancel"),
            defaultValue: [locale],
        })) as [Locale] | null;

        const _locale = value?.at(0);
        if (_locale) {
            setLocale(_locale);
            setLanguageLabel(language_labels[_locale]);
            setThemeLabel(theme_labels[theme]);
        }
    }

    /**
     * 界面主题设置
     */
    async function themeSettings() {
        const value = (await Picker.prompt({
            columns: [
                Object.values(Theme).map((theme) => {
                    return { label: theme_labels[theme], value: theme, key: theme };
                }),
            ],
            confirmText: t("confirm"),
            cancelText: t("cancel"),
            defaultValue: [theme],
        })) as [Theme] | null;

        const _theme = value?.at(0);
        if (_theme) {
            setTheme(_theme);
            setThemeLabel(theme_labels[_theme]);
        }
    }

    /**
     * 注销登录后清理用户数据
     */
    function clearUserData() {
        updateUser({ loggedIn: false });
    }

    return (
        <>
            <NavBar backArrow={false}>{t("me")}</NavBar>   

            <AvaterEditor avatar={'https://images.unsplash.com/photo-1567945716310-4745a6b7844b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=60'}/>        

            {/* REF: https://mobile.ant.design/zh/components/list */}
            <List>
                <List.Item
                    prefix={
                        <Avatar
                            src={user.avatar ? uid2path(user.avatar) : ""}
                            alt={t("avatar")}
                            onClick={(e) => {
                                // console.debug(e);
                                e.stopPropagation();
                                if (user.loggedIn) {
                                    // TODO: 更改用户头像
                                }
                            }}
                        />
                    }
                    extra={user.loggedIn ? undefined : t("login-signup")}
                    onClick={() => {
                        if (user.loggedIn) {
                            setAccountActionSheetVisible(true);
                        } else {
                            setLoginPopupVisible(true);
                        }
                    }}
                >
                    {user.loggedIn ? user.name : t("visitor")}
                </List.Item>
                <List.Item
                    extra={languageLabel}
                    onClick={languageSettings}
                >
                    {t("settings.language.label")}
                </List.Item>
                <List.Item
                    extra={themeLabel}
                    onClick={themeSettings}
                >
                    {t("settings.theme.label")}
                </List.Item>
            </List>

            {/**
             * 账户操作
             * REF: https://mobile.ant.design/zh/components/action-sheet
             */}
            <ActionSheet
                extra={t("actions.extra")}
                cancelText="取消"
                actions={account_actions}
                visible={accountActionSheetVisible}
                onClose={() => setAccountActionSheetVisible(false)}
            />

            {/* 用户 登录/注册 弹出层 */}
            <LoginPopup
                visible={loginPopupVisible}
                onClose={() => setLoginPopupVisible(false)}
            />

            {user.loggedIn && (
                <>
                    {/* 更改密码 */}
                    <ChangePasswordPopup
                        accountName={user.name}
                        visible={changePasswordPopupVisible}
                        onSuccess={clearUserData}
                        onClose={() => setChangePasswordPopupVisible(false)}
                    />

                    {/* 删除账户 */}
                    <DeleteAccountPopup
                        accountName={user.name}
                        visible={deleteAccountPopupVisible}
                        onSuccess={clearUserData}
                        onClose={() => setDeleteAccountPopupVisible(false)}
                    />
                </>
            )}
        </>
    );
}
