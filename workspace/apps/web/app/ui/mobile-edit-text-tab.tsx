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
import React, { useContext, useRef, useState } from "react";
import { Modal, Swiper, TextArea, Divider, Tag, Space } from "antd-mobile";
import { FloatButton } from "antd";
import { FileOutline, RedoOutline } from "antd-mobile-icons";
import { SubmitInfoContext } from "@/context/mobileEditContext";

const textTemplates: string[] = [
    `费用：
路线: Day1…
     Day2…
           
住宿：
吃饭：`,
    `出发前带什么：
需要提前预约的：
行程：（景点，路程/交通方式，吃饭，住宿，网红景点打卡位置）
此次旅游小结`,
    `酒店：
交通：
行程：（具体景点，吃饭）
避雷点：`,
    `人均消费：
行程（具体景点，去了哪些店，消费了什么，什么值得买，什么不建议）
吃饭：
住宿：
交通：`,
];

const titleTemplates: string[] = ["**出发！", "*** *天*夜 人均**", "**去哪玩？", "****旅游攻略", "**** 超全避雷攻略"];

const items = textTemplates.map((value, index) => (
    <Swiper.Item key={`text_${index}`}>
        <TextArea
            placeholder="请输入内容"
            value={value}
            rows={10}
            readOnly
        />
    </Swiper.Item>
));

export default function EditTextTab(): JSX.Element {
    const { title, mainContent, resetMainContent, resetTitle } = useContext(SubmitInfoContext);

    const [visible, setVisible] = useState(false);

    const insertedText = useRef<string>(textTemplates[0] as string);

    // const rows = Math.floor((screen.height - 42 - 45 - 56 - 32 - 19 - 30) / 25.5);

    return (
        <div style={{ flex: 1 }}>
            <TextArea
                placeholder="请输入标题"
                value={title}
                onChange={(val) => {
                    resetTitle(val);
                }}
                rows={1}
                style={{ padding: "15px" }}
            />

            <Space
                className="px-2"
                style={{
                    overflowX: "auto",
                    width: "100%",
                }}
            >
                {titleTemplates.map((item, index) => (
                    <Tag
                        key={`tag_${index}`}
                        round
                        color="#CCCCCC"
                        style={{
                            fontSize: 13,
                            marginInline: 5,
                            paddingBlock: 4,
                            paddingInline: 8,
                        }}
                        onClick={() => {
                            resetTitle(item);
                        }}
                    >
                        {item}
                    </Tag>
                ))}
            </Space>

            <Divider
                style={{
                    borderColor: "#CCCCCC",
                    borderStyle: "dashed",
                }}
            />

            <TextArea
                placeholder="请输入内容"
                value={mainContent}
                onChange={(val) => {
                    resetMainContent(val);
                }}
                rows={13}
                style={{ padding: "15px" }}
            />

            <FloatButton.Group
                shape="square"
                style={{ top: "180px", height: "0px" }}
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
                    onClick={() => {
                        resetMainContent("");
                    }}
                />
            </FloatButton.Group>

            <Modal
                closeOnMaskClick={true}
                title="大纲"
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
                            resetMainContent(insertedText.current);
                            setVisible(false);
                        },
                    },
                ]}
                onClose={() => {
                    setVisible(false);
                }}
            />
        </div>
    );
}
