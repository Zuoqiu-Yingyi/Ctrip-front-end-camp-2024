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
"use client";

import React, { useContext, useState } from "react";
import { LockOutlined, UserOutlined, SignatureFilled } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Flex, Typography, Alert } from "antd";
import {  useRouter } from 'next/navigation';
import { handleResponse } from "@/app/utils/help";
import { login } from "@/app/utils/account";
import { AuthContext } from "@/app/lib/authContext";
// import { useTranslation } from "@/app/i18n/client";

const { Title } = Typography;

export default function LoginPage(): JSX.Element {
    // const { t } = useTranslation(lng);
    const { user } = useContext(AuthContext);

    const { replace } = useRouter();

    const [loading, setLoading] = useState<boolean>(false);

    const [errorDisplay, setErrorDisplay] = useState<boolean>(false);

    const onFinish = async (values: { username: string; password: string; remember: boolean }) => {
        
        setLoading(true);

        let response = await login({ username: values.username, passphrase: values.password, remember: values.remember, role: "staff" }, user.current);

        handleResponse(response);

        if (handleResponse(response).state === "success") {
            replace('/admin/dashboard');
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
                    message="用户名或密码错误！"
                    type="error"
                    showIcon
                />
            )}

            <Title
                level={3}
                style={{ marginBottom: "20px" }}
            >
                <SignatureFilled className="mr-2" />
                {/* {t("title")} */}
                后台管理系统
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
                    rules={[{ required: true, message: "Please input your Username!" }]}
                >
                    <Input
                        prefix={<UserOutlined className="site-form-item-icon" />}
                        // placeholder={t("userName")}
                        placeholder="用户名"
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: "Please input your Password!" }]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        // placeholder={t("password")}
                        placeholder="密码"
                    />
                </Form.Item>
                <Form.Item>
                    <Form.Item
                        name="remember"
                        valuePropName="checked"
                        noStyle
                    >
                        <Checkbox>
                            {/* {t("remember")} */}
                            记住我
                        </Checkbox>
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
                        {/* {t("login")} */}
                        登录
                    </Button>
                </Form.Item>
            </Form>
        </Flex>
    );
}
