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
    useRef,
    useState,
    useEffect,
    useContext,
} from "react";
import { useTranslation } from "react-i18next";
import {
    //
    InfiniteScroll,
    AutoCenter,
    DotLoading,
    ErrorBlock,
    Toast,
} from "antd-mobile";

import {
    //
    handleError,
    handleResponse,
} from "@/utils/message";

import PullRefresh from "@/mobile/components/PullRefresh";
import { ClientContext } from "@/contexts/client";

import styles from "./page.module.scss";
import CardContent from "./PublishCard";

import type { IPublish } from "@/types/response";

/**
 * React component for rendering infinite scroll content with card elements.
 *
 * This component renders a list of card elements inside an infinite scroll container.
 * Each card contains an image, a title, a username, and an avatar.
 *
 * @param hasMore Indicates whether there are more items to load.
 */
const InfiniteScrollDirect = ({ hasMore }: { hasMore?: boolean }) => {
    const { t } = useTranslation();

    return (
        <>
            {hasMore ? (
                <AutoCenter>
                    <span>{t("loading")}</span>
                    <DotLoading />
                </AutoCenter>
            ) : (
                <ErrorBlock
                    status="empty"
                    title={t("empty.description")}
                />
            )}
        </>
    );
};

/**
 * @param searchInput The search input value.
 */
export function PublishList({
    //
    searchInput,
}: {
    searchInput: string;
}): JSX.Element {
    const { t } = useTranslation();
    const { trpc } = useContext(ClientContext);

    const [data, setData] = useState<IPublish[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [reload, setReload] = useState(true);
    const [cursor, setCursor] = useState<string | undefined>();

    useEffect(() => {
        if (searchInput) {
            (async () => {
                try {
                    const response = await trpc.publish.search.query({
                        key: searchInput,
                    });
                    if (response.code !== 0) {
                        throw new Error(response.message);
                    }
                    const publishs: IPublish[] = (response.data?.publishs as any[]) || [];
                    setData(publishs);
                    setHasMore(false);
                } catch (error) {
                    console.warn(error);
                    // REF: https://mobile.ant.design/zh/components/toast
                    Toast.show({
                        icon: "fail",
                        content: String(error),
                    });
                    setHasMore(false);
                }
            })();
        } else {
            setCursor(undefined);
            setData([]);
            setHasMore(true);
        }
    }, [searchInput]);

    async function loadMore() {
        // console.debug("loadMore");
        try {
            // console.debug(cursor);
            const response = await trpc.publish.paging.query({
                skip: cursor ? 1 : 0,
                cursor: reload ? undefined : cursor,
            });
            handleResponse(response);
            const publishs: IPublish[] = (response.data?.publishs as any[]) || [];
            // console.debug(publishs);
            if (publishs.length > 0) {
                setHasMore(true);
                if (reload) {
                    setReload(false);
                    // @ts-ignore
                    setData(publishs);
                } else {
                    setData((val) => [...val, ...publishs]);
                }
                setCursor(publishs.at(-1)!.uid as unknown as string);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            handleError(error);
            setHasMore(false);
        }
    }

    /* REF: https://mobile.ant.design/zh/components/pull-to-refresh/ */
    return (
        <PullRefresh
            onRefresh={async () => {
                // console.debug("onRefresh");
                // 下拉刷新
                setReload(true);
                setCursor(undefined);
                loadMore();
            }}
        >
            <div className={styles.cards}>
                {data.map((publish, index) => (
                    <CardContent
                        key={publish.uid}
                        uid={publish.uid}
                        coverUid={publish.assets.at(0)?.asset_uid ?? null}
                        title={publish.title}
                        avatar={publish.publisher.profile.avatar}
                        username={publish.publisher.name}
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
export default PublishList;
