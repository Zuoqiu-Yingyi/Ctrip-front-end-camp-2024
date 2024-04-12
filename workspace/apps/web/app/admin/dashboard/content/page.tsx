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
"use client";
import React, { useEffect, useState } from "react";
import { Flex, Divider, FloatButton, Button, Typography, Spin  } from "antd";
import ExamineList from "@/ui/examine-list";
import ListOperationBar from "@/ui/list-operation";
import { useContext } from "react";
import { MessageContext } from "@/context/messageContext";

import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import RejectModal from "@/ui/reject-modal";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

export default function ContentPage(): JSX.Element {
    const { t, i18n } = useTranslation();

    const { checkedNumber, displayItems, loading, firstPullData, operateBatchReview, onSearch } = useContext(MessageContext);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOk = async (reason: string) => {
        await operateBatchReview("reject", reason);

        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        (async () => {
            await firstPullData("waiting");
        })();
    }, []);

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
                        onClick={async () => {
                            await operateBatchReview("pass");
                        }}
                    >
                        <Text type="success">
                            {t("pass")}
                            </Text>
                    </Button>
                    <Button
                        type="dashed"
                        icon={<CloseCircleTwoTone twoToneColor="red" />}
                        onClick={() => {
                            setIsModalOpen(true);
                        }}
                    >
                        <Text type="danger">
                            {t("reject")}
                            </Text>
                    </Button>
                    <RejectModal isModalOpen={isModalOpen} handleOk={handleOk} handleCancel={handleCancel}/>
                </Flex>
            ) : null}
            {onSearch && (<Spin />)}            
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
