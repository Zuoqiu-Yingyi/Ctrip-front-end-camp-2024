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

import { ClientContext } from "@/contexts/client";

import styles from "./page.module.scss";
import CardContent from "./CardContent";

/**
 * React component for rendering infinite scroll content with card elements.
 *
 * This component renders a list of card elements inside an infinite scroll container.
 * Each card contains an image, a title, a username, and an avatar.
 *
 * @param hasMore Indicates whether there are more items to load.
 */
const InfiniteContent = ({ hasMore }: { hasMore?: boolean }) => {
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
 * @param onCardClick Function to handle clicking on the card.
 */
export function InfiniteScrollContent({
    //
    searchInput,
    onCardClick,
}: {
    searchInput: string;
    onCardClick: (uid: string) => void;
}): JSX.Element {
    const { trpc } = useContext(ClientContext);
    const cardRefs = useRef<HTMLDivElement[]>([]);
    const [data, setData] = useState<any[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [cursor, setCursor] = useState<string | undefined>();

    const handleSetGridRowEnd = (index: number) => {
        const cardRef = cardRefs.current[index];
        if (!cardRef) return;
        const height = cardRef.offsetHeight;
        if (cardRef && height) {
            cardRef.style.gridRowEnd = `span ${Math.ceil(height)}`;
        }
    };

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
                    const publishs = response.data?.publishs || [];
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
                cursor,
            });
            if (response.code !== 0) {
                throw new Error(response.message);
            }
            const publishs = response.data?.publishs || [];
            // console.debug(publishs);
            if (publishs.length > 0) {
                setHasMore(true);
                setData((val) => [...val, ...publishs]);
                setCursor(publishs.at(-1)!.uid as unknown as string);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.warn(error);
            // REF: https://mobile.ant.design/zh/components/toast
            Toast.show({
                icon: "fail",
                content: String(error),
            });
            setHasMore(false);
        }
    }

    return (
        <div className={styles.container}>
            {data.map((publish) => (
                <CardContent
                    key={publish.uid}
                    uid={publish.uid}
                    coverUid={publish.assets.at(0)?.asset_uid}
                    title={publish.title}
                    avatar={publish.publisher.profile.avatar}
                    username={publish.publisher.name}
                    cardRefs={cardRefs}
                    handleSetGridRowEnd={handleSetGridRowEnd}
                    onClick={onCardClick}
                />
            ))}
            <InfiniteScroll
                loadMore={loadMore}
                hasMore={hasMore}
            >
                <InfiniteContent hasMore={hasMore} />
            </InfiniteScroll>
        </div>
    );
}
export default InfiniteScrollContent;
