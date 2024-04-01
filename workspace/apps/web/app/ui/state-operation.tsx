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
import { EditFilled, CheckCircleFilled, ExclamationCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import React, { useState } from "react";
import { Button, Flex, Typography, Modal, Form, Radio, Input, Space } from "antd";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

export default function StateOperation({ stateReceived }: { stateReceived: "success" | "fail" | "waiting" }): JSX.Element {
    const [state, setState] = useState(stateReceived);

    const [isModalOpen, setIsModalOpen] = useState(false);

    let type: "secondary" | "success" | "warning" | "danger" = "secondary";

    let icon: React.ReactNode = null;

    let text: string = "error";

    if (state === "success") {
        type = "success";
        icon = <CheckCircleFilled className="mr-2" />;
        text = "已通过";
    } else if (state === "fail") {
        type = "danger";
        icon = <CloseCircleFilled className="mr-2" />;
        text = "未通过";
    } else {
        type = "warning";
        icon = <ExclamationCircleFilled className="mr-2" />;
        text = "待审核";
    }

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setState("success");
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <Flex
            vertical
            style={{ width: 130, justifyContent: "space-around",  alignItems: "center", marginLeft: 20 }}
        >
            <Title
                level={4}
                type={type}
            >
                {icon}
                {text}
                {/* {state === "waiting" ? (
                    <Button
                        icon={<EditFilled style={{ color: "#999999" }} />}
                        size="small"
                        type="text"
                        onClick={showModal}
                        style={{ marginLeft: 5 }}
                    />
                ) : null} */}
                <Modal
                    title="操作"
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    width={500}
                    okText="提交"
                    cancelText="取消"
                >
                    <Form
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 18 }}
                        layout="horizontal"
                        style={{ maxWidth: 600 }}
                        initialValues={{ operation: "pass" }}
                    >
                        <Form.Item
                            label="选项"
                            name="operation"
                        >
                            <Radio.Group>
                                <Radio value="pass"> 通过 </Radio>
                                <Radio value="reject"> 拒绝 </Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            label="拒绝理由"
                            name="reason"
                        >
                            <TextArea rows={5} />
                        </Form.Item>
                    </Form>
                </Modal>
            </Title>
            <Radio.Group
                options={[
                    { label: "通过", value: "Apple" },
                    { label: "拒绝", value: "Pear" },
                ]}
                optionType="button"
            />

            {/* <Radio.Group
                    
                    >
                            <Radio value={1}>同意</Radio>
                            <Radio value={2}>拒绝</Radio>
                    </Radio.Group> */}

            {state === "fail" ? <Paragraph className="w-32">不符合招录条件不符合招录符合招录条件</Paragraph> : null}
        </Flex>
    );
}
