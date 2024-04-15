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
import { Flex, Typography, Input, Button, Popconfirm } from "antd";
import { MessageContext } from "@/app/lib/messageContext";
import RejectModal from "@/app/ui/reject-modal";
import { AuthContext } from "../lib/authContext";
// import { passSingleReview } from "@/app/utils/review";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

export default function StateOperation({ stateReceived, id }: { stateReceived: "success" | "fail" | "waiting"; id: number }): JSX.Element {
    const { operateReview, delTravelNote } = useContext(MessageContext);

    const { user, userInfo } = useContext(AuthContext);

    const [isModalOpen, setIsModalOpen] = useState(false);

    let type: "secondary" | "success" | "warning" | "danger" = "secondary";

    let icon: React.ReactNode = null;

    let text: string = "error";

    if (stateReceived === "success") {
        type = "success";
        icon = <CheckCircleFilled className="mr-2" />;
        text = "已通过";
    } else if (stateReceived === "fail") {
        type = "danger";
        icon = <CloseCircleFilled className="mr-2" />;
        text = "未通过";
    } else {
        type = "warning";
        icon = <ExclamationCircleFilled className="mr-2" />;
        text = "待审核";
    }

    const handleOk = async (reason: string) => {
        await operateReview(id, "reject", reason);

        setIsModalOpen(false);
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
                    title="删除"
                    description="你确定删除该项吗？"
                    onCancel={() => {
                        delTravelNote();
                    }}
                    okText="确定"
                    cancelText="取消"
                >
                    <Button
                        danger
                        size="small"
                        style={{ marginLeft: 90 }}
                    >
                        删除
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
                    <Button
                        onClick={async () => {
                            await operateReview(id, "pass");
                        }}
                    >
                        通过
                    </Button>
                    <Button
                        onClick={() => {
                            setIsModalOpen(true);
                        }}
                    >
                        拒绝
                    </Button>
                    <RejectModal
                        isModalOpen={isModalOpen}
                        handleOk={handleOk}
                        handleCancel={handleCancel}
                    />
                </Flex>
            )}

            {stateReceived === "fail" ? <Paragraph className="w-32">不符合招录条件不符合招录符合招录条件</Paragraph> : null}
        </Flex>
    );
}
