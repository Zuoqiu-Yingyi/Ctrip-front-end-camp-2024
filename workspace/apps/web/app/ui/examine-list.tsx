/**
 * Copyright (C) 2024 wu
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import React, { useState, useContext } from "react";
import { List, Flex, Image, Skeleton, Modal, Button, Typography, Checkbox, Spin } from "antd";
import { TravelNote } from "@/types/definitions";
import StateOperation from "./state-operation";
import { MessageContext } from "@/contexts/messageContext";
import TimeList from "./time-demo";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { useTranslation } from "react-i18next";
import { uid2path } from "@/utils/image";

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

    const { t } = useTranslation();

    return (
        <List.Item
            key={item.id}
            actions={!loading ? TimeList(item.state, item.submissionTime, item.modificationTime, item.approvalTime, t) : undefined}
            extra={
                !loading ? (
                    <Flex>
                        <Image
                            width={200}
                            height={150}
                            alt="logo"
                            src={uid2path(item.image)}
                            placeholder={<Spin />}
                        />

                        <StateOperation
                            stateReceived={item.state}
                            id={item.id}
                            rejectReason={item.comment}
                            uid={item.publishUId}
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
