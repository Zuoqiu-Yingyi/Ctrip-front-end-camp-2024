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

// InfiniteScrollContent.tsx

"use client";
import React, { useRef, useEffect, useState } from "react";
import { InfiniteScroll, List, DotLoading, Card, Image, Avatar } from "antd-mobile";
import { mockRequest } from "./mock-request";
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
    return (
        <>
            {hasMore ? (
                <>
                    <span>Loading</span>
                    <DotLoading />
                </>
            ) : (
                <span>--- 没有更多内容了 ---</span>
            )}
        </>
    );
};

export default () => {
    const cardRefs = useRef<HTMLDivElement[]>([]);
    const handleSetGridRowEnd = (index: number) => {
        const cardRef = cardRefs.current[index];
        if (!cardRef) return;
        const height = cardRef!.offsetHeight;
        if (cardRef && height) {
            cardRef.style.gridRowEnd = `span ${Math.ceil(height)}`;
        }
    };

    type Data = {
        [x: string]: {
            deleted: boolean;
            createdAt: string;
            updatedAt: string;
            index: number;
            asset_uid: string;
            publish_id: number;

        }[];
    };

    const [data, setData] = useState<Data[]>([]);
    // const [data, setData] = useState<string[]>([])
    const [hasMore, setHasMore] = useState(true);

    async function loadMore() {
        const append = await mockRequest();
        setData((val) => [...val, ...(append || [])]);
        setHasMore(append!.length > 0);
    }
    //     const assetsThis = thisPublish.data?.publishs[0]!.assets;
    // thisPublish.data?.publishs[0]!.draft!.author_id;
    return (
        <div className={styles.container3}>
            {data.map((publish, index) => (
                <CardContent
                    key={index}
                    imageUrl={publish!.asset[0].asset_uid}
                    title={publish!.draft!.title}
                    username={publish!.draft!.author_id}
                    avatarUrl={publish!.asset[0].asset_uid}
                    aspectRatio="1.5"
                    cardRefs={cardRefs}
                    handleSetGridRowEnd={handleSetGridRowEnd}
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
};
