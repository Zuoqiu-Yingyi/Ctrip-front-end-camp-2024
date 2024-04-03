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
import React, { useRef, useState } from "react";
import { Modal, Swiper, TextArea } from "antd-mobile";
import { Layout, FloatButton } from "antd";
import { FileOutline, RedoOutline } from "antd-mobile-icons";

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

export default function EditTextTab(): JSX.Element {
    const [visible, setVisible] = useState(false);

    const [openButton, setOpenButton] = useState(false);

    const [value, setValue] = useState("");

    const insertedText = useRef<string>(textTemplates[0] as string);

    return (
        <Layout style={{ flex: 1 }}>
            <TextArea
                placeholder="请输入内容"
                value={value}
                onChange={(val) => {
                    setValue(val);
                }}
                rows={10}
                style={{ height: "100%", padding: "15px" }}
            />

            <FloatButton.Group
                shape="circle"
                open={openButton}
                trigger="click"
                style={{ top: "50px", height: "0px" }}
                onClick={() => {
                    setOpenButton(!openButton);
                }}
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
        </Layout>
    );
}
