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

import { sleep } from "antd-mobile/es/utils/sleep";
import React, { createContext, useState, Fragment, useEffect } from "react";
import { Button, AutoCenter, InfiniteScroll } from "antd-mobile";
import { SafeArea } from "antd-mobile";
import { NavBar, Space, Toast, List, Card } from "antd-mobile";
import styles from "./page.module.scss";

let count = 0

export async function mockRequest() {
    // 假设您希望每次加载 5 个卡片
    const cards = [];
    for (let i = 0; i < 5; i++) {
        cards.push(
            <Card
                key={i}
                headerStyle={{
                    color: "#1677ff",
                }}
                bodyClassName={styles.customBody}
                title="卡片标题"
            >
                卡片内容
            </Card>,
        );
    }
    return cards;
}
