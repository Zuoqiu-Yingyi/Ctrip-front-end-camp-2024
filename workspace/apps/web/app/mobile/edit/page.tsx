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
import React, { useContext, useEffect, useRef, useState } from "react";
import { NavBar, Tabs, Space, Button, SpinLoading } from "antd-mobile";
import { Layout } from "antd";
import { CloseCircleFill, FillinOutline, PicturesOutline, VideoOutline } from "antd-mobile-icons";
import EditTab from "@/ui/mobile-edit-tab";
import { SubmitInfoContext } from "@/context/mobileEditContext";
import { initAccount } from "@/utils/account";

export default function EditPage(): JSX.Element {
    const [tab, setTab] = useState<"text" | "album" | "camera">("text");

    const [onPress, setOnPress] = useState(false);

    const { uploadTrvalNote, user } = useContext(SubmitInfoContext);

    const flag = useRef(true);

    useEffect(() => {

        if (flag.current) {
            flag.current = false;

            (async () => {
                await initAccount(undefined, user.current);
            })();            
        }
        
    }, [])

    return (
        <Layout style={{ height: "100vh" }}>
            <NavBar
                backArrow={<CloseCircleFill color="#CCCCCC" />}
                right={
                    <Space>
                        { onPress && <SpinLoading style={{ '--size': '20px' }}/>}
                        <Button
                            block
                            size="mini"
                            shape="rounded"
                            disabled={onPress}                            
                            style={{
                                marginLeft: "auto",
                                width: 90,
                            }}
                            onClick={async () => {
                                setOnPress(true);
                                await uploadTrvalNote("draft");
                                setOnPress(false);
                            }}
                        >
                            存为草稿
                        </Button>
                        <Button
                            block
                            size="mini"
                            shape="rounded"
                            color="primary"
                            disabled={onPress}                            
                            style={{
                                marginLeft: "auto",
                                width: 60,
                            }}
                            onClick={async () => {
                                setOnPress(true);
                                await uploadTrvalNote("submit");
                                setOnPress(false);
                            }}
                        >
                            发布
                        </Button>
                    </Space>
                }
            />

            <EditTab tabKey={tab} />

            <Tabs
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
        </Layout>
    );
}
