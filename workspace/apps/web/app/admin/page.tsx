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
import { LockOutlined, UserOutlined, SignatureFilled } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Flex, Typography, Alert } from "antd";
import { useRouter } from "next/navigation";
import { handleResponse } from "@/utils/help";
import { login } from "@/utils/account";
import { AuthContext } from "@/contexts/authContext";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

export default function LoginPage(): JSX.Element {
    const { t, i18n } = useTranslation();

    const { user, userInfo } = useContext(AuthContext);

    const { replace } = useRouter();

    const [loading, setLoading] = useState<boolean>(false);

    const [errorDisplay, setErrorDisplay] = useState<boolean>(false);

    const onFinish = async (values: { username: string; password: string; remember: boolean }) => {
        setLoading(true);

        let response = await login({ username: values.username, passphrase: values.password, remember: values.remember, role: "staff" }, user.current);

        handleResponse(response);

        if (handleResponse(response).state === "success") {
            userInfo.current = { username: response.data?.account.username, accessRole: response.data?.account.role };

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
