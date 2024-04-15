/**
 * Copyright (C) 2024 lyt
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
    Suspense,
    useState,
} from "react";
import {
    //
    useRouter,
    useSearchParams,
} from "next/navigation";
import { NavBar } from "antd-mobile";
import { useTranslation } from "react-i18next";

import styles from "./page.module.scss";
import UserContent from "./UserContent";

/**
 * React component for the user profile page.
 *
 * This component represents the user profile page of the application.
 * It includes the user's profile information, content section, and a tab bar for navigation.
 */
export function Draft() {
    /**
     * Configuration for the tabs in the tab bar.
     * Each tab includes a key, title, icon, and optional styling.
     */
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const [searching, setSearching] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const uid = searchParams.get("uid");

    /**
     * 点击游记卡片
     */
    function onCardClick(uid: string) {
        router.push(`/mobile/detail?uid=${uid}`);
    }

    const nav_bar_right = <div style={{ fontSize: 24 }}></div>;

    return (
        <>
            <div className={styles.navbar}>
                <NavBar
                    backArrow={false}
                    right={!searching ? nav_bar_right : undefined}
                >
                    {t("draft")}
                </NavBar>
            </div>
            <div className={styles.content}>
                <UserContent onCardClick={onCardClick} />
            </div>
        </>
    );
}

export function DraftPage() {
    return (
        <Suspense>
            <Draft />
        </Suspense>
    );
}
export default DraftPage;
