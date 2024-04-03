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
import React, { useRef, useState } from "react";
import { NavBar, Button, Tabs, ActionSheet, Modal, Swiper } from "antd-mobile";
import { Layout, FloatButton } from "antd";
import { Form, Input, Dialog, TextArea, DatePicker, Selector, Slider, Stepper, Switch, Space } from "antd-mobile";
import { CloseCircleFill, AddOutline, TextOutline, FillinOutline, PicturesOutline, VideoOutline, FileOutline, RedoOutline, CloseOutline } from "antd-mobile-icons";
import type { Action, ActionSheetShowHandler } from "antd-mobile/es/components/action-sheet";

const colors = ["#ace0ff", "#bcffbd", "#e4fabd", "#ffcfac"];

const textTemplates: string[] = ["景点：\n人数: \n花费: \n", "景点：\n人数: \n花费: \n", "景点：\n人数: \n花费: \n", "景点：\n人数: \n花费: \n"];

const items = colors.map((color, index) => (
    <Swiper.Item key={index}>
        <TextArea
            placeholder="请输入内容"
            value={"景点：\n人数: \n花费: \n"}
            rows={10}
            readOnly
        />
    </Swiper.Item>
));

export default function EditPage({ params: { lng } }: { params: { lng: string } }): JSX.Element {
    const [visible, setVisible] = useState(false);

    const [openButton, setOpenButton] = useState(false);

    const [value, setValue] = useState("");

    const insertedText = useRef<string>(textTemplates[0] as string);

    return (
        <Layout style={{ height: "100vh" }}>
            <NavBar backArrow={<CloseCircleFill color="#CCCCCC" />} />
            <TextArea
                placeholder="请输入内容"
                value={value}
                onChange={(val) => {
                    setValue(val);
                }}
                rows={10}
                style={{ flex: 1, height: "100%", padding: "15px" }}
            />

            <FloatButton.Group
                shape="circle"
                open={openButton}
                trigger="click"
                style={{ top: "50px", height: "0px" }}
                onClick={() => {setOpenButton(!openButton)}}
            >
                <FloatButton
                    icon={<FileOutline />}
                    description="大纲"
                    onClick={() => {
                        setVisible(true);
                    }}
                />
                <FloatButton
                    icon={<RedoOutline />}
                    description="清空"
                />
            </FloatButton.Group>

            <Modal
                closeOnMaskClick={true}
                title="文字模板"
                showCloseButton={true}
                visible={visible}
                content={
                    <Swiper
                        onIndexChange={(index: number) => {
                            insertedText.current = textTemplates[index] as string;
                        }}
                    >
                        {items}
                    </Swiper>
                }
                actions={[
                    {
                        key: "insert",
                        text: "插入",
                        primary: true,
                        onClick: () => {
                            setValue(insertedText.current);
                            setVisible(false);
                        },
                    },
                ]}
            />
            {/* <ActionSheet
                visible={visible}
                actions={actions}
                onClose={() => setVisible(false)}
            /> */}
            {/* <div className="bg-edit-background bg-cover"></div> */}
            <Tabs
            // style={{ position: "absolute", bottom: "0", width: "100%" }}
            >
                <Tabs.Tab
                    title={
                        <Space align="center">
                            <FillinOutline className="mt-1" />
                            文字
                        </Space>
                    }
                    key="fruits"
                />
                <Tabs.Tab
                    title={
                        <Space align="center">
                            <PicturesOutline className="mt-1" />
                            相册
                        </Space>
                    }
                    key="vegetables"
                />
                <Tabs.Tab
                    title={
                        <Space align="center">
                            <VideoOutline className="mt-1" />
                            拍摄
                        </Space>
                    }
                    key="animals"
                />
            </Tabs>
            {/* <NavBar backArrow={<CloseCircleFill color="#CCCCCC" />} />
            <Form
                layout="horizontal"
                footer={
                    <Button
                        block
                        type="submit"
                        color="primary"
                        size="large"
                    >
                        提交
                    </Button>
                }
                style={{
                    "--border-bottom": "null",
                    "--border-top": "null",
                    "--border-inner": "null",
                }}                
            >
                <Form.Item name="img" noStyle={true} 

                >
                    <Button
                        fill="none"
                        className="ml-5"
                        style={{ width: 100, height: 100, backgroundColor: "#f7f7f7", marginLeft: 20 }}
                    >
                        <AddOutline
                            color="#CCCCCC"
                            fontSize={20}
                            style={{ fontWeight: "bold" }}
                        />
                    </Button>
                    <Button
                        fill="none"
                        className="ml-5"
                        style={{ width: 100, height: 100, backgroundColor: "#f7f7f7", marginLeft: 20 }}
                    >
                        <AddOutline
                            color="#CCCCCC"
                            fontSize={20}
                        />
                    </Button>
                </Form.Item>

                <Form.Item
                    name="title"
                    rules={[{ required: true, message: "姓名不能为空!" }]}
                >
                    <Input placeholder="请输入标题" />
                </Form.Item>

                <Form.Item
                    name="content"
                    rules={[{ required: true, message: "姓名不能为空!" }]}
                >
                    <TextArea placeholder='添加正文' rows={5} />
                </Form.Item>
            </Form> */}
        </Layout>
    );
}
