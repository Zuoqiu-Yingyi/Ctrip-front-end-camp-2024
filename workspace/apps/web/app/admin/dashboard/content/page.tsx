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

"use client";
import React, { useEffect, useRef, useState } from "react";
import { Flex, Divider, FloatButton, Button, Typography, Spin, notification } from "antd";
import ExamineList from "@/ui/examine-list";
import ListOperationBar from "@/ui/list-operation";
import { useContext } from "react";
import { MessageContext } from "@/contexts/messageContext";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import RejectModal from "@/ui/reject-modal";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

type NotificationType = "success" | "error";

export default function ContentPage(): JSX.Element {
    const { t } = useTranslation();

    const { checkedNumber, displayItems, loading, firstPullData, operateBatchReview, onSearch } = useContext(MessageContext);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [api] = notification.useNotification();

    const [batchLoading, setBatchLoading] = useState(false);

    const flag = useRef(true);

    useEffect(() => {
        if (flag.current) {
            flag.current = false;

            (async () => {
                await firstPullData("waiting");
            })();
        }
    }, []);

    const openNotification = (type: NotificationType) => {
        if (type === "success") {
            notification.success({
                message: t("audit-status.success"),
                placement: "bottomLeft",
            });
        } else {
            notification.error({
                message: t("audit-status.fail"),
                placement: "bottomLeft",
            });
        }
    };

    const handleOk = async (reason: string) => {
        setIsModalOpen(false);

        setBatchLoading(true);
        try {
            await operateBatchReview("reject", reason);
            openNotification("success");
        } catch (error) {
            openNotification("error");
        }
        setBatchLoading(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <ListOperationBar />
            <Divider />
            {checkedNumber !== 0 ? (
                <Flex
                    gap="small"
                    wrap="wrap"
                    style={{ marginLeft: 20 }}
                >
                    <Button
                        type="dashed"
                        icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}
                        loading={batchLoading}
                        onClick={async () => {
                            setBatchLoading(true);
                            try {
                                await operateBatchReview("pass");
                                openNotification("success");
                            } catch (error) {
                                openNotification("error");
                            }
                            setBatchLoading(false);
                        }}
                    >
                        <Text type="success">{t("pass")}</Text>
                    </Button>
                    <Button
                        type="dashed"
                        icon={<CloseCircleTwoTone twoToneColor="red" />}
                        loading={batchLoading}
                        onClick={() => {
                            setIsModalOpen(true);
                        }}
                    >
                        <Text type="danger">{t("reject")}</Text>
                    </Button>
                    {batchLoading && <Spin />}
                    <RejectModal
                        isModalOpen={isModalOpen}
                        handleOk={handleOk}
                        handleCancel={handleCancel}
                    />
                </Flex>
            ) : null}
            {onSearch && <Spin />}
            <ExamineList
                data={displayItems}
                loading={loading}
            />

            <FloatButton.Group
                shape="circle"
                style={{ right: 5 }}
            >
                {checkedNumber !== 0 ? <FloatButton badge={{ count: checkedNumber, size: "small", offset: [-2, 2] }} /> : null}
                <FloatButton.BackTop visibilityHeight={0} />
            </FloatButton.Group>
        </>
    );
}
