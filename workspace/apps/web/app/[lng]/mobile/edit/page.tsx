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
import React, { useState } from "react";
import { NavBar, Tabs, Space } from "antd-mobile";
import { Layout } from "antd";
import { CloseCircleFill, FillinOutline, PicturesOutline, VideoOutline } from "antd-mobile-icons";
import EditTab from "@/app/ui/mobile-edit-tab";


export default function EditPage({ params: { lng } }: { params: { lng: string } }): JSX.Element {

    const [tab, setTab] = useState<"text" | "album" | "camera">("text");

    return (
        <Layout style={{ height: "100vh" }}>
            <NavBar backArrow={<CloseCircleFill color="#CCCCCC" />} />

            <EditTab tabKey={tab} />

            <Tabs
                // style={{ position: "absolute", bottom: "0", width: "100%" }}
                onChange={(key: string) => {
                    setTab(key as "text" | "album" | "camera");
                }}
            >
                <Tabs.Tab
                    title={
                        <Space align="center">
                            <FillinOutline className="mt-1" />
                            文字
                        </Space>
                    }
                    key="text"
                />
                <Tabs.Tab
                    title={
                        <Space align="center">
                            <PicturesOutline className="mt-1" />
                            相册
                        </Space>
                    }
                    key="album"
                />
                <Tabs.Tab
                    title={
                        <Space align="center">
                            <VideoOutline className="mt-1" />
                            拍摄
                        </Space>
                    }
                    key="camera"
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
