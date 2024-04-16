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
    useState,
    useContext,
} from "react";
import {
    //
    InfiniteScroll,
    Footer,
    DotLoading,
} from "antd-mobile";
import { useTranslation } from "react-i18next";

import { useStore } from "@/contexts/store";
import { ClientContext } from "@/contexts/client";
import PullRefresh from "@/mobile/components/PullRefresh";

import styles from "./page.module.scss";
import DraftCard from "./DraftCard";
import {
    //
    handleError,
    handleResponse,
} from "@/utils/message";
import type { IDraft } from "@/types/response";

export function InfiniteScrollDirect({ hasMore }: { hasMore?: boolean }) {
    const { t } = useTranslation();

    return (
        <Footer
            label={
                hasMore ? (
                    <>
                        {t("loading")}
                        <DotLoading />
                    </>
                ) : (
                    t("empty.description")
                )
            }
        />
    );
}

export function DraftList({
    //
    onCardClick,
}: {
    onCardClick: (uid: string) => void;
}): JSX.Element {
    const { trpc } = useContext(ClientContext);
    const {
        //
        user,
        drafts,
        setDrafts,
    } = useStore.getState();

    const [data, setData] = useState<IDraft[]>([]);
    const [hasMore, setHasMore] = useState(user.loggedIn);
    const [reload, setReload] = useState(true);
    const [cursor, setCursor] = useState<number>(0);

    const count = 16; // 一次动态加载数量

    async function loadMore() {
        // console.debug("loadMore");
        setHasMore(false);

        /* 将数据加载至 store */
        if (reload) {
            try {
                setReload(false);

                const response = await trpc.draft.list.query({});
                handleResponse(response);
                const _drafts: IDraft[] = (response.data?.drafts as any[]) || [];
                setDrafts(_drafts);
            } catch (error) {
                handleError(error);
            }
        }

        /* 从 store 加载内容 */
        if (cursor > drafts.length) {
            setHasMore(false);
        } else {
            const end = cursor + count;
            const _data = drafts.slice(0, end);
            setData(_data);
            setCursor(end);
            setHasMore(true);
        }
    }

    return (
        <PullRefresh
            onRefresh={async () => {
                // console.debug("onRefresh");
                // 下拉刷新
                setReload(true);
                setCursor(0);
                loadMore();
            }}
        >
            <div className={styles.cards}>
                {data.map((draft) => (
                    <DraftCard
                        key={draft.id}
                        coverUid={draft.assets.at(0)!.asset_uid}
                        title={draft.title}
                        content={draft.content}
                        onClick={onCardClick}
                    />
                ))}
                <InfiniteScroll
                    loadMore={loadMore}
                    hasMore={hasMore}
                >
                    <InfiniteScrollDirect hasMore={hasMore} />
                </InfiniteScroll>
            </div>
        </PullRefresh>
    );
}
export default DraftList;
