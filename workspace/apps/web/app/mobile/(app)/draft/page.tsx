// Copyright 2024 lyt
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

// use client
"use client";
import React, { createContext, useState, Fragment, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, NavBar, Space, Badge, TabBar, DotLoading, Avatar } from "antd-mobile";
import { SearchOutline, MoreOutline, CloseOutline, AddOutline, AppOutline, UserOutline } from "antd-mobile-icons";
import styles from "./page.module.scss";
import UserContent from "./UserContent";
import { useTranslation } from "react-i18next";
/**
 * React component for the user profile page.
 *
 * This component represents the user profile page of the application.
 * It includes the user's profile information, content section, and a tab bar for navigation.
 */
export default function Draft() {
    /**
     * Configuration for the tabs in the tab bar.
     * Each tab includes a key, title, icon, and optional styling.
     */
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const [searching, setSearching] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const uid = searchParams.get("uid");

    function onSearchButtonClick() {
        setSearching(true);
    }

    /**
     * 点击游记卡片
     */
    function onCardClick(uid: string) {
        router.push(`/mobile/detail?uid=${uid}`);
    }

    const nav_bar_right = (
        <div style={{ fontSize: 24 }}>
        </div>
    );

    return (
        <>
            <div className={styles.navbar}>
                <NavBar
                    backArrow={false}
                    right={!searching ? nav_bar_right : undefined}
                >
                    {t("Mine")}
                </NavBar>
            </div>
            <div className={styles.content}>
                <UserContent
                    onCardClick = {onCardClick}
                    userUid = {uid}
                />
            </div>
        </>
    );
}
