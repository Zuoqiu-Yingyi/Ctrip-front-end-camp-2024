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

import React, { useContext } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Layout, Menu, theme, MenuProps, Typography, Dropdown, Flex } from "antd";
import { PieChartFilled, CarryOutFilled, SignatureFilled, LogoutOutlined, createFromIconfontCN } from "@ant-design/icons";
import { AuthContext } from "@/contexts/authContext";

const { Header, Content } = Layout;
const { Title } = Typography;
const IconFont = createFromIconfontCN({
    /* cspell:disable-next-line */
    scriptUrl: "//at.alicdn.com/t/c/font_4489509_7860zomd3np.js",
});

export default function OverviewPage({ children }: { children: React.ReactNode }): JSX.Element {
    const { t, i18n } = useTranslation();

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
                        {t("overview")}
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
                        {t("audit")}
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
                    {t("admin-title")}
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
                                    label: t("logout"),
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
