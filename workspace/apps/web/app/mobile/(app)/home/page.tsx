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
    Popover,
    SearchBar,
    Space,
} from "antd-mobile";
import {
    CloseCircleOutline,
    MoreOutline,
    //
    SearchOutline,
} from "antd-mobile-icons";

import {
    //
    MobileHeader,
    MobileContent,
} from "@/mobile/components/MobileLayout";
import PublishList from "./PublishList";
import { useStore } from "@/contexts/store";
import TitleBarMenu from "@/mobile/components/TitleBarMenu";

export default function HomePage() {
    const { t } = useTranslation();
    const { mode } = useStore.getState();

    const [searching, setSearching] = useState<boolean>(false);
    const [searchInput, setSearchInput] = useState<string>("");

    function onSearchButtonClick() {
        setSearching(true);
    }

    function onSearchBarSearch(value: string) {
        setSearchInput(value);
    }

    function onSearchBarCancel() {
        setSearchInput("");
        setSearching(false);
    }

    const nav_bar_right = (
        <TitleBarMenu>
            {searching ? (
                <CloseCircleOutline
                    onClick={onSearchBarCancel}
                    aria-label={t("aria.cancel-search")}
                />
            ) : (
                // REF: https://mobile.ant.design/zh/components/popover
                <Popover.Menu
                    actions={[
                        {
                            icon: <SearchOutline />,
                            text: t("labels.search"),
                            onClick: onSearchButtonClick,
                        },
                    ]}
                    mode={mode}
                    trigger="click"
                    placement="bottom-end"
                >
                    <MoreOutline aria-label={t("aria.menu")} />
                </Popover.Menu>
            )}
        </TitleBarMenu>
    );

    return (
        <>
            <MobileHeader>
                <NavBar
                    backArrow={false}
                    right={nav_bar_right}
                >
                    {searching ? (
                        // REF: https://mobile.ant.design/zh/components/search-bar
                        <SearchBar
                            placeholder={t("search.publish.placeholder")}
                            onSearch={onSearchBarSearch}
                            onCancel={onSearchBarCancel}
                        />
                    ) : (
                        t("home")
                    )}
                </NavBar>
            </MobileHeader>
            <MobileContent>
                <PublishList searchInput={searchInput} />
            </MobileContent>
        </>
    );
}
