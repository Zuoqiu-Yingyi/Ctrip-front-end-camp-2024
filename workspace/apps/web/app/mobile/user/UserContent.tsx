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
import CardContent from "../home/CardContent";



const demoSrc = "https://images.unsplash.com/photo-1567945716310-4745a6b7844b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=60";
const demoSrc2 = "https://images.unsplash.com/photo-1620476214170-1d8080f65cdb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3150&q=80";
const demoSrc3 = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRORGWNUiF7QLWfW8eMdlXSjhYKPThiNQ_gz4Tb-8pcWw&s";
const demoSrc4 = "https://farmerstation-aws.hmgcdn.com/files/article/a0/41/ASUB_41_181_20230913045850_122568.jpg";
const demoSrc5 = "https://pic.chaopx.com/chao_water_pic/23/03/03/7283d6a2d4b14777faa74472a3199177.jpg";


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
    const cardRefs = useRef<HTMLDivElement[]>([]);

    const handleSetGridRowEnd = (index: number) => {
        const cardRef = cardRefs.current[index];
        if (!cardRef) return;
        const height = cardRef!.offsetHeight;
        if (cardRef && height) {
            cardRef.style.gridRowEnd = `span ${Math.ceil(height)}`;
        }
    };

    return (
        <div className={styles.container3}>
            <CardContent
                imageUrl={demoSrc5}
                title="ExampleTitleExampleTitleExampleTitleExampleTitleExampleTitleExample TitleExample Title"
                username="exampleuser"
                avatarUrl="avatar.jpg"
                aspectRatio="1.5"
                cardRefs={cardRefs}
                handleSetGridRowEnd={handleSetGridRowEnd}
            />
            <CardContent
                imageUrl={demoSrc}
                title="ExampleTitleExampleTitleExampleTitleExampleTitleExampleTitleExample TitleExample Title"
                username="exampleuser"
                avatarUrl="avatar.jpg"
                aspectRatio="0.8"
                cardRefs={cardRefs}
                handleSetGridRowEnd={handleSetGridRowEnd}
            />
            <CardContent
                imageUrl={demoSrc3}
                title="ExampleTitleExampleTitleExampleTitleExampleTitleExampleTitleExample TitleExample Title"
                username="exampleuser"
                avatarUrl="avatar.jpg"
                aspectRatio="1.5"
                cardRefs={cardRefs}
                handleSetGridRowEnd={handleSetGridRowEnd}
            />
            <CardContent
                imageUrl={demoSrc2}
                title="ExampleTitleExampleTitleExampleTitleExampleTitleExampleTitleExample TitleExample Title"
                username="exampleuser"
                avatarUrl="avatar.jpg"
                aspectRatio="1.5"
                cardRefs={cardRefs}
                handleSetGridRowEnd={handleSetGridRowEnd}
            />
            <CardContent
                imageUrl={demoSrc5}
                title="ExampleTitleExampleTitleExampleTitleExampleTitleExampleTitleExample TitleExample Title"
                username="exampleuser"
                avatarUrl="avatar.jpg"
                aspectRatio="1.5"
                cardRefs={cardRefs}
                handleSetGridRowEnd={handleSetGridRowEnd}
            />
            <CardContent
                imageUrl={demoSrc5}
                title="ExampleTitleExampleTitleExampleTitleExampleTitleExampleTitleExample TitleExample Title"
                username="exampleuser"
                avatarUrl="avatar.jpg"
                aspectRatio="1.5"
                cardRefs={cardRefs}
                handleSetGridRowEnd={handleSetGridRowEnd}
            />
            <CardContent
                imageUrl={demoSrc5}
                title="ExampleTitleExampleTitleExampleTitleExampleTitleExampleTitleExample TitleExample Title"
                username="exampleuser"
                avatarUrl="avatar.jpg"
                aspectRatio="1.5"
                cardRefs={cardRefs}
                handleSetGridRowEnd={handleSetGridRowEnd}
            />
        </div>
    );
};
