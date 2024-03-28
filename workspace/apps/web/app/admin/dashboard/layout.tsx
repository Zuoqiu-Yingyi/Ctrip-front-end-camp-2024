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
import Link from "next/link";
import { Layout, Menu, theme, MenuProps, Typography } from "antd";
import { PieChartFilled, CarryOutFilled, SignatureFilled } from "@ant-design/icons";

const { Header, Content } = Layout;
const { Title } = Typography;

const items: MenuProps["items"] = [
    {
        label: (
            <Link href="/admin/dashboard">
                <Title level={5}>
                    <PieChartFilled className="mr-2" />
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
                    审核
                </Title>
            </Link>
        ),
        key: "content",
    },
];

export default function OverviewPage({ children }: { children: React.ReactNode }): JSX.Element {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

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
                    后台审核系统
                </Title>
                <Menu
                    theme="light"
                    mode="horizontal"
                    items={items}
                    defaultSelectedKeys={["overview"]}
                    style={{ minWidth: 300, backgroundColor: "inherit", borderBottom: "0" }}
                />
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
