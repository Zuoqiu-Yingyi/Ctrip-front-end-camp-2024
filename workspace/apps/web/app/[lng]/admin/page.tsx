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

import React from "react";
import { LockOutlined, UserOutlined, SignatureFilled } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Flex, Typography } from "antd";
import { useTranslation } from "@/app/i18n/client";

const { Title } = Typography;

export default function LoginPage({ params: { lng } }: { params: { lng: string } }): JSX.Element {
    const { t } = useTranslation(lng);

    const onFinish = (values: any) => {
        console.log("Received values of form: ", values);
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
            <Title
                level={3}
                style={{ marginBottom: "20px" }}
            >
                <SignatureFilled className="mr-2" />
                {t("title")}
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
                        placeholder={t("userName")}
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: "Please input your Password!" }]}
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
                        style={{ width: "100%" }}
                    >
                        {t("login")}
                    </Button>
                </Form.Item>
            </Form>
        </Flex>
    );
}
