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
import { Button, AutoCenter, InfiniteScroll } from "antd-mobile";
import { NavBar, Space, Toast, List, Card, Badge, TabBar, DotLoading } from "antd-mobile";
import { SearchOutline, MoreOutline, CloseOutline } from "antd-mobile-icons";
import { AppOutline, MessageOutline, MessageFill, UnorderedListOutline, UserOutline } from "antd-mobile-icons";
import styles from "./page.module.scss";
import UserCard from "./UserCard";
import { mockRequest } from "./mock-request";

const InfiniteScrollContent = ({ hasMore }: { hasMore?: boolean }) => {
    return (
        <>
            {hasMore ? (
                <>
                    <span>Loading</span>
                    <DotLoading />
                </>
            ) : (
                <span>--- 我是有底线的 ---</span>
            )}
        </>
    );
};

export default () => {
  
    type Data = 

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
        <div className={styles.container4}>
            {data.map((publish, index) => (
                <UserCard
                    key={index}
                    imageUrl={publish!.asset[0].asset_uid}
                    title={publish!.draft!.title}
                    username={publish!.draft!.author_id}
                    avatarUrl={publish!.asset[0].asset_uid}
                />
            ))}
            <InfiniteScroll
                loadMore={loadMore}
                hasMore={hasMore}
            >
                <InfiniteScrollContent hasMore={hasMore} />
            </InfiniteScroll>
        </div>
    );
};
