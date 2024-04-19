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

import React, { useContext, useState } from "react";
import { LockOutlined, UserOutlined, SignatureFilled, createFromIconfontCN } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Flex, Typography, Alert, Dropdown } from "antd";
import { useRouter } from "next/navigation";
import { handleResponse } from "@/utils/help";
import { login } from "@/utils/account";
import { useTranslation } from "react-i18next";
import { useLocalStore, useStore } from "@/contexts/adminStore";
import { ClientContext } from "@/contexts/client";
import { Locale } from "@/utils/locale";

const { Title } = Typography;

const IconFont = createFromIconfontCN({
    /* cspell:disable-next-line */
    scriptUrl: "//at.alicdn.com/t/c/font_4489509_1zko20gjk84.js",
});

export default function LoginPage(): JSX.Element {
    const { t } = useTranslation();

    // const { user, userInfo } = useContext(AuthContext);
    const { trpc } = useContext(ClientContext);

    const updateUser = useStore((state) => state.updateUser);

    const { replace } = useRouter();

    const [loading, setLoading] = useState<boolean>(false);

    const [errorDisplay, setErrorDisplay] = useState<boolean>(false);

    const {
        //
        setLocale,
    } = useLocalStore.getState();

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

    const onFinish = async (values: { username: string; password: string; remember: boolean }) => {
        setLoading(true);

        let response = await login({ username: values.username, passphrase: values.password, keep: values.remember, role: "staff" }, trpc);

        if (handleResponse(response).state === "success") {
            // userInfo.current = { username: response.data?.account.username, accessRole: response.data?.account.role };

            updateUser({
                loggedIn: true,
                ...response.data!.account,
            });

            replace("/admin/dashboard");
        } else {
            setErrorDisplay(true);

            setTimeout(() => {
                setErrorDisplay(false);
            }, 1000);
        }

        setLoading(false);
    };

    return (
        <Flex
            gap="middle"
            align="center"
            justify="center"
            style={{ minHeight: "100vh" }}
            className="bg-login-background bg-cover"
            vertical
        >
            <Dropdown
                menu={{
                    items: Object.values(Locale).map((locale) => {
                        return { label: language_labels[locale], value: locale, key: locale };
                    }),
                    onClick: ({ key }) => {
                        setLocale(key as Locale);
                    },
                }}
                className="fixed top-5 right-5"
            >
                <Button
                    type="text"
                    icon={
                        <IconFont
                            /* cspell:disable-next-line */
                            type="icon-shuyi_fanyi-36"
                            style={{
                                fontSize: 20,
                            }}
                        />
                    }
                />
            </Dropdown>

            {errorDisplay && (
                <Alert
                    message={t("error-tip")}
                    type="error"
                    showIcon
                />
            )}

            <Title
                level={3}
                style={{ marginBottom: "20px" }}
            >
                <SignatureFilled className="mr-2" />
                {t("admin-title")}
            </Title>

            <Form
                name="normal_login"
                className="login-form"
                size={"large"}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                style={{ width: "300px", marginBottom: "50px" }}
            >
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: t("prompt-prefix") + t("username") }]}
                >
                    <Input
                        prefix={<UserOutlined className="site-form-item-icon" />}
                        placeholder={t("username")}
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: t("prompt-prefix") + t("password") }]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder={t("password")}
                    />
                </Form.Item>
                <Form.Item>
                    <Form.Item
                        name="remember"
                        valuePropName="checked"
                        noStyle
                    >
                        <Checkbox>{t("remember")}</Checkbox>
                    </Form.Item>
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="login-form-button"
                        loading={loading}
                        style={{ width: "100%" }}
                    >
                        {t("login")}
                    </Button>
                </Form.Item>
            </Form>
        </Flex>
    );
}
