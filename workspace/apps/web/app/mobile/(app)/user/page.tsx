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
} from "antd-mobile";
import type { Action } from "antd-mobile/es/components/action-sheet";

import LoginPopup from "./LoginPopup";
import { ClientContext } from "@/contexts/client";
import { useStore } from "@/contexts/store";
import ChangeModal from "@/ui/change-modal";
import { uid2path } from "@/utils/image";
import {
    //
    handleError,
    handleResponse,
} from "@/utils/message";
import { Locale } from "@/utils/locale";

export default function InfoPage(): JSX.Element {
    const { t } = useTranslation();
    const { trpc } = useContext(ClientContext);
    const { user, updateUser, locale, setLocale } = useStore((state) => ({
        user: state.user,
        updateUser: state.updateUser,

        locale: state.locale,
        setLocale: state.setLocale,
    }));

    const [loginPopupVisible, setLoginPopupVisible] = useState(false);
    const [accountActionSheetVisible, setAccountActionSheetVisible] = useState(false);

    const [changeModalVisible, setChangeModalVisible] = useState(false);

    // REF: https://mobile.ant.design/zh/components/action-sheet#action
    const account_actions: Action[] = [
        {
            key: "change-password",
            text: t("actions.change-password.text"),
            onClick: () => {
                // TODO: 修改密码
                setChangeModalVisible(true);
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
                    updateUser({ loggedIn: false });
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
                // TODO: 删除账户
            },
            bold: true,
            danger: true,
        },
    ];

    return (
        <>
            <NavBar backArrow={false}>{t("me")}</NavBar>

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
                    onClick={async () => {
                        // REF: https://mobile.ant.design/zh/components/picker
                        const value = (await Picker.prompt({
                            columns: [
                                [
                                    { label: t("auto"), value: Locale.auto, key: Locale.auto },
                                    { label: "简体中文 (zh-Hans)", value: Locale.zh_Hans, key: Locale.zh_Hans },
                                    { label: "繁體中文 (zh-Hant)", value: Locale.zh_Hant, key: Locale.zh_Hant },
                                    { label: "English (en)", value: Locale.en, key: Locale.en },
                                ],
                            ],
                            confirmText: t("confirm"),
                            cancelText: t("cancel"),
                            defaultValue: [locale],
                        })) as [Locale] | null;

                        const l = value?.at(0);
                        if (l) {
                            setLocale(l);
                        }
                    }}
                >
                    {t("settings.language.label")}
                </List.Item>
                <List.Item onClick={() => {}}>TODO: {t("settings.theme.label")}</List.Item>
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

            {/* 更改密码 弹出层 */}
            <ChangeModal
                isModalOpen={changeModalVisible}
                setIsModalOpen={setChangeModalVisible}
            />
        </>
    );
}
