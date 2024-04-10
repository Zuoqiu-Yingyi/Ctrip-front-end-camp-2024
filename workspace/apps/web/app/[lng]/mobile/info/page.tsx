// Copyright 2024 wu
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
"use client"

import { Flex, Typography } from "antd";
import { NavBar, Toast, Avatar } from "antd-mobile";
import React from "react";
import { List } from "antd-mobile";
import { UnorderedListOutline, PayCircleOutline, SetOutline } from "antd-mobile-icons";

export default function InfoPage(): JSX.Element {
    return (
        <>
            <NavBar>资料</NavBar>
            <Flex vertical={true}>
                <Flex 
                className="my-8"
                align="center"
                justify="center"
                style={{
                    width: "100%"
                }}>
                    <Avatar
                        src=""
                        style={{ "--size": "64px" }}
                    />                    
                </Flex>

                <List>
                    <List.Item
                        onClick={() => {}}
                    >
                        用户名
                    </List.Item>
                    <List.Item
                        onClick={() => {}}
                    >
                        id
                    </List.Item>
                    <List.Item
                        onClick={() => {}}
                    >
                        描述
                    </List.Item>
                </List>
            </Flex>
        </>
    );
}
