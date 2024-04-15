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
import React, { useState, useContext } from "react";
import { List, Flex, Image, Skeleton, Modal, Button, Typography, Checkbox, Spin } from "antd";
import { TravelNote } from "@/types/definitions";
import StateOperation from "./state-operation";
import { MessageContext } from "@/context/messageContext";
import TimeList from "./time-demo";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

export default function ExamineList({ data, loading }: { data: TravelNote[]; loading: boolean }): JSX.Element {
    const { togglePage, totalDataNumber, pageState } = useContext(MessageContext);

    return (
        <List
            itemLayout="vertical"
            size="large"
            pagination={{
                pageSize: 5,
                total: totalDataNumber[pageState],
                showSizeChanger: false,
                onChange: async (page, pageSize) => {
                    await togglePage(page, pageSize, pageState);
                },
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

    const { addCheckSet, subCheckSet } = useContext(MessageContext);

    const { t, i18n } = useTranslation();

    return (
        <List.Item
            key={item.id}
            actions={!loading ? TimeList(item.state, item.submissionTime, item.modificationTime, item.approvalTime) : undefined}
            extra={
                !loading ? (
                    <Flex>
                        <Image
                            width={200}
                            height={150}
                            alt="logo"
                            src={`/assets/${item.image}`}
                            placeholder={<Spin />}
                        />

                        <StateOperation
                            stateReceived={item.state}
                            id={item.id}
                            rejectReason={item.comment}
                        />
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
                    avatar={
                        <Flex
                            align="center"
                            justify="center"
                        >
                            {item.state === "waiting" && (
                                <Checkbox
                                    checked={item.isChecked}
                                    onChange={(e: CheckboxChangeEvent) => {
                                        if (e.target.checked) {
                                            addCheckSet(item.id);
                                        } else {
                                            subCheckSet(item.id);
                                        }
                                    }}
                                    style={{
                                        marginRight: 3,
                                        marginTop: 5,
                                    }}
                                ></Checkbox>
                            )}
                        </Flex>
                    }
                    title={
                        <Title
                            level={5}
                            style={{ marginTop: 5 }}
                        >
                            {item.title}
                        </Title>
                    }
                    style={{ marginBlockEnd: 5 }}
                />
                {!loading ? (item.content.length > 150 ? item.content.substring(0, 150) + "..." : item.content) : null}
                {!loading && item.content.length > 150 ? (
                    <Button
                        type="link"
                        onClick={() => {
                            setIsModalOpen(true);
                        }}
                    >
                        {t("details")}
                    </Button>
                ) : null}
                <Modal
                    title={t("details")}
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
