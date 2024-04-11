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

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    //
    NavBar,
    SearchBar,
    Space,
} from "antd-mobile";
import {
    //
    SearchOutline,
} from "antd-mobile-icons";

import styles from "./page.module.scss";
import InfiniteScrollContent from "./InfiniteScrollContent";

export default function HomePage() {
    const { t, i18n } = useTranslation();

    const [searching, setSearching] = useState<boolean>(false);
    const [searchInput, setSearchInput] = useState<string>("");

    function onSearchButtonClick() {
        setSearching(true);
    }

    function onSearchBarSearch(value: string) {
        setSearchInput(value);
    }

    function onSearchBarCancel() {
        setSearching(false);
    }

    const nav_bar_right = (
        <div style={{ fontSize: 24 }}>
            <Space style={{ "--gap": "16px" }}>
                <SearchOutline onClick={onSearchButtonClick} />
            </Space>
        </div>
    );

    return (
        <>
            <div className={styles.navbar}>
                <NavBar
                    backArrow={false}
                    right={!searching ? nav_bar_right : undefined}
                >
                    {searching ? (
                        // REF: https://mobile.ant.design/zh/components/search-bar
                        <SearchBar
                            placeholder={t("search.placeholder")}
                            showCancelButton={() => true}
                            onSearch={onSearchBarSearch}
                            onCancel={onSearchBarCancel}
                        />
                    ) : (
                        t("home")
                    )}
                </NavBar>
            </div>
            <div className={styles.content}>
                <InfiniteScrollContent searchInput={searchInput} />
            </div>
        </>
    );
}
