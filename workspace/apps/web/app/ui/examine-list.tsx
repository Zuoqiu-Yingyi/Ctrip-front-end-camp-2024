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
import React, { useState } from "react";
import { Avatar, List, Flex, Image, Skeleton, Modal, Button, Typography } from "antd";
import { TravelNote } from "../lib/definitions";
import StateOperation from "./state-operation";
import TimeList from "./time-demo";

const {Title} = Typography;

export default function ExamineList({ data, loading }: { data: TravelNote[]; loading: boolean }): JSX.Element {
    return (
        <List
            itemLayout="vertical"
            size="large"
            pagination={{
                pageSize: 5,
            }}
            dataSource={data}
            renderItem={(item) => (
                <ExamineListItem
                    item={item}
                    loading={loading}
                />
            )}
        />
    );
}

export function ExamineListItem({ item, loading }: { item: TravelNote; loading: boolean }): JSX.Element {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <List.Item
            key={item.title}
            actions={!loading ? TimeList() : undefined}
            extra={
                !loading ? (
                    <Flex>
                        <Image
                            width={200}
                            height={150}
                            alt="logo"
                            src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                        />
                        <StateOperation stateReceived={item.state} />
                    </Flex>
                ) : undefined
            }
        >
            <Skeleton
                loading={loading}
                active
                avatar
            >
                <List.Item.Meta
                    avatar={<Avatar src={item.avatar} />}
                    title={
                        <Title level={5} style={{marginTop: 5}}>
                            {item.description}
                        </Title>
                    }
                    // description={item.title}
                    style={{marginBlockEnd: 5}}
                />
                {!loading ? (item.content.length > 150 ? item.content.substring(0, 150) + "..." : item.content) : null}
                {!loading && item.content.length > 150 ? (
                    <Button
                        type="link"
                        onClick={() => {
                            setIsModalOpen(true);
                        }}
                    >
                        详情
                    </Button>
                ) : null}
                <Modal
                    title="内容详情"
                    open={isModalOpen}
                    onCancel={() => {
                        setIsModalOpen(false);
                    }}
                    footer={[]}
                    width={500}
                >
                    {item.content}
                </Modal>
            </Skeleton>
        </List.Item>
    );
}
