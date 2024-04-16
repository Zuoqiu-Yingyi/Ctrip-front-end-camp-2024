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
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
    //
    NavBar,
    SearchBar,
    Space,
} from "antd-mobile";
import {
    //
    AddSquareOutline,
    CloseCircleOutline,
    SearchOutline,
} from "antd-mobile-icons";

import { useStore } from "@/contexts/store";

import {
    //
    MobileHeader,
    MobileContent,
} from "@/mobile/components/MobileLayout";
import DraftList from "./DraftList";
import NotLoginError from "@/mobile/components/NotLoginError";
import { PATHNAME } from "@/utils/pathname";

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
    const { t } = useTranslation();
    const router = useRouter();
    const { user } = useStore.getState();

    const [searching, setSearching] = useState<boolean>(false);
    const [searchInput, setSearchInput] = useState<string>("");

    function onSearchButtonClick() {
        setSearching(true);
    }

    function onSearchBarCancel() {
        setSearchInput("");
        setSearching(false);
    }

    function onSearchBarSearch(value: string) {
        setSearchInput(value);
    }

    /**
     * 点击游记卡片
     */
    function onCardClick(uid: string) {
        // TODO: 跳转到卡片详情
        // router.push(`/mobile/detail?uid=${uid}`);
    }

    const nav_bar_right = (
        <div style={{ fontSize: 24 }}>
            <Space style={{ "--gap": "16px" }}>
                {searching && (
                    <CloseCircleOutline
                        onClick={onSearchBarCancel}
                        aria-label={t("aria.cancel-search")}
                    />
                )}
                {!searching && (
                    <SearchOutline
                        onClick={onSearchButtonClick}
                        aria-label={t("aria.search")}
                    />
                )}
                {!searching && (
                    <AddSquareOutline
                        onClick={() => {
                            router.push(PATHNAME.mobile.edit)
                        }}
                        aria-label={t("aria.create")}
                    />
                )}
            </Space>
        </div>
    );

    return (
        <>
            <MobileHeader>
                <NavBar
                    backArrow={false}
                    right={nav_bar_right}
                >
                    {searching ? (
                        <SearchBar
                            placeholder={t("search.draft.placeholder")}
                            onSearch={onSearchBarSearch}
                            onCancel={onSearchBarCancel}
                        />
                    ) : (
                        t("draft")
                    )}
                </NavBar>
            </MobileHeader>

            <MobileContent>
                {user.loggedIn ? ( //
                    <DraftList onCardClick={onCardClick} />
                ) : (
                    <NotLoginError />
                )}
            </MobileContent>
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
