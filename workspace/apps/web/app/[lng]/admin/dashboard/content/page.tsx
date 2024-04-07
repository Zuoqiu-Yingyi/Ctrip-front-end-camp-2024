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
import React, { useEffect } from "react";
import { Flex, Divider, FloatButton, Button, Typography } from "antd";
import ExamineList from "@/app/ui/examine-list";
import ListOperationBar from "@/app/ui/list-operation";
import { useContext } from "react";
import { MessageContext } from "@/app/lib/messageContext";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import { useTranslation } from "@/app/i18n/client";

const { Text } = Typography;

export default function ContentPage({ params: { lng } }: { params: { lng: string } }): JSX.Element {
    const { t } = useTranslation(lng);

    const { checkedNumber, displayItems, loading, firstPullData } = useContext(MessageContext);

    useEffect(() => {
        (async () => {
            await firstPullData();
        })();
    }, []);

    return (
        <>
            <ListOperationBar lng={lng} />
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
                    >
                        <Text type="success">{t("pass")}</Text>
                    </Button>
                    <Button
                        type="dashed"
                        icon={<CloseCircleTwoTone twoToneColor="red" />}
                    >
                        <Text type="danger">{t("reject")}</Text>
                    </Button>
                </Flex>
            ) : null}
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
