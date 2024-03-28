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
import React from "react";
import { Avatar, List, Flex, Image } from "antd";
import { TravelNote } from "../lib/definitions";
import StateOperation from "./state-operation";
import TimeList from "./time-demo";

export default function ExamineList(): JSX.Element {

    const data: TravelNote[] = Array.from({ length: 23 }).map((_, i) => ({
        href: "https://ant.design",
        title: `ant design part ${i}`,
        avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
        content: "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.",
        state: i % 2 == 0 ? "success" : "fail",
    }));

    return (
        <List
            itemLayout="vertical"
            size="large"
            pagination={{
                pageSize: 5,
            }}
            dataSource={data}
            renderItem={(item) => <ExamineListItem {...item} />}
        />
    );
}

export function ExamineListItem(item: TravelNote): JSX.Element {
    return (
        <List.Item
            key={item.title}
            actions={TimeList()}
            extra={
                <Flex>
                    <Image
                        width={200}
                        alt="logo"
                        src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                    />
                    <StateOperation stateReceived={item.state} />
                </Flex>
            }
        >
            <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                title={<a href={item.href}>{item.title}</a>}
            />
            {item.content}
        </List.Item>
    );
}
