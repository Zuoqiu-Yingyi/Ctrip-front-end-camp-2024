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

import { Flex } from "antd";
import { NavBar, Toast, Avatar, Modal, Form, Input, Button, ImageUploader } from "antd-mobile";
import React, { useContext, useState } from "react";
import { List } from "antd-mobile";
import { login, signup } from "@/app/utils/account";
import { handleResponse } from "@/app/utils/help";
import { AuthContext } from "@/app/lib/authContext";
import { Typography } from "antd";
import { origin } from "@/app/utils/trpc";
import { EyeInvisibleOutline, EyeOutline } from 'antd-mobile-icons'

const { Link } = Typography;

export default function InfoPage(): JSX.Element {
    const [visible, setVisible] = useState(true);

    const [passwordVisible, setPasswordVisible] = useState(false);

    const [loading, setLoading] = useState<boolean>(false);

    const { user, userInfo } = useContext(AuthContext);

    const [onLogin, setOnLogin] = useState(true);

    const onFinish = async (values: { username: string; password: string, passwordVerify?: string }) => {
        setLoading(true);

        if (!onLogin && values.password !== values.passwordVerify) {

            Toast.show({
                icon: "fail",
                content: "两次密码不一致",
            });

            setLoading(false);

            return
        }

        let response = null;

        if (onLogin) {
            response = await login({ username: values.username, passphrase: values.password, remember: true, role: "user" }, user.current);
        } else {
            response = await signup({ username: values.username, passphrase: values.password }, user.current);
        }

        if (handleResponse(response).state === "success") {
            if (onLogin) {
                userInfo.current = { username: response.data?.account.username, accessRole: response.data?.account.role, avatar: response.data?.account.avatar, id: response.data?.account.id };

                setVisible(false);

                Toast.show({
                    icon: "success",
                    content: "登录成功",
                });
            } else {
                setOnLogin(true);

                Toast.show({
                    icon: "success",
                    content: "注册成功",
                });
            }
        } else {
            Toast.show({
                icon: "fail",
                content: "失败",
            });
        }

        setLoading(false);
    };

    return (
        <>
            <Modal
                title={onLogin ? "登录" : "注册"}
                visible={visible}
                content={
                    <Form
                        layout="horizontal"
                        mode="card"
                        onFinish={onFinish}
                        footer={
                            <Button
                                block
                                type="submit"
                                color="primary"
                                loading={loading}
                            >
                                {onLogin ? "登录" : "注册"}
                            </Button>
                        }
                    >
                        <Form.Header />
                        <Form.Item
                            label="用户名"
                            name="username"
                            rules={[{ required: true, message: "请输入用户名" }]}
                        >
                            <Input placeholder="请输入" />
                        </Form.Item>
                        <Form.Item
                            label="密码"
                            name="password"
                            rules={
                                onLogin
                                    ? [{ required: true, message: "请输入密码" }]
                                    : [
                                          { pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,10}$/, message: "密码必须必须包含数字、字母,且6-10位" },
                                          { required: true, message: "请输入密码" },
                                      ]
                            }
                            className="flex justify-items-center"
                        >
                            <div className="flex items-center">
                                <Input
                                    className="flex-auto"
                                    placeholder="请输入密码"
                                    type={passwordVisible ? "text" : "password"}
                                />
                                <div className="flex-none ml-8 cursor-pointer">{!passwordVisible ? <EyeInvisibleOutline onClick={() => setPasswordVisible(true)} /> : <EyeOutline onClick={() => setPasswordVisible(false)} />}</div>
                            </div>
                        </Form.Item>
                        {!onLogin && (
                            <Form.Item
                                label="确认密码"
                                name="passwordVerify"
                                rules={onLogin ? [] : [{ required: true, message: "请再次输入密码" }]}
                            >
                                <Input
                                    placeholder="请再次输入密码"
                                    type="password"
                                />
                            </Form.Item>
                        )}

                        <Form.Header />
                        <Link
                            href="#"
                            onClick={() => {
                                setOnLogin(!onLogin);
                            }}
                        >
                            {onLogin ? "没有账号？请注册" : "已有账号？登录"}
                        </Link>

                    </Form>
                }
                onClose={() => {
                    setVisible(false);
                }}
            />
            <NavBar>资料</NavBar>
            <Flex vertical={true}>
                <Flex
                    className="my-8"
                    align="center"
                    justify="center"
                    style={{
                        width: "100%",
                    }}
                >
                    <Avatar
                        // src={(userInfo.current && userInfo.current?.avatar)?`${origin}/assets/${userInfo.current?.avatar}`:""}
                        // src="@/app/public/default_avatar_1.png"
                        src="./../../public/default_avatar_1.png"
                        style={{ "--size": "64px" }}
                    />
                </Flex>

                <List>
                    <List.Item onClick={() => {}}>{userInfo.current?.username}</List.Item>
                    <List.Item onClick={() => {}}>{userInfo.current?.id}</List.Item>
                    <List.Item onClick={() => {}}>修改密码</List.Item>                    
                    <List.Item onClick={() => {}}>退出</List.Item>
                    <List.Item onClick={() => {}}>注销</List.Item>

                </List>
            </Flex>
        </>
    );
}
