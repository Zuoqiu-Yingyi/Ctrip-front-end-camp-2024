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
import { NavBar, Space, Toast, List, Card, Badge, TabBar, DotLoading, Avatar } from "antd-mobile";
import { SearchOutline, MoreOutline, CloseOutline, AddOutline } from "antd-mobile-icons";
import { AppOutline, MessageOutline, MessageFill, UnorderedListOutline, UserOutline } from "antd-mobile-icons";
import styles from "./page.module.scss";
import UserContent from "./UserContent";


/**
 * React component for the user profile page.
 * 
 * This component represents the user profile page of the application.
 * It includes the user's profile information, content section, and a tab bar for navigation.
 */
export default function User() {
    /**
     * Configuration for the tabs in the tab bar.
     * Each tab includes a key, title, icon, and optional styling.
     */
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
    return (
        <div style={{ width: "100%", margin: "0 auto" }}>
            <div className={styles.usertitle}>
                <Avatar
                    src={""}
                    style={{ "--size": "40px", "--border-radius": "50%", marginLeft: "10px" }}
                    fallback={true}
                />
                <div className={styles.usermessage}>
                    <p className={styles.username}>我叫XXXXXXXXX</p>
                    <p className={styles.userid}>用户ID:1111111</p>
                </div>
                <Button className={styles.editbutton}>编辑资料</Button>
            </div>

            <div>
                <UserContent></UserContent>
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
        </div>
    );
}

