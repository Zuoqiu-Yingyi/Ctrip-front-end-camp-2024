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
import React, { createContext, useState, Fragment, useEffect } from "react";
import { Button, AutoCenter, InfiniteScroll } from "antd-mobile";
import { SafeArea } from "antd-mobile";
import { NavBar, Space, Toast, List, Card } from "antd-mobile";
import { Badge, TabBar, DotLoading } from "antd-mobile";
import { SearchOutline, MoreOutline, CloseOutline } from "antd-mobile-icons";

export default function InfiniteScrollContent({ hasMore, loadMore }: { hasMore?: boolean; loadMore: () => void }) {
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
                loadMore(); // 当滚动到页面底部时触发加载更多的函数
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [loadMore]);

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
}
