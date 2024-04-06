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
import { Button, Flex, Typography } from "antd";
import { HighlightFilled, UpOutlined } from "@ant-design/icons";
import { ImageUploader, Toast, Popup } from "antd-mobile";
import DrawPanel from "./draw-canvas";
import { useContext, useState } from "react";
import React from "react";
import { SubmitInfoContext } from "@/app/lib/mobileEditContext";

const { Title, Text } = Typography;

export default function EditAlbumTab(): JSX.Element {

    const maxCount = 3;

    const [popupVisible, setPopupVisible] = useState(false);

    const { fileList, setFileList } = useContext(SubmitInfoContext);


    // const [fileList, setFileList] = useState<ImageUploadItem[]>([
    //     {
    //         url: "https://images.unsplash.com/photo-1567945716310-4745a6b7844b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60",
    //     },
    // ]);

    async function mockUpload(file: File) {
        return {
            url: URL.createObjectURL(file),
        };
    }

    return (
        <Flex
            vertical={true}
            justify="space-between"
            style={{ flex: 1 }}
            className="p-10"
        >
            <ImageUploader
                // style={{ '--cell-size': `${(screen.width - 80 - 15)/3}px` }}
                columns={3}
                value={fileList}
                onChange={setFileList}
                // onChange={(items) => {
                //     console.log(items);
                // }}
                upload={mockUpload}
                multiple
                maxCount={3}
                showUpload={fileList.length < maxCount}
                onCountExceed={(exceed) => {
                    Toast.show(`最多选择 ${maxCount} 张图片，你多选了 ${exceed} 张`);
                }}
            />

            <Button
                type="dashed"
                shape="round"
                onClick={() => {
                    setPopupVisible(true);
                }}
                style={{
                    height: 80,
                }}
            >
                <Flex
                    justify="space-between"
                    className="px-3"
                >
                    <Flex vertical={true}>
                        <Flex align="center">
                            <HighlightFilled className="mr-2" />
                            <Title
                                level={5}
                                className="m-0"
                            >
                                涂鸦
                            </Title>
                        </Flex>

                        <Text>可以随手画点日常生活吧！</Text>
                    </Flex>
                    <UpOutlined />
                </Flex>
            </Button>

            <Popup
                visible={popupVisible}
                destroyOnClose={true}
                onMaskClick={() => {
                    setPopupVisible(false);
                }}
                bodyStyle={{
                    borderTopLeftRadius: "16px",
                    borderTopRightRadius: "16px",
                    minHeight: "80vh",
                }}
            >
                <DrawPanel
                    back={() => {
                        setPopupVisible(false);
                    }}
                />
            </Popup>
        </Flex>
    );
}
