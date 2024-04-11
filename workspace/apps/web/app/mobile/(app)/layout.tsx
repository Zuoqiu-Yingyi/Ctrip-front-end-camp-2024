/**
 * Copyright (C) 2024 Zuoqiu Yingyi
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

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { TabBar } from "antd-mobile";
import {
    //
    AppOutline,
    UnorderedListOutline,
    UserOutline,
} from "antd-mobile-icons";

import "./global.scss";
import styles from "./layout.module.scss";

export enum TabBarKey {
    home = "home", // 首页
    draft = "draft", // 草稿
    user = "user", // 我的
}

export function AppLayout({
    //
    children,
}: {
    children: React.ReactNode;
}): JSX.Element {
    // REF: https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#userouter-hook
    const router = useRouter();
    const [activeKey, setActiveKey] = useState(TabBarKey.home);

    // REF: https://react.i18next.com/guides/quick-start#using-the-hook
    const { t, i18n } = useTranslation();

    // REF: https://mobile.ant.design/zh/components/tab-bar
    const tabs = [
        {
            key: TabBarKey.home,
            title: t("home"),
            icon: <AppOutline />,
            // badge: Badge.dot,
            style: {},
        },
        {
            key: TabBarKey.draft,
            title: t("draft"),
            icon: <UnorderedListOutline />,
            // badge: Badge.dot,
            style: {},
        },
        {
            key: TabBarKey.user,
            title: t("user"),
            icon: <UserOutline />,
            // badge: Badge.dot,
            style: {},
        },
    ];

    function onTabBarChange(key: string) {
        setActiveKey(key as TabBarKey);
        switch (key as TabBarKey) {
            case TabBarKey.home:
            case TabBarKey.draft:
            case TabBarKey.user:
                router.replace(`/mobile/${key}`);
                break;

            default:
                break;
        }
    }

    return (
        <>
            {children}
            <div className={styles.footer}>
                <TabBar
                    activeKey={activeKey}
                    onChange={onTabBarChange}
                >
                    {tabs.map((item) => (
                        <TabBar.Item
                            key={item.key}
                            icon={item.icon}
                            title={item.title}
                            style={item.style}
                        />
                    ))}
                </TabBar>
            </div>
        </>
    );
}
export default AppLayout;
