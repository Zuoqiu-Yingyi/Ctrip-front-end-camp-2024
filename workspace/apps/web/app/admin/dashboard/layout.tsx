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
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Layout, Menu, theme, MenuProps, Typography, Dropdown, Flex, Button } from "antd";
import { PieChartFilled, CarryOutFilled, SignatureFilled, LogoutOutlined, createFromIconfontCN, LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { useLocalStore, useStore } from "@/contexts/adminStore";
import { useRouter } from "next/navigation";
import { AccessorRole } from "@repo/server/src/utils/role";
import { ClientContext } from "@/contexts/client";
import { Locale } from "@/utils/locale";
import { logout } from "@/utils/account";

const { Header, Content } = Layout;
const { Title } = Typography;
const IconFont = createFromIconfontCN({
    /* cspell:disable-next-line */
    scriptUrl: "//at.alicdn.com/t/c/font_4489509_1zko20gjk84.js",
});

export default function OverviewPage({ children }: { children: React.ReactNode }): JSX.Element {
    const { t } = useTranslation();

    const {
        //
        user,
        updateUser,
    } = useStore.getState();

    const { trpc } = useContext(ClientContext);

    const { replace } = useRouter();

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

    const [login, setLogin] = useState(false)

    if (user.loggedIn === false) {
        trpc.account.info.query().then((response) => {
                switch (response.code) {
                    case 0:
                        updateUser({
                            loggedIn: true,
                            ...response.data!.account,
                            avatar: response.data!.profile?.avatar ?? null,
                        });
                        setLogin(true);
                        break;
                    default:
                        replace("/admin");
                        break;
                }                

        }, () => {
            replace("/admin");
        });
    } else if (!login) {
        setLogin(true);
    }

    if (!login) {
        return (
            <>
                <Spin fullscreen />
            </>
        );
    }

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
                <Flex className="mr-5 items-end">
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
                            onClick: async () => {
                                await logout(trpc);
                                updateUser({ loggedIn: false });
                                replace("/admin");
                            },
                        }}
                    >
                        <Button type="text">
                            <Title
                                level={5}
                                type="secondary"
                                className="m-0"
                            >
                                {user.role === AccessorRole.Reviewer ? (
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

                                {user.name}
                            </Title>
                        </Button>
                    </Dropdown>
                    <Dropdown
                        menu={{
                            items: Object.values(Locale).map((locale) => {
                                return { label: language_labels[locale], value: locale, key: locale };
                            }),
                            onClick: ({ key }) => {
                                setLocale(key as Locale);
                            },
                        }}
                    >
                        <Button
                            type="text"
                            icon={
                                <IconFont
                                    /* cspell:disable-next-line */
                                    type="icon-shuyi_fanyi-36"
                                    style={{
                                        fontSize: 14,
                                    }}
                                />
                            }
                        />
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
