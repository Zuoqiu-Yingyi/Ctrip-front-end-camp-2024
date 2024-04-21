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

import {
    //
    useState,
    useEffect,
} from "react";
import {
    //
    useRouter,
    usePathname,
} from "next/navigation";
import { useTranslation } from "react-i18next";

import { TabBar } from "antd-mobile";
import {
    //
    AppOutline,
    UnorderedListOutline,
    UserOutline,
} from "antd-mobile-icons";

import { MobileFooter } from "@/mobile/components/MobileLayout";
import { PATHNAME } from "@/utils/pathname";

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
    // REF: https://react.i18next.com/guides/quick-start#using-the-hook
    const { t } = useTranslation();

    // REF: https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#userouter-hook
    const router = useRouter();
    const pathname = usePathname();
    const [activeKey, setActiveKey] = useState(TabBarKey.home);

    useEffect(() => {
        // console.debug(pathname);
        switch (pathname) {
            default:
            case PATHNAME.mobile.home:
                setActiveKey(TabBarKey.home);
                break;
            case PATHNAME.mobile.draft:
                setActiveKey(TabBarKey.draft);
                break;
            case PATHNAME.mobile.user:
                setActiveKey(TabBarKey.user);
                break;
        }
    }, [pathname]);

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
            title: t("me"),
            icon: <UserOutline />,
            // badge: Badge.dot,
            style: {},
        },
    ];

    function onTabBarChange(key: string) {
        setActiveKey(key as TabBarKey);
        switch (key as TabBarKey) {
            case TabBarKey.home:
                router.replace(PATHNAME.mobile.home);
                break;
            case TabBarKey.draft:
                router.replace(PATHNAME.mobile.draft);
                break;
            case TabBarKey.user:
                router.replace(PATHNAME.mobile.user);
                break;

            default:
                break;
        }
    }

    return (
        <>
            {children}
            <MobileFooter>
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
            </MobileFooter>
        </>
    );
}
export default AppLayout;
