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

// use client
"use client";
import React, { createContext, useState, Fragment, useEffect } from "react";
import { Button, AutoCenter, InfiniteScroll } from "antd-mobile";
import { SafeArea } from "antd-mobile";
import { NavBar, Space, Toast, List, Card } from "antd-mobile";
import { Badge, TabBar, DotLoading } from "antd-mobile";
import { SearchOutline, MoreOutline, CloseOutline, AddOutline } from "antd-mobile-icons";
import { AppOutline, MessageOutline, MessageFill, UnorderedListOutline, UserOutline } from "antd-mobile-icons";
import styles from "./page.module.scss";
import { mockRequest } from "./mock-request";
import InfiniteScrollContent from "./InfiniteScrollContent";

export default function HomePage() {
    const right = (
        <div style={{ fontSize: 24 }}>
            <Space style={{ "--gap": "16px" }}>
                <SearchOutline />
            </Space>
        </div>
    );



    const tabs = [
        {
            key: "home",
            title: "首页",
            icon: <AppOutline />,
            badge: Badge.dot,
            style: { marginRight: "80px" },
        },
        // {
        //     key: "todo",
        //     title: "待办",
        //     icon: <UnorderedListOutline />,
        //     badge: "5",
        // },
        {
            key: "personalCenter",
            title: "我的",
            icon: <UserOutline />,
            style: { marginLeft: "80px" },
        },
    ];

    const [activeKey, setActiveKey] = useState("todo");
    const [hasMore, setHasMore] = useState(true);
    async function loadMore() {
        const append = await mockRequest();
        setHasMore(true);
    }
    const cards = [];
    let i = 0;
    return (
        <>
            <div className={styles.container1}>
                <NavBar
                    right={right}
                    backArrow={false}
                >
                    首页
                </NavBar>
            </div>
                <div className={styles.container}>

                    <InfiniteScrollContent />
                </div>
            <div className={styles.container2}>
                <Button
                    color="primary"
                    fill="solid"
                    className={styles.button}
                >
                    <AddOutline fontSize={"25px"} />
                </Button>

                <TabBar
                    activeKey={activeKey}
                    onChange={setActiveKey}
                >
                    {tabs.map((item) => (
                        <TabBar.Item
                            key={item.key}
                            icon={item.icon}
                            title={item.title}
                            style={item.style}
                        />
                    ))}
                </TabBar>
            </div>
        </>
    );
}
