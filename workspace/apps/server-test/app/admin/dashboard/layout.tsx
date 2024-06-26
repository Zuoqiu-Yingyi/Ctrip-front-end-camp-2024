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

import React, { useContext } from "react";
import Link from "next/link";
import { Layout, Menu, theme, MenuProps, Typography, Dropdown, Flex } from "antd";
import { PieChartFilled, CarryOutFilled, SignatureFilled, LogoutOutlined, createFromIconfontCN } from "@ant-design/icons";
import { AuthContext } from "@/app/lib/authContext";

const { Header, Content } = Layout;
const { Title } = Typography;
const IconFont = createFromIconfontCN({
    /* cspell:disable-next-line */
    scriptUrl: "//at.alicdn.com/t/c/font_4489509_7860zomd3np.js",
});

export default function OverviewPage({ children }: { children: React.ReactNode }): JSX.Element {
    const { userInfo } = useContext(AuthContext);

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const items: MenuProps["items"] = [
        {
            label: (
                <Link href="/admin/dashboard">
                    <Title level={5}>
                        <PieChartFilled className="mr-2" />
                        {/* {t("overview")} */}
                        总览
                    </Title>
                </Link>
            ),
            key: "overview",
        },
        {
            label: (
                <Link href="/admin/dashboard/content">
                    <Title level={5}>
                        <CarryOutFilled className="mr-2" />
                        {/* {t("audit")} */}
                        审核
                    </Title>
                </Link>
            ),
            key: "content",
        },
    ];

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header
                className="flex justify-between items-center bg-slate-100"
                style={{ backgroundColor: "rgb(241 245 249)" }}
            >
                <Title
                    level={3}
                    style={{ marginBottom: "20px" }}
                >
                    <SignatureFilled className="mr-2" />
                    {/* {t("title")} */}
                    后台管理系统
                </Title>
                <Flex className="mr-5">
                    <Menu
                        theme="light"
                        mode="horizontal"
                        items={items}
                        defaultSelectedKeys={["overview"]}
                        style={{ minWidth: 200, backgroundColor: "inherit", borderBottom: "0" }}
                    />
                    <Dropdown
                        menu={{
                            items: [
                                {
                                    key: 1,
                                    icon: <LogoutOutlined />,
                                    // label: t("logout"),
                                    label: "登出",
                                },
                            ],
                        }}
                    >
                        <Title
                            level={5}
                            type="secondary"
                        >
                            {userInfo.current?.accessRole === 2 ? (
                                <IconFont
                                    /* cspell:disable-next-line */
                                    type="icon-zk-shenheyuan"
                                    className="mr-3"
                                />
                            ) : (
                                <IconFont
                                    /* cspell:disable-next-line */
                                    type="icon-guanliyuan_jiaoseguanli"
                                    className="mr-3"
                                    style={{ color: "red" }}
                                />
                            )}

                            {userInfo.current?.username}
                        </Title>
                    </Dropdown>
                </Flex>
            </Header>
            <Content style={{ padding: "24px 48px", backgroundColor: "rgb(241 245 249)" }}>
                <div
                    style={{
                        background: colorBgContainer,
                        padding: 24,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {children}
                </div>
            </Content>
        </Layout>
    );
}
