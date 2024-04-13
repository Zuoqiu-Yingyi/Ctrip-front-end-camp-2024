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
import { CheckCircleFilled, ExclamationCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import React, { useContext, useState } from "react";
import { Flex, Typography, Button, Popconfirm, Spin, notification } from "antd";
import { MessageContext } from "@/context/messageContext";
import RejectModal from "@/ui/reject-modal";
import { AuthContext } from "../context/authContext";
import { useTranslation } from "react-i18next";

const { Title, Paragraph } = Typography;

type NotificationType = "success" | "error";

export default function StateOperation({ stateReceived, id, rejectReason }: { stateReceived: "success" | "fail" | "waiting"; id: number; rejectReason?: string }): JSX.Element {
    const { operateReview, delTravelNote } = useContext(MessageContext);

    const { user, userInfo } = useContext(AuthContext);

    const { t, i18n } = useTranslation();

    const [api] = notification.useNotification();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [singleLoading, setSingleLoading] = useState(false);

    let type: "secondary" | "success" | "warning" | "danger" = "secondary";

    let icon: React.ReactNode = null;

    let text: string = "error";

    if (stateReceived === "success") {
        type = "success";
        icon = <CheckCircleFilled className="mr-2" />;
        text = t("approved");
    } else if (stateReceived === "fail") {
        type = "danger";
        icon = <CloseCircleFilled className="mr-2" />;
        text = t("rejected");
    } else {
        type = "warning";
        icon = <ExclamationCircleFilled className="mr-2" />;
        text = t("pending");
    }

    const openNotification = (type: NotificationType) => {
        api[type]({
            placement: "bottomLeft",
            message: type === "success" ? "审核成功" : "审核失败",
        });
    };

    const handleOk = async (reason: string) => {
        setIsModalOpen(false);

        setSingleLoading(true);
        try {
            await operateReview(id, "reject", reason);
            openNotification("success");
        } catch (error) {
            openNotification("error");
        }
        setSingleLoading(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <Flex
            vertical
            style={{ width: 130, justifyContent: "space-around", alignItems: "center", marginLeft: 20 }}
        >
            {userInfo.current?.accessRole === 1 && (
                <Popconfirm
                    title={t("delete")}
                    description={t("delete-tip")}
                    onCancel={() => {
                        delTravelNote();
                    }}
                    okText={t("confirmed")}
                    cancelText={t("cancel")}
                >
                    <Button
                        danger
                        size="small"
                        style={{ marginLeft: 90 }}
                    >
                        {t("delete")}
                    </Button>
                </Popconfirm>
            )}

            <Title
                level={4}
                type={type}
                style={{ marginTop: 10 }}
            >
                {icon}
                {text}
            </Title>
            {stateReceived === "waiting" && (
                <Flex gap="small">
                    {singleLoading && <Spin />}
                    <Button
                        loading={singleLoading}
                        onClick={async () => {
                            setSingleLoading(true);
                            try {
                                await operateReview(id, "pass");
                                openNotification('success');
                            } catch (error) {
                                openNotification('error');                                
                            }  
                            setSingleLoading(false); 
                        }}
                    >
                        {t("pass")}
                    </Button>
                    <Button
                        loading={singleLoading}
                        onClick={() => {
                            setIsModalOpen(true);
                        }}
                    >
                        {t("reject")}
                    </Button>
                    <RejectModal
                        isModalOpen={isModalOpen}
                        handleOk={handleOk}
                        handleCancel={handleCancel}
                    />
                </Flex>
            )}

            {stateReceived === "fail" ? <Paragraph className="w-32">{rejectReason}</Paragraph> : null}
        </Flex>
    );
}
